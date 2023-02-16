import SqlString from "sqlstring";
import { pool } from "../../../database";
import { APIError } from "../../../utils";

class RoomService {
  table = "rooms";
  primaryKey1 = "room_id";
  primaryKey2 = "floor_id";
  select = [
    "room_id",
    "room_name",
    "room_desc",
    "room_thumb",
    "hotel_name",
    "floor_name",
    "rt_name",
    "avaiable",
  ];

  create(data = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = SqlString.format(
          "SELECT ?? FROM ?? WHERE floor_id = ? and room_name = ? and hotel_id = ?",
          [
            this.primaryKey1,
            this.table,
            data.floor_id,
            data.room_name,
            data.hotel_id,
          ]
        );

        const [findRoom] = await pool.query(sql);

        if (findRoom?.length > 0) {
          return reject(
            new APIError(400, "Floor and room name was exist in the hotel!")
          );
        }

        sql = SqlString.format("INSERT INTO ?? SET ?", [
          this.table,
          { ...data },
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
          this.primaryKey1,
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
        const q = SqlString.format(
          "SELECT ??, s.value status FROM ?? r JOIN room_types rt on r.rt_id = rt.rt_id JOIN hotels h ON r.hotel_id = h.hotel_id JOIN floors f ON r.floor_id = f.floor_id JOIN statuses s ON r.status_id = s.status_id WHERE ??=?",
          [this.select, this.table, this.primaryKey1, id]
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

        let q = SqlString.format(
          "SELECT ??, s.value status FROM ?? r JOIN room_types rt on r.rt_id = rt.rt_id JOIN hotels h ON r.hotel_id = h.hotel_id JOIN floors f ON r.floor_id = f.floor_id JOIN statuses s ON r.status_id = s.status_id LIMIT ? OFFSET ?",
          [this.select, this.table, limit, offset]
        );

        let qTotalRow = SqlString.format(
          "SELECT count(*) as totalRow FROM ??",
          [this.table]
        );

        if (search && !order) {
          q = SqlString.format(
            "SELECT ??, s.value status FROM ?? r JOIN room_types rt on r.rt_id = rt.rt_id JOIN hotels h ON r.hotel_id = h.hotel_id JOIN floors f ON r.floor_id = f.floor_id JOIN statuses s ON r.status_id = s.status_id WHERE emp_username LIKE ? LIMIT ? OFFSET ?",
            [this.select, this.table, `%${search}%`, limit, offset]
          );
        } else if (order && !search) {
          const orderBy = order.split(",").join(" "); // => [hotel_name, desc]; => ? hotel_name desc : hotel_name

          q = SqlString.format(
            "SELECT ??, s.value status FROM ?? r JOIN room_types rt on r.rt_id = rt.rt_id JOIN hotels h ON r.hotel_id = h.hotel_id JOIN floors f ON r.floor_id = f.floor_id JOIN statuses s ON r.status_id = s.status_id ORDER BY " +
              orderBy +
              " LIMIT ? OFFSET ?",
            [this.select, this.table, limit, offset]
          );
        } else if (search && order) {
          const orderBy = order.split(",").join(" ");

          q = SqlString.format(
            "SELECT ??, s.value status FROM ?? r JOIN room_types rt on r.rt_id = rt.rt_id JOIN hotels h ON r.hotel_id = h.hotel_id JOIN floors f ON r.floor_id = f.floor_id JOIN statuses s ON r.status_id = s.status_id WHERE hotel_name LIKE ? ORDER BY " +
              orderBy +
              " LIMIT ? OFFSET ?",
            [this.select, this.table, `%${search}%`, limit, offset]
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

  deleteById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format("DELETE FROM ?? WHERE ??=?", [
          this.table,
          this.primaryKey1,
          id,
        ]);
        const [result] = await pool.query(q);

        resolve(result);
      } catch (error) {
        if (error?.code && error?.code === "ER_ROW_IS_REFERENCED_2") {
          reject(
            new APIError(
              400,
              "You cannot delete because id was exist children table."
            )
          );
        }

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

export default new RoomService();
