import mariadb from "../db/mariadb";
import { delay } from "../utils/async";
import crypto from "crypto";

export default {
  async addRestaurant(name: string, star: number) {
    const conn = await mariadb.getConnection();
    let id: string,
      sql: string;
    try {
      await conn.beginTransaction();
      sql = "SELECT 1 FROM `restaurants` WHERE `id`=? LIMIT 1";
      while (true) {
        id = crypto.randomUUID().replaceAll("-", "").toUpperCase();
        if (!(await conn.query(sql, [id]))[0]) {
          break;
        }
      }
      /*       console.info(`--- CHECK ---`);
      sql = "SELECT 1 FROM `restaurants` WHERE `name`=? LIMIT 1";
      if ((await conn.query(sql, [name]))[0]) {
        throw new Error("DUPLICATED_NAME");
      }
      await delay(3);
      console.info(`--- INSERT ---`);
      sql = "INSERT INTO `restaurants` (`id`,`name`,`star`) VALUES(?,?,?)";
      await conn.query(sql, [id, name, star]); */
      sql =
        "INSERT INTO `restaurants` (`id`,`name`,`star`) VALUES(?,?,?) ON DUPLICATE KEY UPDATE `id`=`id`";
      await conn.query(sql, [id, name, star]);
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      console.error(e);
    } finally {
      conn.release();
    }
  },
};
