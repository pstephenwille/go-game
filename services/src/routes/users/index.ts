import { type FastifyPluginAsync } from 'fastify'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

/* TODO: 8/6/26, stephen; create user schema
*   import zod */
const TABLE_NAME = 'Users';

const clientConfig = { region: 'us-east-1', endpoint: '', credentials: {} };

if (process.env.STAGE === 'dev') {
  clientConfig.endpoint = 'http://localhost:8000';
  clientConfig.credentials = { accessKeyId: 'localKey', secretAccessKey: 'localSecret' };
}

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient(clientConfig));

const users: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/users/:id', async function (request, reply) {
    const { id } = request.params;

    const params = {
      TableName: TABLE_NAME,
      Key: {
        userId: id // Ensure this matches your table's exact Partition Key name
      }
    };


    try {
      // Send the GetCommand to DynamoDB
      const result = await docClient.send(new GetCommand(params));

      // If the item does not exist, return a 404
      if (!result.Item) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return { user: result.Item };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  })

  fastify.put('/users/:id', async function (_request, _reply) {
    return 'put user'
  })

  fastify.post('/users', async function (request, reply) {
    const { email } = request.body
    const userId = uuidv4();
    const timestamp = new Date().toISOString();
    const newUser = {
      email, userId,
      createdAt: timestamp,
      updatedAt: timestamp
    }

    const params = {
      TableName: TABLE_NAME,
      Item: newUser,
      ConditionExpression: 'attribute_not_exists(userId)'
    };
console.log('%c...post', 'color:gold',   email);

    try {
      await docClient.send(new PutCommand(params));
      return reply.status(201).send({ message: 'User created successfully', user: newUser });
    } catch (error) {
      // Catch conditional check failures specifically
      if (error.name === 'ConditionalCheckFailedException') {
        return reply.status(409).send({ error: 'Conflict: User ID already exists' });
      }

      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  })

  fastify.delete('/users/:id', async function (_request, _reply) {
    return 'delete user'
  })


}

export default users
