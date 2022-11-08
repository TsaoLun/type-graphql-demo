import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { ApolloGateway } from "@apollo/gateway";
import { parse } from "yaml";
import fs from "fs";
import * as path from "path";
import fetch from "node-fetch";

import { bootstrap as MainServe } from "./main";

const SERVICES_FILE_PATH = path.resolve(__dirname, "../services.yaml");
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
// watch serviceList
fs.watch(SERVICES_FILE_PATH, () => {
  console.log(`Services Updating...`);
  bootstrap();
});

async function bootstrap() {
  const servicesMap = parse(fs.readFileSync(SERVICES_FILE_PATH, "utf8")) ?? {};
  serviceList = serviceList.filter((e) => e.name === MAIN_SERVICE_NAME);
  for (const serviceName in servicesMap) {
    try {
      await fetch(servicesMap[serviceName]);
    } catch (_) {
      console.warn(
        `Service ${serviceName} error at ${servicesMap[serviceName]}`,
      );
      continue;
    }
    console.log(`Service ${serviceName} ready at ${servicesMap[serviceName]}`);
    serviceList.push({ name: serviceName, url: servicesMap[serviceName] });
  }
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
    subscriptions: {
      path: "/subscriptions",
      // onConnect:(connectionParams, ws)=>{
      //   console.log("Client connected!")
      //   console.log(connectionParams)
      // },
      // onDisconnect:()=>{
      //   console.log("Client disconnected!")
      // },
    }
  });
  //app.installSubscriptionHandlers(http.createServer())
  console.log(`🚀 Subscriptions ready at ws://localhost:${3000}${app.subscriptionsPath}`);
  app.listen({ port: 3000 }).then(({ url, server }) => {
    console.log(`🚀 Apollo Gateway ready at ${url}`);
  });
}
