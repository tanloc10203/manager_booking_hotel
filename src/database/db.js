import DBMysql from "./init.mysql";

class DB {
  static findOne(query) {
    return DBMysql.conn.query(query);
  }
}

export default DB;
