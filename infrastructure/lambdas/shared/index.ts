import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

export const notifyAllAtTable = async (apiGateway: ApiGatewayManagementApiClient, ddb: DynamoDBClient, table: string, body: object) => {
    const queryParams = {
        TableName: 'PlanningPokerTable',
        ExpressionAttributeValues: {
            ':tableName': { S: table }
        },
        KeyConditionExpression: 'TableName = :tableName'
    };

    const userData = await ddb.send(new QueryCommand(queryParams));

    const postCalls = userData.Items?.map(async (item) => {
        const user = unmarshall(item);
        try {
            await apiGateway.send(new PostToConnectionCommand({
                ConnectionId: user.ConnectionId,
                Data: new TextEncoder().encode(JSON.stringify(body))
            }));
        } catch (e) {
            console.error("Error posting to connection", e);
        }
    });

    if (postCalls) {
        await Promise.all(postCalls);
    }
}
