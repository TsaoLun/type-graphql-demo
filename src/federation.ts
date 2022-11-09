import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { ApolloGateway } from "@apollo/gateway";
import fetch from "node-fetch";
import { Server } from "ws";

import { bootstrap as MainServe } from "./main";

const MAIN_SERVICE_NAME = "main";
let serviceList: { name: string; url: string }[] = [];
let mainService: { name: string; url: string };
let app: ApolloServer;

// serviceList init
(async () => {
  mainService = { name: MAIN_SERVICE_NAME, url: await MainServe() };
  serviceList.push(mainService);
  await bootstrap();
})();

async function bootstrap() {
  const gateway = new ApolloGateway({
    serviceList,
  });
  const { schema, executor } = await gateway.load();
  if (app) {
    await app.stop();
  }
  app = new ApolloServer({
    schema,
    executor,
    tracing: false,
    playground: true,
    subscriptions: false,
  });
  app.listen({ port: 3000 }).then(({ url, server }) => {
    console.log(`🚀 Apollo Gateway ready at ${url}`);
  });
}

const socket = new Server({ port: 3001 });
console.log(`🚀 Subscriptions ready at ws://localhost:${3001}}`);
socket.on("connection", (s) => {
  let url: string;
  s.on("message", (data) => {
    const [name, port] = data.toString().split(":");
    if (port) {
      let isValid = false;
      url = `http://localhost:${port}/`;
      fetch(url).then((_) => {
        isValid = true;
      }).finally(() => {
        if (
          isValid &&
          !serviceList.find((e) => e.url === url)
        ) {
          serviceList.push({ name, url });
          bootstrap();
        }
      });
    }
  });
  s.on("close", () => {
    serviceList.splice(serviceList.findIndex((e) => e.url === url), 1);
    bootstrap();
  });
});
