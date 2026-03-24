import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient, DeleteItemCommand, DeleteItemCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({});

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const connectionId = event.requestContext?.connectionId;
    const tableNameEnv = process.env.TABLE_NAME || 'PlanningPokerTable';
    const voteTableNameEnv = process.env.VOTE_TABLE_NAME || 'PlanningPokerVote';

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

    try {
        const userData = await client.send(new QueryCommand(queryParams));
        const items = userData.Items || [];
    
        const deletePromises = items.map(item => {
            const userObj = unmarshall(item);
            const params: DeleteItemCommandInput = {
                TableName: voteTableNameEnv,
                Key: marshall({ TableName: tableName, ConnectionId: userObj.ConnectionId })
            };
            return client.send(new DeleteItemCommand(params));
        });
        await Promise.all(deletePromises);
        return { statusCode: 200, body: JSON.stringify({ message: "votes-reset" }) };
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
    }
}