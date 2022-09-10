import { DynamoDB } from "aws-sdk";
import { v4 } from "uuid";
import { Item } from "../generated/schema";

export async function item(
  _: unknown,
  input: { id: string },
  context: any
): Promise<Item | null> {
  console.log(`currentUser ::::  ${JSON.stringify(context.currentUser)}`);
  const dynamoDb = new DynamoDB.DocumentClient();

  console.log(
    `process.env.ITEM_TABLE ::: ${JSON.stringify(process.env.ITEM_TABLE)}`
  );
  if (!process.env.ITEM_TABLE) return null;

  const params = {
    TableName: process.env.ITEM_TABLE,
    Key: {
      itemId: input.id,
    },
  };

  const data = await dynamoDb.get(params).promise();
  if (!data.Item) {
    console.log("item not found");
    return null;
  }

  return {
    ...data.Item,
    id: data.Item.itemId,
  };
}

export async function getAllItems(_: unknown): Promise<Item[]> {
  const dynamoDb = new DynamoDB.DocumentClient();

  const params = {
    TableName:
      process.env.ITEM_TABLE || "serverless-graphql-api-example-dev-ItemsTable",
    FilterExpression: "itemStatus = :v_status",
    ExpressionAttributeValues: {
      ":v_status": "ACTIVE",
    },
  };

  const data = await dynamoDb.scan(params).promise();
  console.log(JSON.stringify(data));
  if (!data.Items) return [];

  return data.Items?.map((Item: any) => {
    return {
      ...Item,
      id: Item.itemId,
    };
  });
}

export async function createItem(
  _: unknown,
  input: { content: string }
): Promise<Item> {
  const dynamoDb = new DynamoDB.DocumentClient();
  const id = v4();

  const params = {
    TableName:
      process.env.ITEM_TABLE || "serverless-graphql-api-example-dev-ItemsTable",
    Item: {
      itemId: id,
      content: input.content,
      itemStatus: "ACTIVE",
    },
  };

  await dynamoDb.put(params).promise();

  return {
    content: input.content,
    id,
  };
}

export async function updateItem(
  _: unknown,
  input: { id: string; content: string }
): Promise<Item> {
  const dynamoDb = new DynamoDB.DocumentClient();

  const params = {
    TableName:
      process.env.ITEM_TABLE || "serverless-graphql-api-example-dev-ItemsTable",
    Item: {
      itemId: input.id,
      content: input.content,
      itemStatus: "ACTIVE",
    },
  };

  await dynamoDb.put(params).promise();

  return {
    content: input.content,
    id: input.id,
  };
}

export async function deleteItem(
  _: unknown,
  input: { id: string }
): Promise<Boolean> {
  const dynamoDb = new DynamoDB.DocumentClient();

  const params = {
    TableName:
      process.env.ITEM_TABLE || "serverless-graphql-api-example-dev-ItemsTable",
    Item: {
      itemId: input.id,
      status: "INACTIVE",
    },
  };

  await dynamoDb.put(params).promise();

  return true;
}
