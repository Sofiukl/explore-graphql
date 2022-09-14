const { GraphQLUpload } = require("graphql-upload");
import { item, getAllItems, createItem, deleteItem, updateItem } from "./item";
import { login } from "./user";
import auth from "../utils";
import { singleUpload } from "./file.upload";

export default {
  Query: {
    item: (_: unknown, input: { id: string }, context: any) => {
      // auth inside resolver
      //auth.isAuthenticated(context);
      //auth.isAuthorized(context, "ADMIN");
      return item(_, input, context);
    },
    getAllItems,
  },
  // This maps the `Upload` scalar to the implementation provided
  // by the `graphql-upload` package.
  Upload: GraphQLUpload,
  Mutation: {
    createItem,
    updateItem,
    deleteItem,
    login,
    singleUpload,
  },
};
