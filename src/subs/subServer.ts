import "reflect-metadata";
import { ApolloServer, PubSub } from "apollo-server";
import RestaurantRs from "./restaurantRs";
import Restaurant from "./restaurant";
import { buildFederatedSchema } from "../utils/buildFedSchema";
import WebSocket from "ws";

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
  const ws = new WebSocket("ws://localhost:3000/subscriptions")
  ws.onopen = ()=>{
    console.log("connected gateway")
    ws.emit("connect")
  }
  
  console.log(`Products service ready at ${url}`);
})()