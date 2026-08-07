import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-west-1",
  endpoint: process.env.AWS_ENDPOINT_URL!,
  credentials:  {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});
