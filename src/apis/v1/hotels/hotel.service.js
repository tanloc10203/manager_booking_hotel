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
         * tạo ra 1 mảng listImgs[] = [ {'hotel_id', 'h_image_value', 'file_name'} ]
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
}

export default new HotelService();
