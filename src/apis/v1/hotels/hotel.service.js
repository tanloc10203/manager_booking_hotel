import SqlString from "sqlstring";
import { pool } from "../../../database/index.js";
import createUUID from "../../../utils/genaralUuid.js";
import { APIError } from "../../../utils/index.js";
import { cloudinaryV2 } from "../../../utils/upload.util.js";
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

        const id = others.hotel_id;

        /**
         * Sau khi tao thanh cong khách sạn thì tạo danh sách ảnh.
         * Tạo ra mảng danh sách ảnh.
         */

        const listImgs = h_image_value.map((img) => [
          createUUID(),
          id,
          img.path,
          img.filename,
        ]);

        await hotelImageService.create(listImgs);

        /**
         * Tiếp tục thêm vào bảng hotel_tags
         */
        const listTags = tags.map((tag) => [
          createUUID(),
          id,
          "tag",
          tag.title,
        ]);

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
        // return resolve(data);

        let {
          img_delete,
          tag_delete,
          hotel_image,
          h_image_value,
          tag_news,
          ...others
        } = data;

        /**
         * Nếu tồn tại hotel_image
         * Thì xoá ảnh cũ trên cloudinary.
         * Xong rồi cập nhật lại ảnh mới vào database => table hotels
         * chỉnh sửa data update
         * => chỉnh sửa orthers[]
         * file_name_img là data được truyền lên
         */

        if (hotel_image && hotel_image.length > 0) {
          await cloudinaryV2.uploader.destroy(others.file_name_img);

          const hotelData = {
            hotel_image: hotel_image[0].path,
            file_name_img: hotel_image[0].filename,
          };

          others = {
            ...others,
            ...hotelData,
          };
        }

        let q = SqlString.format("UPDATE ?? SET ? WHERE ?? = ?", [
          this.table,
          others,
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

        /**
         * Nếu tồn tại img_delete[] thì
         * Xoá ảnh trong database => table hotel_images
         * Xoá ảnh cloudinary.
         */
        if (img_delete && img_delete.length > 0) {
          const imgs_id = [...img_delete].map((i) => i.id);

          await Promise.all(
            img_delete.map((i) => cloudinaryV2.uploader.destroy(i.file_name))
          );

          q = SqlString.format(
            "DELETE FROM `hotel_images` WHERE h_image_id IN (?)",
            [imgs_id]
          );

          await pool.query(q);
        }

        /**
         * Nếu tồn tại tag_delete[] thì
         * Xoá tag database => hotel_tags
         */
        if (tag_delete && tag_delete.length > 0) {
          const tags_id = [...tag_delete].map((i) => i.tag_id);

          q = SqlString.format("DELETE FROM `hotel_tags` WHERE tag_id IN (?)", [
            tags_id,
          ]);

          await pool.query(q);
        }

        /**
         * Nếu tồn tại h_image_value[] thì
         * Đây là mảng được thêm vào.
         * Trường h_image_value cũng được thêm vào khi tạo hotels
         * Thêm mới ảnh vào database => table hotel_images.
         * tạo ra 1 mảng listImgs[] = [ ['hotel_id', 'h_image_value', 'file_name'] ]
         */
        if (h_image_value && h_image_value.length > 0) {
          const listImgs = h_image_value.map((img) => [
            id,
            img.path,
            img.filename,
          ]);

          await hotelImageService.create(listImgs);
        }

        /**
         * Nếu tồn tại tag_news thì
         * Thêm mới tag vào database => table hotel_tags.
         */
        if (tag_news && tag_news.length > 0) {
          const listTags = tag_news.map((tag) => [id, "tag", tag.title]);

          await hotelTagService.create(listTags);
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
        /**
         * - Trước khi xoá hotel thì phải select by id
         * - Để có thể lấy danh sách ảnh của hotel này
         * và để xoá ảnh trên cloudinary.
         * - Vì để xoá được ảnh trên cloudinary thì
         * bắt buộc phải có filename.
         */
        const response = await this.getById(id);

        await Promise.all(
          response.images.map((i) => cloudinaryV2.uploader.destroy(i.file_name))
        );

        /**
         * Sau đó mình sẽ xoá ảnh tiêu đề của khách sạn
         * trên cloudinary.
         */

        await cloudinaryV2.uploader.destroy(response.file_name_img);

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

  getOptions() {
    return new Promise(async (resolve, reject) => {
      try {
        let q = SqlString.format("SELECT hotel_name, hotel_id FROM ??", [
          this.table,
        ]);

        const [result] = await pool.query(q);

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  countProvince() {
    return new Promise(async (resolve, reject) => {
      try {
        let q = SqlString.format(
          "SELECT provice_name, provice_code, count(provice_name) as total FROM `hotels` GROUP BY provice_name, provice_code"
        );

        const [result] = await pool.query(q);

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  findListHotel({ destination, totalPeople }) {
    return new Promise(async (resolve, reject) => {
      try {
        /**
         * SELECT PRICE MIN
         * SELECT HOTEL AND PRICe
         */
        let q = SqlString.format(
          "SELECT /*+ RESULT_CACHE */ h.hotel_id, h.hotel_name, h.hotel_desc, h.hotel_image, h.hotel_rating, h.slug, SUBSTRING(h.provice_name, LENGTH(h.provice_name) - LENGTH(?) - 2, LENGTH(h.provice_name)) provice_name, r.room_desc, rp.discount, rp.percent_discount, rp.price price FROM `rooms` r JOIN room_prices rp ON r.room_id = rp.room_id  JOIN hotels h ON r.hotel_id = h.hotel_id WHERE rp.price IN (SELECT min(rp.price) FROM rooms r JOIN hotels h ON r.hotel_id = h.hotel_id JOIN room_prices rp ON r.room_id = rp.room_id JOIN statuses s ON r.status_id = s.status_id WHERE h.provice_name LIKE ? AND s.value = 'SHOW' AND r.avaiable = 1 AND r.max_people >= ? GROUP BY r.hotel_id) GROUP BY h.hotel_id",
          [destination, `%${destination}%`, totalPeople]
        );

        const [hotels] = await pool.query(q); // * => hotels = []

        resolve(hotels);
      } catch (error) {
        reject(error);
      }
    });
  }

  getHotelBySlug({ slug }) {
    return new Promise(async (resolve, reject) => {
      try {
        /**
         * Đầu  tiên select hotel sau đó
         * Lấy hotel_id select roooms
         * Response => hotel and roooms
         */
        let q = SqlString.format(
          "SELECT `hotel_id`,`hotel_name`,`hotel_desc`,`hotel_address`,`hotel_image`,`district_name`,`provice_name`,`ward_name`,`hotel_rating` FROM `hotels` WHERE slug=?",
          [slug]
        );

        // * SELECT HOTEL
        const [hotels] = await pool.query(q);

        if (!hotels.length) {
          return reject(new APIError(404, "Cannot found hotel by slug!"));
        }

        q = SqlString.format(
          "SELECT r.room_id,`room_name`,`room_desc`, `max_people`, `room_quantity`, `room_booking`, f.floor_id, rt.rt_name, rt.rt_desc, rp.price, rp.discount, rp.percent_discount, f.floor_name FROM `rooms` r JOIN room_types rt ON r.rt_id = rt.rt_id JOIN room_prices rp ON r.room_id = rp.room_id JOIN floors f ON r.floor_id = f.floor_id JOIN statuses s ON r.status_id = s.status_id WHERE r.hotel_id=? AND r.room_quantity != r.room_booking AND r.avaiable = 1 AND s.value='SHOW' ORDER BY rp.price;",
          [hotels[0].hotel_id]
        );

        // * SELECT ROOMS
        const [rooms] = await pool.query(q);

        if (rooms.length) {
          const roomIds = rooms.map((room) => [room.room_id]);

          q = SqlString.format(
            "SELECT `r_image_value` FROM `room_images` WHERE `room_id` IN (?)",
            [roomIds]
          );

          // * SELECT IMAGE ROOM
          const [images] = await pool.query(q);

          return resolve({
            hotel: hotels[0],
            rooms,
            images: images,
          });
        }

        resolve({
          hotel: hotels[0],
          rooms: [],
          images: [],
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new HotelService();
