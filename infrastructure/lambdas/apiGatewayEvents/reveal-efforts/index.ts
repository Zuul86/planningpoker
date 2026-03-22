import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { notifyAllAtTable } from '../../shared';

const client = new DynamoDBClient({ region: "us-west-2" });
const apiGatewayClient = new ApiGatewayManagementApiClient({ endpoint: process.env.API_GATEWAY_URL });

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return { statusCode: 400, body: JSON.stringify({ message: "body is empty" }) };
    }

    const body = JSON.parse(event.body);
    const tableName = body.tableName;
    await notifyAllAtTable(apiGatewayClient, client, tableName, { message: 'reveal-efforts' });
    return { statusCode: 200, body: JSON.stringify({ message: "notify-all" }) };
}