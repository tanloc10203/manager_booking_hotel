import mysql from "mysql2";
import config from "../config";

const pool = mysql
  .createPool({
    host: config.db.host,
    user: config.db.username,
    password: config.db.password,
    database: config.db.database,
    connectionLimit: 10,
  })
  .promise();

export default pool;
