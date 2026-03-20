import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient, DeleteItemCommand, DeleteItemCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';

export const handler = async (event: APIGatewayEvent, context: Context) : Promise<APIGatewayProxyResult> => {
    const client = new DynamoDBClient({ region: "us-west-2" });

    const deleteByConnectionId = async (tableName: string) => {

        const scanFilter: ScanCommandInput = {
            TableName: tableName,
            FilterExpression: "ConnectionId = :connectionId",
            ExpressionAttributeValues: { ":connectionId": { S: event.requestContext.connectionId || '' } }
        }
    
        const recordsToDelete = await client.send(new ScanCommand(scanFilter))
        const numberOfRecordsToDelete = recordsToDelete.Count || 0;
    
        for (let i = 0; i < numberOfRecordsToDelete; i++) {
            const item = recordsToDelete.Items ? recordsToDelete.Items[i] : {};
            const itemToDelete = unmarshall(item);
    
            const params: DeleteItemCommandInput = {
                TableName: tableName,
                Key: { 'TableName': { S: itemToDelete.TableName }, 'ConnectionId': { S: String(itemToDelete.ConnectionId) } }
            };
    
            try {
                const response = await client.send(new DeleteItemCommand(params));
                console.log(response.$metadata);
            } catch (e) {
                console.log(e)
            }
        }
    };

    await deleteByConnectionId('PlanningPokerTable');
    await deleteByConnectionId('PlanningPokerVote');

    return {
        statusCode: 200,
        body: JSON.stringify({
            "message": "userdisconnected"
        })
    };
}