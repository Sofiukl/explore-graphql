import { rule, shield, chain } from "graphql-shield";
const isAuthenticated = rule({ cache: "contextual" })(
  (parent: any, args: any, context: any) => !!context.currentUser
);
const isAdmin = rule({ cache: "contextual" })(
  (parent: any, args: any, context: any) => context.currentUser.role === "ADMIN"
);

export const permissions = shield({
  Query: {
    item: isAdmin,
  },
});
