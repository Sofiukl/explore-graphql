"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const item_1 = require("./item");
const user_1 = require("./user");
exports.default = {
    Query: {
        item: (_, input, context) => {
            // auth inside resolver
            //auth.isAuthenticated(context);
            //auth.isAuthorized(context, "ADMIN");
            return (0, item_1.item)(_, input, context);
        },
        getAllItems: item_1.getAllItems,
    },
    Mutation: {
        createItem: item_1.createItem,
        updateItem: item_1.updateItem,
        deleteItem: item_1.deleteItem,
        login: user_1.login,
    },
};
