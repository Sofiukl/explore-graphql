"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_lambda_1 = require("apollo-server-lambda");
const fs_1 = __importDefault(require("fs"));
const resolvers_1 = __importDefault(require("./resolvers"));
const express_1 = __importDefault(require("express"));
const auth_1 = require("./utils/auth");
const auth_directive_1 = require("./directives/auth.directive");
const schema_1 = require("@graphql-tools/schema");
const graphql_middleware_1 = require("graphql-middleware");
const permission_1 = require("./resolvers/permission");
// get the GraphQL schema
const schema = fs_1.default.readFileSync("./src/schema.graphql", "utf8");
// Schema for Auth using directive
const { authDirectiveTransformer } = (0, auth_directive_1.authDirective)("auth");
let schemaWithDirective = (0, schema_1.makeExecutableSchema)({
    typeDefs: [schema],
    resolvers: resolvers_1.default,
});
schemaWithDirective = authDirectiveTransformer(schemaWithDirective);
// Auth using shield and middleware
const schemaWithShield = (0, graphql_middleware_1.applyMiddleware)((0, schema_1.makeExecutableSchema)({
    typeDefs: [schema],
    resolvers: resolvers_1.default,
}), permission_1.permissions);
const server = new apollo_server_lambda_1.ApolloServer({
    // typeDefs: schema,
    // resolvers,
    // schema: schemaWithDirective,
    schema: schemaWithShield,
    csrfPrevention: true,
    cache: "bounded",
    context: ({ event, context, express }) => {
        const user = (0, auth_1.getCurrentUser)({ req: express.req });
        console.log(`Resolved USER in context function .... ${JSON.stringify(user)}`);
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
        const app = (0, express_1.default)();
        app.use(exampleMiddleware);
        app.use(middleware);
        return app;
    },
});
function exampleMiddleware(req, res, next) {
    next();
}
