import { Context, DynamoDBStreamEvent } from 'aws-lambda';
import { DynamoDB, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Message } from '../../../web/planning-poker-app/src/enums/message.enum';

export const handler = async (event: DynamoDBStreamEvent, context: Context) => {
    const client = new DynamoDB({ region: 'us-west-2' });

    for (const record of event.Records) {
        let tablejoined = record.dynamodb?.NewImage?.TableName?.S || record.dynamodb?.OldImage?.TableName?.S || '';
        
        if (!tablejoined) {
            continue;
        }

        const eventSourceARN = record.eventSourceARN || '';
        
        if (eventSourceARN.includes('PlanningPokerTable')) {
            const queryParams: QueryCommandInput = {
                TableName: 'PlanningPokerTable',
                ExpressionAttributeValues: { ':tableName': { S: tablejoined } },
                KeyConditionExpression: 'TableName = :tableName'
            };
            const userData = await client.query(queryParams);
            const usersAtTable = userData.Items?.map((x) => (unmarshall(x).UserName)) || [];

            await notifyAllAtTable(tablejoined, {
                message: Message.UserJoined,
                userName: usersAtTable
            });

        } else if (eventSourceARN.includes('PlanningPokerVote')) {
            const queryTableParams: QueryCommandInput = {
                TableName: 'PlanningPokerTable',
                ExpressionAttributeValues: { ':tableName': { S: tablejoined } },
                KeyConditionExpression: 'TableName = :tableName'
            };
            const userData = await client.query(queryTableParams);

            const queryVotesParams: QueryCommandInput = {
                TableName: 'PlanningPokerVote',
                ExpressionAttributeValues: { ':tableName': { S: tablejoined } },
                KeyConditionExpression: 'TableName = :tableName'
            };
            const voteResult = await client.query(queryVotesParams);
            const votes = voteResult.Items || [];

            await notifyAllAtTable(tablejoined, {
                message: Message.UserVoted,
                votes: votes.map(x => ({
                    user: userData.Items?.find(u => u.ConnectionId.S === x.ConnectionId.S)?.UserName.S,
                    effort: x.Effort.N
                }))
            });
        }
    }

    return { statusCode: 200 };
};