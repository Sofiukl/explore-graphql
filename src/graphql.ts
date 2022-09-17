import { ApolloServer } from "apollo-server-lambda";
import fs from "fs";
import resolvers from "./resolvers";
import express from "express";
import { getCurrentUser } from "./utils/auth";
import { authDirective } from "./directives/auth.directive";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "./resolvers/permission";
import { stitchSchemas } from "@graphql-tools/stitch";
import { postsByWriterId } from "./resolvers/posts";
import { writerById } from "./resolvers/writers";
import { delegateToSchema } from "@graphql-tools/delegate";
import { restDirective } from "./directives/rest.directive";
const { graphqlUploadExpress } = require("graphql-upload");
// get the GraphQL schema
const schema = fs.readFileSync("./src/schema.graphql", "utf8");

// Schema for @rest directive
const { restDirectiveTransformer } = restDirective("rest");
let schemaWithRestDirective = makeExecutableSchema({
  typeDefs: [schema],
  resolvers,
});
schemaWithRestDirective = restDirectiveTransformer(schemaWithRestDirective);

// Schema for Auth using directive
const { authDirectiveTransformer } = authDirective("auth");
let schemaWithDirective = makeExecutableSchema({
  typeDefs: [schema],
  resolvers,
});
schemaWithDirective = authDirectiveTransformer(schemaWithDirective);

// Auth using shield and middleware
const schemaWithShield = applyMiddleware(
  makeExecutableSchema({
    typeDefs: [schema],
    resolvers,
  }),
  permissions
);

// Schema Stitching example
let postsSchemaStr = fs.readFileSync("./src/schema.post.graphql", "utf8");
let authorsSchemaStr = fs.readFileSync("./src/schema.writers.graphql", "utf8");
let extendedPostAuthorSchema = fs.readFileSync(
  "./src/schema.post.writers.graphql",
  "utf8"
);

let postsSchema = makeExecutableSchema({
  typeDefs: [postsSchemaStr],
  resolvers: {
    Query: {
      postsByWriterId,
    },
  },
});

let authorsSchema = makeExecutableSchema({
  typeDefs: [authorsSchemaStr],
  resolvers: {
    Query: {
      writerById,
    },
  },
});

// setup sub schema configurations
export const postsSubSchema = { schema: postsSchema };
export const authorsSubSchema = { schema: authorsSchema };

// build the combined schema
// For details documentation link: https://www.graphql-tools.com/docs/schema-stitching/stitch-schema-extensions
export const gatewaySchema = stitchSchemas({
  subschemas: [postsSubSchema, authorsSubSchema],
  typeDefs: extendedPostAuthorSchema,
  resolvers: {
    Writer: {
      posts: {
        selectionSet: `{ id }`,
        resolve(writer, args, context, info) {
          return delegateToSchema({
            schema: postsSubSchema,
            operation: "query",
            fieldName: "postsByWriterId",
            args: { writerId: writer.id },
            context,
            info,
          });
        },
      },
    },
    Post: {
      writer: {
        selectionSet: `{ writerId }`,
        resolve(post, args, context, info) {
          return delegateToSchema({
            schema: authorsSubSchema,
            operation: "query",
            fieldName: "writerById",
            args: { id: post.writerId },
            context,
            info,
          });
        },
      },
    },
  },
});

const server = new ApolloServer({
  // typeDefs: schema,
  // resolvers,
  // schema: schemaWithDirective, // schema for auth using directive
  schema: schemaWithRestDirective, // example of @rest directive
  // schema: schemaWithShield, // auth using graphQL Shield library (i.e GraphQL middleware)
  // schema: gatewaySchema, // schema stitching
  csrfPrevention: true,
  cache: "bounded",
  context: ({ event, context, express }) => {
    const user = getCurrentUser({ req: express.req });
    console.log(
      `Resolved USER in context function .... ${JSON.stringify(user)}`
    );
    return {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
      req: express.req,
      currentUser: user,
    };
  },
});

// launch the server when the Lambda is called
exports.handler = server.createHandler({
  expressAppFromMiddleware(middleware) {
    const app = express();
    app.use(exampleMiddleware);
    app.use(graphqlUploadExpress());
    app.use(middleware);
    return app;
  },
});

function exampleMiddleware(req: any, res: any, next: any) {
  next();
}
