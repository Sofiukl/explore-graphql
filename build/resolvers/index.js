"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const item_1 = require("./item");
const user_1 = require("./user");
const utils_1 = __importDefault(require("../utils"));
exports.default = {
    Query: {
        item: (_, input, context) => {
            utils_1.default.isAuthenticated(context);
            utils_1.default.isAuthorized(context, "ADMIN");
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
