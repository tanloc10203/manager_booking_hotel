import SqlString from "sqlstring";
import { pool } from "../../../database/index.js";
import { APIError } from "../../../utils/index.js";

class StatusService {
  table = "statuses";
  primaryKey = "status_id";

  create({ type, desc, key, value }) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = SqlString.format(
          "SELECT ?? FROM ?? WHERE `statuses`.key = ? or value = ?",
          [this.primaryKey, this.table, key, value]
        );

        const [find] = await pool.query(sql);

        if (find?.length > 0) {
          return reject(new APIError(400, "Key or value was exist!"));
        }

        sql = SqlString.format("INSERT INTO ?? SET ?", [
          this.table,
          { type, desc, key, value },
        ]);

        const [result] = await pool.query(sql);

        const id = result.insertId;

        resolve(await this.getById(id));
      } catch (error) {
        reject(error);
      }
    });
  }

  getById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format("SELECT * FROM ?? WHERE ??=?", [
          this.table,
          this.primaryKey,
          id,
        ]);
        const [result] = await pool.query(q);
        resolve(result[0]);
      } catch (error) {
        reject(error);
      }
    });
  }

  getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format("SELECT * FROM ??", [this.table]);
        const [result] = await pool.query(q);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  update(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format("UPDATE ?? SET ? WHERE ?? = ?", [
          this.table,
          data,
          this.primaryKey,
          id,
        ]);
        const [result] = await pool.query(q);

        if (result.affectedRows === 0) {
          return reject(
            new APIError(
              404,
              "Cannot update because customer id was not found!"
            )
          );
        }

        resolve(await this.getById(id));
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format("DELETE FROM ?? WHERE ??=?", [
          this.table,
          this.primaryKey,
          id,
        ]);
        const [result] = await pool.query(q);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  delete() {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format("DELETE FROM ??", [this.table]);
        const [result] = await pool.query(q);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new StatusService();
