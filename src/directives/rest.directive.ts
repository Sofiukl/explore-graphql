import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { GraphQLSchema } from "graphql/type/schema";
import axios from "axios";

export function restDirective(directiveName: string) {
  return {
    restDirectiveTypeDefs: `directive @${directiveName}(url: String) on FIELD_DEFINITION`,
    restDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const restDirective = getDirective(
            schema,
            fieldConfig,
            directiveName
          )?.[0];
          if (restDirective) {
            const { url } = restDirective;

            fieldConfig.resolve = async (source, args, context, info) => {
              // You have access to context here i.e have access to token
              // You can send this to APIs header too
              console.log(`@rest: calling ${url}`);

              const resp = await axios.get(url, {
                headers: {
                  Accept: "application/json",
                },
              });
              return resp.data;
            };
            return fieldConfig;
          }
        },
      }),
  };
}
