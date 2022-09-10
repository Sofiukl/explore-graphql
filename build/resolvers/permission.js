"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissions = void 0;
const graphql_shield_1 = require("graphql-shield");
const isAuthenticated = (0, graphql_shield_1.rule)({ cache: "contextual" })((parent, args, context) => !!context.currentUser);
const isAdmin = (0, graphql_shield_1.rule)({ cache: "contextual" })((parent, args, context) => context.currentUser.role === "ADMIN");
exports.permissions = (0, graphql_shield_1.shield)({
    Query: {
        item: isAdmin,
    },
});
