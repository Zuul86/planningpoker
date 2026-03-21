import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient, DeleteItemCommand, DeleteItemCommandInput, ScanCommand, ScanCommandInput, DynamoDB, QueryCommandInput, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { notifyAllAtTable } from '../utils/notify-all-at-table';
import { Message } from '../../../web/planning-poker-app/src/enums/message.enum';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const client = new DynamoDBClient({ region: "us-west-2" });
    const docClient = new DynamoDB({ region: "us-west-2" });
    
    const connectionId = event.requestContext?.connectionId;
    const routeKey = event.requestContext?.routeKey;

    if (routeKey === '$disconnect') {
        const deleteByConnectionId = async (tableName: string) => {
            const scanFilter: ScanCommandInput = {
                TableName: tableName,
                FilterExpression: "ConnectionId = :connectionId",
                ExpressionAttributeValues: { ":connectionId": { S: connectionId || '' } }
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
                    await client.send(new DeleteItemCommand(params));
                } catch (e) {
                    console.error("Delete Error", e)
                }
            }
        };

        await deleteByConnectionId('PlanningPokerTable');
        await deleteByConnectionId('PlanningPokerVote');

        return { statusCode: 200, body: JSON.stringify({ message: "userdisconnected" }) };
    }

    if (routeKey === 'join-table') {
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
            TableName: "PlanningPokerTable",
            Item: marshall(document)
        };

        try {
            await client.send(new PutItemCommand(params));
        } catch (err) {
            console.error(err);
        }

        return { statusCode: 200, body: JSON.stringify({}) };
    }

    if (routeKey === 'vote-effort') {
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
            TableName: "PlanningPokerVote",
            Item: marshall(document)
        };

        try {
            await client.send(new PutItemCommand(params));
        } catch (err) {
            console.error(err);
        }

        return { statusCode: 200, body: JSON.stringify({}) };
    }

    if (!event.body) {
        return { statusCode: 400, body: JSON.stringify({ message: "body is empty" }) };
    }

    const body = JSON.parse(event.body);
    const tableName = body.tableName;
    const action = body.action;

    if (action === 'reset-vote') {
        if (!connectionId) {
            return { statusCode: 400, body: JSON.stringify({ message: "connectionId is empty" }) };
        }

        const queryParams: QueryCommandInput = {
            TableName: 'PlanningPokerTable',
            ExpressionAttributeValues: { ':tableName': { S: tableName } },
            KeyConditionExpression: 'TableName = :tableName'
        };
        
        const userData = await docClient.query(queryParams);
        const totalUsersAtTable = userData.Count || 0;

        for (let i = 0; i < totalUsersAtTable; i++) {
            const item = userData.Items ? userData.Items[i] : {};
            const userObj = unmarshall(item);
            const params: DeleteItemCommandInput = {
                TableName: "PlanningPokerVote",
                Key: marshall({ TableName: tableName, ConnectionId: userObj.ConnectionId })
            };
            try { await client.send(new DeleteItemCommand(params)); } catch (err) { console.error(err); }
        }
        return { statusCode: 200, body: JSON.stringify({ message: "votes-reset" }) };
    }

    if (action === Message.RevealEfforts) {
        await notifyAllAtTable(tableName, { message: action });
        return { statusCode: 200, body: JSON.stringify({ message: "notify-all" }) };
    }

    return { statusCode: 400, body: JSON.stringify({ message: "unrecognized action" }) };
}