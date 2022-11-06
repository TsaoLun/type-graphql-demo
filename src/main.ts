import { ApolloServer } from "apollo-server";
import * as path from "path";
import { buildSchema } from "type-graphql";

import { RecipeResolver } from "./graphql/schema_resolver";

export async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
    // automatically create `schema.gql` file with schema definition in current folder
    emitSchemaFile: path.resolve(__dirname, "graphql/schema.gql"),
  });

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
  });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
  return url
}
