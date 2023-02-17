import SqlString from "sqlstring";
import { pool } from "../../../database";
import { APIError, hashPassword } from "../../../utils";

class CustomerService {
  table = "customers";
  primaryKey = "customer_id";

  create(data = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = SqlString.format(
          "SELECT ?? FROM ?? WHERE email = ? or phone = ? or username = ?",
          [this.primaryKey, this.table, data.email, data.phone, data.username]
        );

        const [findCustomer] = await pool.query(sql);

        if (findCustomer?.length > 0) {
          return reject(
            new APIError(400, "Email or phone or username was exist!")
          );
        }

        const password = await hashPassword(data.password);

        sql = SqlString.format("INSERT INTO ?? SET ?", [
          this.table,
          { ...data, password },
        ]);

        const [result] = await pool.query(sql);

        const id = result.insertId;

        resolve(await this.getById(id));
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

  getById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format("SELECT ?? FROM ?? WHERE ??=?", [
          [
            "customer_id",
            "first_name",
            "last_name",
            "email",
            "username",
            "phone",
            "identity_card",
            "year_of_brith",
          ],
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
        const q = SqlString.format("SELECT ?? FROM ??", [
          [
            "customer_id",
            "first_name",
            "last_name",
            "email",
            "username",
            "phone",
            "identity_card",
            "year_of_brith",
          ],
          this.table,
        ]);

        const [result] = await pool.query(q);
        resolve(result);
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

export default new CustomerService();
