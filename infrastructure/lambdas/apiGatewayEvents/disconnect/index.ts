import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient, DeleteItemCommand, DeleteItemCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: "us-west-2" });

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const connectionId = event.requestContext?.connectionId;
    const tableNameEnv = process.env.TABLE_NAME || 'PlanningPokerTable';
    const voteTableNameEnv = process.env.VOTE_TABLE_NAME || 'PlanningPokerVote';

    const deleteByConnectionId = async (tableName: string) => {
        const queryFilter: QueryCommandInput = {
            TableName: tableName,
            IndexName: 'ConnectionIdIndex',
            KeyConditionExpression: "ConnectionId = :connectionId",
            ExpressionAttributeValues: { ":connectionId": { S: connectionId || '' } }
        }
        const recordsToDelete = await client.send(new QueryCommand(queryFilter))
        const items = recordsToDelete.Items || [];

        const deletePromises = items.map(item => {
            const itemToDelete = unmarshall(item);
            const params: DeleteItemCommandInput = {
                TableName: tableName,
                Key: { 'TableName': { S: itemToDelete.TableName }, 'ConnectionId': { S: String(itemToDelete.ConnectionId) } }
            };
            return client.send(new DeleteItemCommand(params)).catch(e => console.error("Delete Error", e));
        });
        await Promise.all(deletePromises);
    };

    await deleteByConnectionId(tableNameEnv);
    await deleteByConnectionId(voteTableNameEnv);

    return { statusCode: 200, body: JSON.stringify({ message: "userdisconnected" }) };
}