import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDB, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const client = new DynamoDB({ region: "us-west-2" });
    const apiGatewayClient = new ApiGatewayManagementApi({ endpoint: 'https://733l6u90dc.execute-api.us-west-2.amazonaws.com/dev' })

    if (event.body === null) {
        return {
           statusCode: 400,
           body: JSON.stringify({
              "message": "body is empty"
           })
        }
     }

    const queryParams: QueryCommandInput = {
        TableName: 'PlanningPokerTable',
        ExpressionAttributeValues: {
            ':tableName': { S: JSON.parse(event.body).tableName }
        },
        KeyConditionExpression: 'TableName = :tableName'
    };

    function sanitizeMessage(message:string):string{
        switch(message){
            case 'reveal-efforts':
                return message;
            default:
                throw new Error('unrecognized action')
        }
    }

    const message = sanitizeMessage(JSON.parse(event.body).message);

    const userData = await client.query(queryParams);

    const totalUsersAtTable = userData.Count || 0;

    for (let i = 0; i < totalUsersAtTable; i++) {
        const item = userData.Items ? userData.Items[i] : {};
        const userObj = unmarshall(item);

        try {
            await apiGatewayClient.postToConnection({
                ConnectionId: userObj.ConnectionId,
                Data: new TextEncoder().encode(JSON.stringify({
                    message: message                                                                                                                               
                }))
            });
        } catch (e) {
            console.error("Error", e);
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
           "message": "the message",
        })
     };
}