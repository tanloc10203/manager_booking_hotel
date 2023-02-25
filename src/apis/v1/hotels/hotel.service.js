import SqlString from "sqlstring";
import { pool } from "../../../database/index.js";
import { APIError } from "../../../utils/index.js";
import hotelImageService from "../hotel-images/hotel-image.service.js";
import hotelTagService from "../hotel-tags/hotel-tag.service.js";

class HotelService {
  table = "hotels";
  primaryKey = "hotel_id";

  create(data = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        const { h_image_value, hotel_image, tags, ...others } = data;

        let sql = SqlString.format("SELECT ?? FROM ?? WHERE hotel_name = ?", [
          this.primaryKey,
          this.table,
          others.hotel_name,
        ]);

        const [findHotelName] = await pool.query(sql);

        if (findHotelName?.length > 0) {
          return reject(new APIError(400, "Hotel name was exist!"));
        }

        sql = SqlString.format("INSERT INTO ?? SET ?", [
          this.table,
          {
            ...others,
            hotel_image: hotel_image[0].path,
            file_name_img: hotel_image[0].filename,
          },
        ]);

        const [result] = await pool.query(sql);

        const id = result.insertId;

        /**
         * Sau khi tao thanh cong khách sạn thì tạo danh sách ảnh.
         * Tạo ra mảng danh sách ảnh.
         */

        const listImgs = h_image_value.map((img) => [
          id,
          img.path,
          img.filename,
        ]);

        await hotelImageService.create(listImgs);

        /**
         * Tiếp tục thêm vào bảng hotel_tags
         */
        const listTags = tags.map((tag) => [id, "tag", tag.title]);

        await hotelTagService.create(listTags);

        resolve(await this.getById(id));
      } catch (error) {
        reject(error);
      }
    });
  }

  getById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let q = SqlString.format("SELECT * FROM ?? WHERE ??=?", [
          this.table,
          this.primaryKey,
          id,
        ]);

        const [result] = await pool.query(q);

        q = SqlString.format("SELECT * FROM ?? WHERE ??=?", [
          "hotel_images",
          "hotel_id",
          id,
        ]);

        const [images] = await pool.query(q);

        q = SqlString.format("SELECT * FROM ?? WHERE ??=?", [
          "hotel_tags",
          "hotel_id",
          id,
        ]);

        const [tags] = await pool.query(q);

        resolve({
          ...result[0],
          images: [...images],
          tags: [...tags],
        });
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
            "SELECT * FROM ?? WHERE hotel_name LIKE ? LIMIT ? OFFSET ?",
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

export default new HotelService();
