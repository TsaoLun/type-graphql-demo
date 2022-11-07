import { ApolloServer } from "apollo-server";
import RestaurantRs from "./restaurantRs";
import Restaurant from "./restaurant";
import { buildFederatedSchema } from "../utils/buildFedSchema";

(async()=>{
  const schema = await buildFederatedSchema(
    {
      resolvers: [RestaurantRs],
      orphanedTypes: [Restaurant]
    }
  )
  const server = new ApolloServer({
    schema,
    tracing: false,
    playground: true
  })
  const { url } = await server.listen({ port: 3001 });

  console.log(`Products service ready at ${url}`);
})()