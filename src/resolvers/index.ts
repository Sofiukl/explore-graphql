import { item, getAllItems, createItem, deleteItem, updateItem } from "./item";
import { login } from "./user";
import auth from "../utils";

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
  Mutation: {
    createItem,
    updateItem,
    deleteItem,
    login,
  },
};
