import "reflect-metadata";
import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";
import { parse } from "yaml";
import fs from "fs";
import { bootstrap as MainServe } from "./main";

const SERVICES_FILE_PATH = "../services.yaml";
const MAIN_SERVICE_NAME = "main";
let serviceList: { name: string; url: string }[] = [];
let mainService: { name: string; url: string };
let app: ApolloServer;

// serviceList init
(async () => {
  //mainService = { name: MAIN_SERVICE_NAME, url: await MainServe() };
  //serviceList.push(mainService);
  await bootstrap();
})();
// watch serviceList
fs.watch(SERVICES_FILE_PATH, () => {
  console.log(`Services Updating...`)
  bootstrap()
});

async function bootstrap() {
  const servicesMap = parse(SERVICES_FILE_PATH);
  serviceList = serviceList.filter((e) => e.name === MAIN_SERVICE_NAME);
  console.log(serviceList)
  for (const serviceName in servicesMap) {
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
  });
  app.listen({ port: 3000 }).then(({ url }) => {
    console.log(`Apollo Gateway ready at ${url}`);
  });
}
