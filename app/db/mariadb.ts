import mariadb from "mariadb";
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

export default mariadb.createPool({
  host: "0.0.0.0",
  port: 3306,
  user: process.env.MARIA_DB_USER,
  password: process.env.MARIA_DB_PASS,
  database: process.env.MARIA_DB_NAME,
});
