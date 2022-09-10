"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authDirective = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
function authDirective(directiveName) {
    const typeDirectiveArgumentMaps = {};
    return {
        authDirectiveTypeDefs: `directive @${directiveName}(
      requires: Role = ADMIN,
    ) on OBJECT | FIELD_DEFINITION

    enum Role {
      ADMIN
      REVIEWER
      USER
      UNKNOWN
    }`,
        authDirectiveTransformer: (schema) => (0, utils_1.mapSchema)(schema, {
            [utils_1.MapperKind.TYPE]: (type) => {
                const authDirective = (0, utils_1.getDirective)(schema, type, directiveName)?.[0];
                if (authDirective) {
                    typeDirectiveArgumentMaps[type.name] = authDirective;
                }
                return undefined;
            },
            [utils_1.MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
                const authDirective = (0, utils_1.getDirective)(schema, fieldConfig, directiveName)?.[0] ??
                    typeDirectiveArgumentMaps[typeName];
                if (authDirective) {
                    const { requires } = authDirective;
                    if (requires) {
                        const { resolve = graphql_1.defaultFieldResolver } = fieldConfig;
                        fieldConfig.resolve = function (source, args, context, info) {
                            console.log(`context that is set from apollo server config ::: ${JSON.stringify(context.currentUser)}`);
                            const user = context.currentUser || {};
                            if (user.role !== requires) {
                                throw new Error("Unauthenticated Access!");
                            }
                            return resolve(source, args, context, info);
                        };
                        return fieldConfig;
                    }
                }
            },
        }),
    };
}
exports.authDirective = authDirective;
