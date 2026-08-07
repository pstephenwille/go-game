import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ScanCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { dynamoClient } from "@/db.config";
import { app , options } from "@/app";
import Fastify from 'fastify';


const server = Fastify({
  logger: false,
  ...options
})

const TABLE_NAME = "Users";

/**
 * Industry-norm helper to truncate tables when working with live containers.
 * This guarantees a clean data state between individual test executions.
 */
async function clearTable() {
  const scanResult = await dynamoClient.send(new ScanCommand({
    TableName: TABLE_NAME,
    ProjectionExpression: "id"
  }));

  if (!scanResult.Items || scanResult.Items.length === 0) return;

  const deletePromises = scanResult.Items.map((item) =>
    dynamoClient.send(new DeleteItemCommand({
      TableName: TABLE_NAME,
      Key: { id: item.id }
    }))
  );

  await Promise.all(deletePromises);
}

describe("POST & GET /index (Local Container Integration)", () => {
  // Wipe the Docker database clean before every single test run
  beforeEach(async () => {
    await clearTable();
    await server.register(app)
  });

  afterEach(async()=>{
    await server.close()
  })

  it.only("should create a new user, validate schemas, and persist to Docker DynamoDB", async () => {

    // 1. Inject a POST request into the Fastify engine
    const postResponse = await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        name: "Alex Dev",
        email: "alex@example.com"
      }
    });

    // 2. Validate response attributes and types
    expect(postResponse.statusCode).toBe(201);

    const createdUser = postResponse.json();
    expect(createdUser).toHaveProperty("id");
    expect(createdUser.name).toBe("Alex Dev");

    // 3. Inject a subsequent GET request to ensure read-after-write consistency
    const getResponse = await server.inject({
      method: "GET",
      url: `/users/${createdUser.id}`
    });

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.json()).toEqual(createdUser);
  });

  it("should return a 400 bad request if payload fails Zod schema verification", async () => {
    // Inject an invalid payload (missing mandatory email)
    const response = await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        name: "Broken Request"
      }
    });

    // Fastify automatically handles Zod errors if using fastify-type-provider-zod
    expect(response.statusCode).toBe(400);
  });
});
