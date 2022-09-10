"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.createItem = exports.getAllItems = exports.item = void 0;
const aws_sdk_1 = require("aws-sdk");
const uuid_1 = require("uuid");
async function item(_, input, context) {
    console.log(`currentUser ::::  ${JSON.stringify(context.currentUser)}`);
    const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
    console.log(`process.env.ITEM_TABLE ::: ${JSON.stringify(process.env.ITEM_TABLE)}`);
    if (!process.env.ITEM_TABLE)
        return null;
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
exports.item = item;
async function getAllItems(_) {
    const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.ITEM_TABLE || "serverless-graphql-api-example-dev-ItemsTable",
        FilterExpression: "itemStatus = :v_status",
        ExpressionAttributeValues: {
            ":v_status": "ACTIVE",
        },
    };
    const data = await dynamoDb.scan(params).promise();
    console.log(JSON.stringify(data));
    if (!data.Items)
        return [];
    return data.Items?.map((Item) => {
        return {
            ...Item,
            id: Item.itemId,
        };
    });
}
exports.getAllItems = getAllItems;
async function createItem(_, input) {
    const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
    const id = (0, uuid_1.v4)();
    const params = {
        TableName: process.env.ITEM_TABLE || "serverless-graphql-api-example-dev-ItemsTable",
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
exports.createItem = createItem;
async function updateItem(_, input) {
    const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.ITEM_TABLE || "serverless-graphql-api-example-dev-ItemsTable",
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
exports.updateItem = updateItem;
async function deleteItem(_, input) {
    const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.ITEM_TABLE || "serverless-graphql-api-example-dev-ItemsTable",
        Item: {
            itemId: input.id,
            status: "INACTIVE",
        },
    };
    await dynamoDb.put(params).promise();
    return true;
}
exports.deleteItem = deleteItem;
