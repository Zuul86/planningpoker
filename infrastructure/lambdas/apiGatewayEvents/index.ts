import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient, DeleteItemCommand, DeleteItemCommandInput, ScanCommand, ScanCommandInput, QueryCommand, QueryCommandInput, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Message } from './message.enum';
import { notifyAllAtTable } from '../shared';
import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';

const client = new DynamoDBClient({ region: "us-west-2" });
const apiGatewayClient = new ApiGatewayManagementApiClient({ endpoint: process.env.API_GATEWAY_URL });

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const connectionId = event.requestContext?.connectionId;
    const routeKey = event.requestContext?.routeKey;
    const tableNameEnv = process.env.TABLE_NAME || 'PlanningPokerTable';
    const voteTableNameEnv = process.env.VOTE_TABLE_NAME || 'PlanningPokerVote';

    switch (routeKey) {
        case Message.Disconnect: {
            const deleteByConnectionId = async (tableName: string) => {
                const scanFilter: ScanCommandInput = {
                    TableName: tableName,
                    FilterExpression: "ConnectionId = :connectionId",
                    ExpressionAttributeValues: { ":connectionId": { S: connectionId || '' } }
                }
                const recordsToDelete = await client.send(new ScanCommand(scanFilter))
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
        case Message.JoinTable: {
            if (!event.body) {
                return { statusCode: 400, body: JSON.stringify({ message: "body is empty" }) };
            }
            if (!connectionId) {
                return { statusCode: 400, body: JSON.stringify({ message: "connectionId is empty" }) };
            }

            const parsedBody = JSON.parse(event.body);
            const tableName = parsedBody.tableName;
            const userName = parsedBody.userName;

            const document = {
                TableName: tableName,
                ConnectionId: connectionId,
                UserName: userName
            };

            const params: PutItemCommandInput = {
                TableName: tableNameEnv,
                Item: marshall(document)
            };

            try {
                await client.send(new PutItemCommand(params));
            } catch (err) {
                console.error(err);
            }

            return { statusCode: 200, body: JSON.stringify({}) };
        }
        case Message.UserVoted: {
            if (!event.body) {
                return { statusCode: 400, body: JSON.stringify({ message: "body is empty" }) };
            }
            if (!connectionId) {
                return { statusCode: 400, body: JSON.stringify({ message: "connectionId is empty" }) };
            }

            const parsedBody = JSON.parse(event.body);
            const tableName = parsedBody.tableName;
            const effort = parsedBody.effort;

            const document = {
                TableName: tableName,
                ConnectionId: connectionId,
                Effort: effort
            };

            const params: PutItemCommandInput = {
                TableName: voteTableNameEnv,
                Item: marshall(document)
            };

            try {
                await client.send(new PutItemCommand(params));
            } catch (err) {
                console.error(err);
            }

            return { statusCode: 200, body: JSON.stringify({}) };
        }
        case Message.ResetVote: {
            if (!event.body) {
                return { statusCode: 400, body: JSON.stringify({ message: "body is empty" }) };
            }
            if (!connectionId) {
                return { statusCode: 400, body: JSON.stringify({ message: "connectionId is empty" }) };
            }

            const parsedBody = JSON.parse(event.body);
            const tableName = parsedBody.tableName;

            const queryParams: QueryCommandInput = {
                TableName: tableNameEnv,
                ExpressionAttributeValues: { ':tableName': { S: tableName } },
                KeyConditionExpression: 'TableName = :tableName'
            };

        const userData = await client.send(new QueryCommand(queryParams));
        const items = userData.Items || [];

        const deletePromises = items.map(item => {
                const userObj = unmarshall(item);
                const params: DeleteItemCommandInput = {
                    TableName: voteTableNameEnv,
                    Key: marshall({ TableName: tableName, ConnectionId: userObj.ConnectionId })
                };
            return client.send(new DeleteItemCommand(params)).catch(err => console.error(err));
        });
        await Promise.all(deletePromises);
            return { statusCode: 200, body: JSON.stringify({ message: "votes-reset" }) };
        }
        case Message.RevealEfforts: {
            if (!event.body) {
                return { statusCode: 400, body: JSON.stringify({ message: "body is empty" }) };
            }
        
            const body = JSON.parse(event.body);
            const tableName = body.tableName;
            await notifyAllAtTable(apiGatewayClient, client, tableName, { message: Message.RevealEfforts });
            return { statusCode: 200, body: JSON.stringify({ message: "notify-all" }) };
        }
        case '$default': {
        
            return { statusCode: 400, body: JSON.stringify({ message: "unrecognized action" }) };
        }
    }

    return { statusCode: 400, body: JSON.stringify({ message: "unrecognized action" }) };
}