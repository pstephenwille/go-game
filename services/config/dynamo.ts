import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const TABLE_NAME='Users-dev'

 const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-west-1",
  endpoint: process.env.AWS_DYNAMO_ENDPOINT,
  credentials:  {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});
// console.log('%c...yyy', 'color:gold',   dynamoClient);

export {dynamoClient, TABLE_NAME}
