import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const client = new DynamoDBClient({ region: "us-west-2" });

    if (event.body === null) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                "message": "body is empty"
            })
        }
    }

    if (!event.requestContext?.connectionId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                "message": "connectionId is empty"
            })
        }
    }
    const tableName: string = JSON.parse(event.body).tableName;
    const effort: number = JSON.parse(event.body).effort;
    const connectionId: string = event.requestContext?.connectionId;

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
        const results = await client.send(new PutItemCommand(params));
        console.log(results);
    } catch (err) {
        console.error(err);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            "message": "userVoted"
        })
    };
}
