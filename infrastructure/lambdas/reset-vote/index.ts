import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDB, DeleteItemCommand, DeleteItemCommandInput, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const client = new DynamoDB({ region: "us-west-2" });

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

    const queryParams: QueryCommandInput = {
        TableName: 'PlanningPokerTable',
        ExpressionAttributeValues: {
            ':tableName': { S: JSON.parse(event.body).tableName }
        },
        KeyConditionExpression: 'TableName = :tableName'
    };
    
    const userData = await client.query(queryParams);

    const totalUsersAtTable = userData.Count || 0;

    for (let i = 0; i < totalUsersAtTable; i++) {
        const item = userData.Items ? userData.Items[i] : {};
        const userObj = unmarshall(item);

        const document = {
            TableName: tableName,
            ConnectionId: userObj.ConnectionId,
        };
    
        const params: DeleteItemCommandInput = {
            TableName: "PlanningPokerVote",
            Key: marshall(document)
        };
    
        try {
            const results = await client.send(new DeleteItemCommand(params));
            console.log(results);
        } catch (err) {
            console.error(err);
        }
    
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            "message": "votes-reset"
        })
    };
}
