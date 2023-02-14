import mysql from "mysql2";
import config from "../config";

class DBMysql {
  static connection() {
    if (this.conn) return this.conn;

    this.conn = mysql.createConnection({
      host: config.db.host,
      user: config.db.username,
      password: config.db.password,
      database: config.db.database,
    });

    return this.conn;
  }
}

export default DBMysql;
