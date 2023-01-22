import { Context, DynamoDBStreamEvent } from 'aws-lambda';
import { DynamoDB, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";

export const handler = async (event: DynamoDBStreamEvent, context: Context) => {
    const client = new DynamoDB({ region: 'us-west-2' })
    const apiGatewayClient = new ApiGatewayManagementApi({ endpoint: process.env.API_GATEWAY_URL })

    for (const record of event.Records) {
        let tablejoined = record.dynamodb?.NewImage?.TableName.S;

        if (!tablejoined) {
            tablejoined = record.dynamodb?.OldImage?.TableName.S || ''
        }

        const queryParams: QueryCommandInput = {
            TableName: 'PlanningPokerTable',
            ExpressionAttributeValues: {
                ':tableName': { S: tablejoined }
            },
            KeyConditionExpression: 'TableName = :tableName'
        };

        const userData = await client.query(queryParams);

        const queryVotesParams: QueryCommandInput = {
            TableName: 'PlanningPokerVote',
            ExpressionAttributeValues: {
                ':tableName': { S: tablejoined }
            },
            KeyConditionExpression: 'TableName = :tableName'
        };

        const voteResult = await client.query(queryVotesParams);

        const votes = voteResult.Items || []

        const totalUsersAtTable = userData.Count || 0;

        for (let i = 0; i < totalUsersAtTable; i++) {
            const item = userData.Items ? userData.Items[i] : {};
            const userObj = unmarshall(item);
            const tableResponse = {
                message: 'notify-vote',
                votes: votes.map(x => ({ user: userData.Items?.find(u => (u.ConnectionId.S === x.ConnectionId.S))?.UserName.S, effort: x.Effort.N }))
            }

            try {
                await apiGatewayClient.postToConnection({
                    ConnectionId: userObj.ConnectionId,
                    Data: new TextEncoder().encode(JSON.stringify(tableResponse))
                });
            } catch (e) {
                console.error("Error", e);
            }
        }
    }

    return { statusCode: 200 };
};