import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: "us-west-2" });

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const connectionId = event.requestContext?.connectionId;
    const tableNameEnv = process.env.TABLE_NAME || 'PlanningPokerTable';

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