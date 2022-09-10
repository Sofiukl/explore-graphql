/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./build/graphql.js":
/*!**************************!*\
  !*** ./build/graphql.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs = __webpack_require__(/*! fs */ "fs");
const { ApolloServer, gql } = __webpack_require__(/*! apollo-server-lambda */ "apollo-server-lambda");
const resolvers_1 = __importDefault(__webpack_require__(/*! ./resolvers */ "./build/resolvers/index.js"));
// get the GraphQL schema
const schema = fs.readFileSync("./src/schema.graphql", "utf8");
const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers_1.default,
    csrfPrevention: true,
    cache: "bounded",
    context: ({ express }) => {
        console.log(`express IN CONTEXT :::: ${express.req}`);
        return { req: express.req };
    },
});
// launch the server when the Lambda is called
exports.handler = server.createHandler();


/***/ }),

/***/ "./build/resolvers/index.js":
/*!**********************************!*\
  !*** ./build/resolvers/index.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const item_1 = __webpack_require__(/*! ./item */ "./build/resolvers/item.js");
exports["default"] = {
    Query: {
        item: item_1.item,
        getAllItems: item_1.getAllItems,
    },
    Mutation: {
        createItem: item_1.createItem,
        updateItem: item_1.updateItem,
        deleteItem: item_1.deleteItem,
    },
};


/***/ }),

/***/ "./build/resolvers/item.js":
/*!*********************************!*\
  !*** ./build/resolvers/item.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteItem = exports.updateItem = exports.createItem = exports.getAllItems = exports.item = void 0;
const AWS = __webpack_require__(/*! aws-sdk */ "aws-sdk");
const { v4 } = __webpack_require__(/*! uuid */ "uuid");
const auth_1 = __webpack_require__(/*! ../utils/auth */ "./build/utils/auth.js");
async function item(_, input, context) {
    const user = (0, auth_1.checkAuth)(context);
    console.log(`user ::::  ${JSON.stringify(user)}`);
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.ITEM_TABLE,
        Key: {
            itemId: input.id,
        },
    };
    const { Item } = await dynamoDb.get(params).promise();
    return {
        ...Item,
        id: Item.itemId,
    };
}
exports.item = item;
async function getAllItems(_) {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.ITEM_TABLE,
        FilterExpression: "itemStatus = :v_status",
        ExpressionAttributeValues: {
            ":v_status": "ACTIVE",
        },
    };
    const data = await dynamoDb.scan(params).promise();
    console.log(JSON.stringify(data));
    return data.Items.map((Item) => {
        return {
            ...Item,
            id: Item.itemId,
        };
    });
}
exports.getAllItems = getAllItems;
async function createItem(_, input) {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const id = v4();
    const params = {
        TableName: process.env.ITEM_TABLE,
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
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.ITEM_TABLE,
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
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.ITEM_TABLE,
        Item: {
            itemId: input.id,
            status: "INACTIVE",
        },
    };
    await dynamoDb.put(params).promise();
    return true;
}
exports.deleteItem = deleteItem;


/***/ }),

/***/ "./build/utils/auth.js":
/*!*****************************!*\
  !*** ./build/utils/auth.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkAuth = void 0;
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
const jsonwebtoken_1 = __importDefault(__webpack_require__(/*! jsonwebtoken */ "jsonwebtoken"));
function checkAuth(context) {
    // context = { ... headers }
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        // Bearer ....
        const token = authHeader.split("Bearer ")[1];
        if (token) {
            try {
                const user = jsonwebtoken_1.default.verify(token, "my_secret_key");
                return user;
            }
            catch (err) {
                throw new apollo_server_1.AuthenticationError("Invalid/Expired token");
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]");
    }
    throw new Error("Authorization header must be provided");
}
exports.checkAuth = checkAuth;


/***/ }),

/***/ "apollo-server":
/*!********************************!*\
  !*** external "apollo-server" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("apollo-server");

/***/ }),

/***/ "apollo-server-lambda":
/*!***************************************!*\
  !*** external "apollo-server-lambda" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("apollo-server-lambda");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("aws-sdk");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./build/graphql.js");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQvZ3JhcGhxbC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMzQkE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBRXZCQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2V4cGxvcmUtZ3JhcGhxbC8uL2J1aWxkL2dyYXBocWwuanMiLCJ3ZWJwYWNrOi8vZXhwbG9yZS1ncmFwaHFsLy4vYnVpbGQvcmVzb2x2ZXJzL2luZGV4LmpzIiwid2VicGFjazovL2V4cGxvcmUtZ3JhcGhxbC8uL2J1aWxkL3Jlc29sdmVycy9pdGVtLmpzIiwid2VicGFjazovL2V4cGxvcmUtZ3JhcGhxbC8uL2J1aWxkL3V0aWxzL2F1dGguanMiLCJ3ZWJwYWNrOi8vZXhwbG9yZS1ncmFwaHFsL2V4dGVybmFsIGNvbW1vbmpzIFwiYXBvbGxvLXNlcnZlclwiIiwid2VicGFjazovL2V4cGxvcmUtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcImFwb2xsby1zZXJ2ZXItbGFtYmRhXCIiLCJ3ZWJwYWNrOi8vZXhwbG9yZS1ncmFwaHFsL2V4dGVybmFsIGNvbW1vbmpzIFwiYXdzLXNka1wiIiwid2VicGFjazovL2V4cGxvcmUtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcImpzb253ZWJ0b2tlblwiIiwid2VicGFjazovL2V4cGxvcmUtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcInV1aWRcIiIsIndlYnBhY2s6Ly9leHBsb3JlLWdyYXBocWwvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImZzXCIiLCJ3ZWJwYWNrOi8vZXhwbG9yZS1ncmFwaHFsL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4cGxvcmUtZ3JhcGhxbC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2V4cGxvcmUtZ3JhcGhxbC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZXhwbG9yZS1ncmFwaHFsL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuY29uc3QgeyBBcG9sbG9TZXJ2ZXIsIGdxbCB9ID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItbGFtYmRhXCIpO1xuY29uc3QgcmVzb2x2ZXJzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcmVzb2x2ZXJzXCIpKTtcbi8vIGdldCB0aGUgR3JhcGhRTCBzY2hlbWFcbmNvbnN0IHNjaGVtYSA9IGZzLnJlYWRGaWxlU3luYyhcIi4vc3JjL3NjaGVtYS5ncmFwaHFsXCIsIFwidXRmOFwiKTtcbmNvbnN0IHNlcnZlciA9IG5ldyBBcG9sbG9TZXJ2ZXIoe1xuICAgIHR5cGVEZWZzOiBzY2hlbWEsXG4gICAgcmVzb2x2ZXJzOiByZXNvbHZlcnNfMS5kZWZhdWx0LFxuICAgIGNzcmZQcmV2ZW50aW9uOiB0cnVlLFxuICAgIGNhY2hlOiBcImJvdW5kZWRcIixcbiAgICBjb250ZXh0OiAoeyBleHByZXNzIH0pID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYGV4cHJlc3MgSU4gQ09OVEVYVCA6Ojo6ICR7ZXhwcmVzcy5yZXF9YCk7XG4gICAgICAgIHJldHVybiB7IHJlcTogZXhwcmVzcy5yZXEgfTtcbiAgICB9LFxufSk7XG4vLyBsYXVuY2ggdGhlIHNlcnZlciB3aGVuIHRoZSBMYW1iZGEgaXMgY2FsbGVkXG5leHBvcnRzLmhhbmRsZXIgPSBzZXJ2ZXIuY3JlYXRlSGFuZGxlcigpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBpdGVtXzEgPSByZXF1aXJlKFwiLi9pdGVtXCIpO1xuZXhwb3J0cy5kZWZhdWx0ID0ge1xuICAgIFF1ZXJ5OiB7XG4gICAgICAgIGl0ZW06IGl0ZW1fMS5pdGVtLFxuICAgICAgICBnZXRBbGxJdGVtczogaXRlbV8xLmdldEFsbEl0ZW1zLFxuICAgIH0sXG4gICAgTXV0YXRpb246IHtcbiAgICAgICAgY3JlYXRlSXRlbTogaXRlbV8xLmNyZWF0ZUl0ZW0sXG4gICAgICAgIHVwZGF0ZUl0ZW06IGl0ZW1fMS51cGRhdGVJdGVtLFxuICAgICAgICBkZWxldGVJdGVtOiBpdGVtXzEuZGVsZXRlSXRlbSxcbiAgICB9LFxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWxldGVJdGVtID0gZXhwb3J0cy51cGRhdGVJdGVtID0gZXhwb3J0cy5jcmVhdGVJdGVtID0gZXhwb3J0cy5nZXRBbGxJdGVtcyA9IGV4cG9ydHMuaXRlbSA9IHZvaWQgMDtcbmNvbnN0IEFXUyA9IHJlcXVpcmUoXCJhd3Mtc2RrXCIpO1xuY29uc3QgeyB2NCB9ID0gcmVxdWlyZShcInV1aWRcIik7XG5jb25zdCBhdXRoXzEgPSByZXF1aXJlKFwiLi4vdXRpbHMvYXV0aFwiKTtcbmFzeW5jIGZ1bmN0aW9uIGl0ZW0oXywgaW5wdXQsIGNvbnRleHQpIHtcbiAgICBjb25zdCB1c2VyID0gKDAsIGF1dGhfMS5jaGVja0F1dGgpKGNvbnRleHQpO1xuICAgIGNvbnNvbGUubG9nKGB1c2VyIDo6OjogICR7SlNPTi5zdHJpbmdpZnkodXNlcil9YCk7XG4gICAgY29uc3QgZHluYW1vRGIgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LklURU1fVEFCTEUsXG4gICAgICAgIEtleToge1xuICAgICAgICAgICAgaXRlbUlkOiBpbnB1dC5pZCxcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIGNvbnN0IHsgSXRlbSB9ID0gYXdhaXQgZHluYW1vRGIuZ2V0KHBhcmFtcykucHJvbWlzZSgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIC4uLkl0ZW0sXG4gICAgICAgIGlkOiBJdGVtLml0ZW1JZCxcbiAgICB9O1xufVxuZXhwb3J0cy5pdGVtID0gaXRlbTtcbmFzeW5jIGZ1bmN0aW9uIGdldEFsbEl0ZW1zKF8pIHtcbiAgICBjb25zdCBkeW5hbW9EYiA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuSVRFTV9UQUJMRSxcbiAgICAgICAgRmlsdGVyRXhwcmVzc2lvbjogXCJpdGVtU3RhdHVzID0gOnZfc3RhdHVzXCIsXG4gICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcbiAgICAgICAgICAgIFwiOnZfc3RhdHVzXCI6IFwiQUNUSVZFXCIsXG4gICAgICAgIH0sXG4gICAgfTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgZHluYW1vRGIuc2NhbihwYXJhbXMpLnByb21pc2UoKTtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgcmV0dXJuIGRhdGEuSXRlbXMubWFwKChJdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5JdGVtLFxuICAgICAgICAgICAgaWQ6IEl0ZW0uaXRlbUlkLFxuICAgICAgICB9O1xuICAgIH0pO1xufVxuZXhwb3J0cy5nZXRBbGxJdGVtcyA9IGdldEFsbEl0ZW1zO1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlSXRlbShfLCBpbnB1dCkge1xuICAgIGNvbnN0IGR5bmFtb0RiID0gbmV3IEFXUy5EeW5hbW9EQi5Eb2N1bWVudENsaWVudCgpO1xuICAgIGNvbnN0IGlkID0gdjQoKTtcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuSVRFTV9UQUJMRSxcbiAgICAgICAgSXRlbToge1xuICAgICAgICAgICAgaXRlbUlkOiBpZCxcbiAgICAgICAgICAgIGNvbnRlbnQ6IGlucHV0LmNvbnRlbnQsXG4gICAgICAgICAgICBpdGVtU3RhdHVzOiBcIkFDVElWRVwiLFxuICAgICAgICB9LFxuICAgIH07XG4gICAgYXdhaXQgZHluYW1vRGIucHV0KHBhcmFtcykucHJvbWlzZSgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbnRlbnQ6IGlucHV0LmNvbnRlbnQsXG4gICAgICAgIGlkLFxuICAgIH07XG59XG5leHBvcnRzLmNyZWF0ZUl0ZW0gPSBjcmVhdGVJdGVtO1xuYXN5bmMgZnVuY3Rpb24gdXBkYXRlSXRlbShfLCBpbnB1dCkge1xuICAgIGNvbnN0IGR5bmFtb0RiID0gbmV3IEFXUy5EeW5hbW9EQi5Eb2N1bWVudENsaWVudCgpO1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5JVEVNX1RBQkxFLFxuICAgICAgICBJdGVtOiB7XG4gICAgICAgICAgICBpdGVtSWQ6IGlucHV0LmlkLFxuICAgICAgICAgICAgY29udGVudDogaW5wdXQuY29udGVudCxcbiAgICAgICAgICAgIGl0ZW1TdGF0dXM6IFwiQUNUSVZFXCIsXG4gICAgICAgIH0sXG4gICAgfTtcbiAgICBhd2FpdCBkeW5hbW9EYi5wdXQocGFyYW1zKS5wcm9taXNlKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29udGVudDogaW5wdXQuY29udGVudCxcbiAgICAgICAgaWQ6IGlucHV0LmlkLFxuICAgIH07XG59XG5leHBvcnRzLnVwZGF0ZUl0ZW0gPSB1cGRhdGVJdGVtO1xuYXN5bmMgZnVuY3Rpb24gZGVsZXRlSXRlbShfLCBpbnB1dCkge1xuICAgIGNvbnN0IGR5bmFtb0RiID0gbmV3IEFXUy5EeW5hbW9EQi5Eb2N1bWVudENsaWVudCgpO1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5JVEVNX1RBQkxFLFxuICAgICAgICBJdGVtOiB7XG4gICAgICAgICAgICBpdGVtSWQ6IGlucHV0LmlkLFxuICAgICAgICAgICAgc3RhdHVzOiBcIklOQUNUSVZFXCIsXG4gICAgICAgIH0sXG4gICAgfTtcbiAgICBhd2FpdCBkeW5hbW9EYi5wdXQocGFyYW1zKS5wcm9taXNlKCk7XG4gICAgcmV0dXJuIHRydWU7XG59XG5leHBvcnRzLmRlbGV0ZUl0ZW0gPSBkZWxldGVJdGVtO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNoZWNrQXV0aCA9IHZvaWQgMDtcbmNvbnN0IGFwb2xsb19zZXJ2ZXJfMSA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyXCIpO1xuY29uc3QganNvbndlYnRva2VuXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImpzb253ZWJ0b2tlblwiKSk7XG5mdW5jdGlvbiBjaGVja0F1dGgoY29udGV4dCkge1xuICAgIC8vIGNvbnRleHQgPSB7IC4uLiBoZWFkZXJzIH1cbiAgICBjb25zdCBhdXRoSGVhZGVyID0gY29udGV4dC5yZXEuaGVhZGVycy5hdXRob3JpemF0aW9uO1xuICAgIGlmIChhdXRoSGVhZGVyKSB7XG4gICAgICAgIC8vIEJlYXJlciAuLi4uXG4gICAgICAgIGNvbnN0IHRva2VuID0gYXV0aEhlYWRlci5zcGxpdChcIkJlYXJlciBcIilbMV07XG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0ganNvbndlYnRva2VuXzEuZGVmYXVsdC52ZXJpZnkodG9rZW4sIFwibXlfc2VjcmV0X2tleVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgYXBvbGxvX3NlcnZlcl8xLkF1dGhlbnRpY2F0aW9uRXJyb3IoXCJJbnZhbGlkL0V4cGlyZWQgdG9rZW5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXV0aGVudGljYXRpb24gdG9rZW4gbXVzdCBiZSAnQmVhcmVyIFt0b2tlbl1cIik7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihcIkF1dGhvcml6YXRpb24gaGVhZGVyIG11c3QgYmUgcHJvdmlkZWRcIik7XG59XG5leHBvcnRzLmNoZWNrQXV0aCA9IGNoZWNrQXV0aDtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1sYW1iZGFcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXdzLXNka1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXVpZFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9idWlsZC9ncmFwaHFsLmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9