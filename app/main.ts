import { ApolloServer } from "apollo-server";
import { GraphQLSchema } from "graphql";
import * as path from "path";
import { buildSchema } from "type-graphql";

import { RecipeResolver } from "./graphql/schema_resolver";
import { Recipe } from "./graphql/schema_type";
import { buildFederatedSchema } from "./utils/buildFedSchema";

let isMain = require.main === module;

export async function bootstrap() {
  // build TypeGraphQL executable schema
  let schema: GraphQLSchema;
  if (isMain) {
    schema = await buildSchema({
      resolvers: [RecipeResolver],
      // automatically create `schema.gql` file with schema definition in current folder
      emitSchemaFile: path.resolve(__dirname, "graphql/schema.gql"),
    });
  } else {
    schema = await buildFederatedSchema(
      {
        resolvers: [RecipeResolver],
        orphanedTypes: [Recipe],
      },
      // {
      //   Recipe: {__resolveReference: Object.assign(new Recipe())}
      // }
    );
  }

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    tracing: false,
    playground: true,
  });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
  return url;
}

if (isMain) {
  bootstrap();
}
