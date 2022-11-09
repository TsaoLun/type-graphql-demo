import "reflect-metadata";
import { ApolloServer, PubSub } from "apollo-server";
import RestaurantRs from "./restaurantRs";
import Restaurant from "./restaurant";
import { buildFederatedSchema } from "../utils/buildFedSchema";
import WebSocket from "ws";

import { delay } from "../utils/async";

(async () => {
  const schema = await buildFederatedSchema(
    {
      resolvers: [RestaurantRs],
      orphanedTypes: [Restaurant],
    },
  );
  const server = new ApolloServer({
    schema,
    tracing: false,
    playground: true,
  });
  const { url } = await server.listen({ port: 3002 });
  console.log(`Products service ready at ${url}`);
  await wsListen();
})();

async function wsListen() {
  let ws = new WebSocket("ws://localhost:3001");
  ws.onopen = () => {
    console.log("connected gateway");
    ws.send("Resaurant:3002");
  };
  ws.onclose = () => {
    wsListen();
  };
  ws.onerror = async () => {
    ws.removeAllListeners();
    await delay(30);
    wsListen();
  };
}
