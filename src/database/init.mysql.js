import mysql from "mysql2";
import config from "../config";

class DBMysql {
  static connection() {
    if (this.client) return this.client;

    this.client = mysql.createConnection({
      host: config.db.host,
      user: config.db.username,
      password: config.db.password,
      database: config.db.database,
    });

    return this.client;
  }
}

export default DBMysql;
