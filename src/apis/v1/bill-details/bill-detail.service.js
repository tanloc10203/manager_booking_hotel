import SqlString from "sqlstring";
import { pool } from "../../../database";
import { APIError } from "../../../utils";

class BillDetailService {
  table = "bill_details";
  primaryKey1 = "bill_id";
  primaryKey2 = "floor_id";
  primaryKey3 = "room_id";
  select = ["*"];

  create(data = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = SqlString.format("INSERT INTO ?? SET ?", [
          this.table,
          { ...data },
        ]);

        const [result] = await pool.query(sql);

        resolve(await this.getById(data.bill_id, data.floor_id, data.room_id));
      } catch (error) {
        reject(error);
      }
    });
  }

  update({ bill_id, floor_id, room_id }, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format(
          "UPDATE ?? SET ? WHERE ??=? and ??=? and ??=?",
          [
            this.table,
            data,
            this.primaryKey1,
            bill_id,
            this.primaryKey2,
            floor_id,
            this.primaryKey3,
            room_id,
          ]
        );
        const [result] = await pool.query(q);

        if (result.affectedRows === 0) {
          return reject(
            new APIError(
              404,
              "Cannot update because customer id was not found!"
            )
          );
        }

        resolve(await this.getById(bill_id, floor_id, room_id));
      } catch (error) {
        reject(error);
      }
    });
  }

  getById(bill_id, floor_id, room_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format(
          "SELECT ?? FROM ?? WHERE ??=? and ??=? and ??=?",
          [
            this.select,
            this.table,
            this.primaryKey1,
            bill_id,
            this.primaryKey2,
            floor_id,
            this.primaryKey3,
            room_id,
          ]
        );

        const [result] = await pool.query(q);

        if (!result.length) {
          return reject(new APIError(404, "Get by id not found"));
        }

        resolve(result[0]);
      } catch (error) {
        reject(error);
      }
    });
  }

  getAll(filters) {
    return new Promise(async (resolve, reject) => {
      try {
        const page = +filters?.page || 1;
        const limit = +filters?.limit || 5;
        const offset = limit * (page - 1);
        const search = filters?.search;
        const order = filters?.order; // hotel_name,desc

        let q = SqlString.format("SELECT * FROM ?? LIMIT ? OFFSET ?", [
          this.table,
          limit,
          offset,
        ]);

        let qTotalRow = SqlString.format(
          "SELECT count(*) as totalRow FROM ??",
          [this.table]
        );

        if (search && !order) {
          q = SqlString.format(
            "SELECT * FROM ?? WHERE emp_username LIKE ? LIMIT ? OFFSET ?",
            [this.table, `%${search}%`, limit, offset]
          );
        } else if (order && !search) {
          const orderBy = order.split(",").join(" "); // => [hotel_name, desc]; => ? hotel_name desc : hotel_name

          q = SqlString.format(
            "SELECT * FROM ?? ORDER BY " + orderBy + " LIMIT ? OFFSET ?",
            [this.table, limit, offset]
          );
        } else if (search && order) {
          const orderBy = order.split(",").join(" ");

          q = SqlString.format(
            "SELECT * FROM ?? WHERE hotel_name LIKE ? ORDER BY " +
              orderBy +
              " LIMIT ? OFFSET ?",
            [this.table, `%${search}%`, limit, offset]
          );
        }

        const [result] = await pool.query(q);
        const [totalRow] = await pool.query(qTotalRow);

        resolve({
          result,
          paginations: {
            page,
            limit,
            totalPage: Math.ceil(totalRow[0].totalRow / limit),
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteById(bill_id, floor_id, room_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format(
          "DELETE FROM ?? WHERE ??=? and ??=? and ??=?",
          [
            this.table,
            this.primaryKey1,
            bill_id,
            this.primaryKey2,
            floor_id,
            this.primaryKey3,
            room_id,
          ]
        );
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

export default new BillDetailService();
