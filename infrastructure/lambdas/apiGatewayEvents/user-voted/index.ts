import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({});

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const connectionId = event.requestContext?.connectionId;
    const voteTableNameEnv = process.env.VOTE_TABLE_NAME || 'PlanningPokerVote';

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
        return { statusCode: 200, body: JSON.stringify({}) };
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
    }
}