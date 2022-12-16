import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
   console.log(`Event: ${JSON.stringify(event, null, 2)}`);
   console.log(`Context: ${JSON.stringify(context, null, 2)}`);

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
   const userName: string = JSON.parse(event.body).userName;
   const connectionId: string = event.requestContext?.connectionId;

   const document = {
      TableName: tableName,
      TableCreateDateTime: Date.now(),
      UserName: userName,
      ConnectionId: connectionId
   };

   const params: PutItemCommandInput = {
      TableName: "PlanningPokerTable",
      Item: marshall(document)
   };

   const run = async function () {
      try {
         const results = await client.send(new PutItemCommand(params));
         console.log(results);
      } catch (err) {
         console.error(err);
      }
   };

   await run();

   return {
      statusCode: 200,
      body: JSON.stringify({
         "message": "userjoined",
         "username": userName
      })
   };
};