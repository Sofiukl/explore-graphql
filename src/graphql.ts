import { ApolloServer } from "apollo-server-lambda";
import fs from "fs";
import resolvers from "./resolvers";
import express from "express";
import { getCurrentUser } from "./utils/auth";
import { authDirective } from "./directives/auth.directive";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "./resolvers/permission";

// get the GraphQL schema
const schema = fs.readFileSync("./src/schema.graphql", "utf8");

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

const server = new ApolloServer({
  // typeDefs: schema,
  // resolvers,
  // schema: schemaWithDirective, // schema for auth using directive
  schema: schemaWithShield, // auth using graphQL Shield library (i.e GraphQL middleware)
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
    app.use(middleware);
    return app;
  },
});

function exampleMiddleware(req: any, res: any, next: any) {
  next();
}
