import { Context, DynamoDBStreamEvent } from 'aws-lambda';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";
import { Message } from '../../../web/planning-poker-app/src/enums/message.enum';
import { notifyAllAtTable } from '../shared';

export const handler = async (event: DynamoDBStreamEvent, context: Context) => {
    const ddb = new DynamoDBClient({ region: 'us-west-2' });
    const apiGatewayClient = new ApiGatewayManagementApiClient({ endpoint: process.env.API_GATEWAY_URL });
    const tableNameEnv = process.env.TABLE_NAME || 'PlanningPokerTable';
    const voteTableNameEnv = process.env.VOTE_TABLE_NAME || 'PlanningPokerVote';

    for (const record of event.Records) {
        let tablejoined = record.dynamodb?.NewImage?.TableName?.S || record.dynamodb?.OldImage?.TableName?.S || '';
        
        if (!tablejoined) {
            continue;
        }

        const eventSourceARN = record.eventSourceARN || '';
        
        if (eventSourceARN.includes(tableNameEnv)) {
            const queryParams = {
                TableName: tableNameEnv,
                ExpressionAttributeValues: { ':tableName': { S: tablejoined } },
                KeyConditionExpression: 'TableName = :tableName'
            };
            const userData = await ddb.send(new QueryCommand(queryParams));
            const usersAtTable = userData.Items?.map((x) => (unmarshall(x).UserName)) || [];

            await notifyAllAtTable(apiGatewayClient, ddb, tablejoined, {
                message: Message.UserJoined,
                userName: usersAtTable
            });

        } else if (eventSourceARN.includes(voteTableNameEnv)) {
            const queryTableParams = {
                TableName: tableNameEnv,
                ExpressionAttributeValues: { ':tableName': { S: tablejoined } },
                KeyConditionExpression: 'TableName = :tableName'
            };
            const userData = await ddb.send(new QueryCommand(queryTableParams));

            const queryVotesParams = {
                TableName: voteTableNameEnv,
                ExpressionAttributeValues: { ':tableName': { S: tablejoined } },
                KeyConditionExpression: 'TableName = :tableName'
            };
            const voteResult = await ddb.send(new QueryCommand(queryVotesParams));
            const votes = voteResult.Items || [];

            await notifyAllAtTable(apiGatewayClient, ddb, tablejoined, {
                message: Message.UserVoted,
                votes: votes.map(x => {
                    const unmarshalledVote = unmarshall(x);
                    const user = userData.Items?.find(u => unmarshall(u).ConnectionId === unmarshalledVote.ConnectionId)
                    return {
                        user: user ? unmarshall(user).UserName : '',
                        effort: unmarshalledVote.Effort
                    }
                })
            });
        }
    }

    return { statusCode: 200 };
};