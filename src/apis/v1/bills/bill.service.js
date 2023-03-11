import SqlString from "sqlstring";
import DBModel from "../../../database/DBModel.js";
import { pool } from "../../../database/index.js";
import {
  APIError,
  billHTML,
  deleteKeyObjectOrNullOrUndefinedOrEmpty,
  getFieldOfObject,
} from "../../../utils/index.js";
import EmailService from "../emails/email.service.js";
import _ from "lodash";

const statuses = {
  UNPAID: {
    key: "UNPAID",
    value: "Khách hàng sẽ thanh toán trong kì nghỉ.",
    response: "Phòng này bạn đã đặt trước đó. Vui lòng kiểm tra lại!",
  },
  PAID: {
    key: "PAID",
    value: "Khách hàng đã thanh toán.",
    response: "Phòng này bạn đã đặt trước đó. Vui lòng kiểm tra lại!",
  },
  OTHER: {
    key: "OTHER",
    value: "Trạng thái không xác định!",
    response: "Lỗi không xác định. Vui lòng quay lại sau!",
  },
  STARTED_USE: {
    key: "STARTED_USE",
    value: "Khách hàng đang sử dụng phòng.",
    response: "Phòng này bạn đang được sử dụng trong kỳ nghỉ của bạn!",
  },
  ENDED_USE: {
    key: "ENDED_USE",
    value: "Khách hàng đã kết thúc kì nghỉ.",
  },
};

export const bookingFor = {
  ME: "ME",
  CUSTOMER: "CUSTOMER",
};

class BillService extends DBModel {
  table = "bills";
  primaryKey = "bill_id";

  create(data = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        /**
         * 1. Kiểm tra xem bill này book cho ai.
         *  - Chính họ. (user)
         *  - Cho người khác. (customer_email, full_name)
         * 2. Kiểm tra email có hợp lệ không
         *  - Nếu không thì sẽ không tạo bill
         * 3. Kiểm tra bill có tồn tại phòng đã đặt chưa. input [user_id, room_id, floor_id]
         *  - Nếu bill tồn tại phòng đã đặt thì xét đến trạng thái.
         *    + Xét trạng thái bill ['UNPAID', 'PAID', 'OTHER', 'STARTED_USE', 'ENDED_USE']
         *  - Mặt đinh trạng thái sẽ là UNPAID
         *  - IF (status = UNPAID || status = PAID)
         *      => response: Phòng đã đặt đã có trong kì nghỉ của bạn
         *  - IF (status = STARTED_USE)
         *      => repsonse: Phòng này bạn đang sử dụng.
         *  - IF (status = ENDED_USE)
         *      => Cho phép người này tạo bill mới.
         * 4. Tạo bill
         * 5. Tạo bill detail.
         * 6. Cập nhật lại số lượng phòng có sẵn của room_id và floor_id gửi lên.
         * 7. Gửi bill về mail gửi lên.
         * 8. Phản hồi về người dùng.
         *  - Thông báo thành công.
         */

        const {
          email,
          booking_for,
          customer_email,
          customer_fullname,
          user_id,
          bill_id,
          rooms,
        } = data;

        // * 1, 2
        await EmailService.validationEmail(
          email,
          `Email ${email} của bạn không hợp lệ!`
        );

        if (booking_for === bookingFor.CUSTOMER) {
          await EmailService.validationEmail(
            customer_email,
            `Email ${customer_email} của khách hàng không hợp lệ!`
          );
        }

        // * 3
        let sql =
          "SELECT * FROM ?? b JOIN ?? bd ON b.bill_id = bd.bill_id WHERE b.user_id = ? AND bd.room_id = ? AND bd.floor_id = ?";

        const [findBill] = await Promise.all(
          rooms.map((room) =>
            pool.query(sql, [
              this.table,
              "bill_details",
              user_id,
              room.room_id,
              room.floor_id,
            ])
          )
        );

        console.log("check sql", sql);

        const billExist = [...findBill[0]];
        let checkBillExist = false;

        billExist.forEach((bill) => {
          if (
            bill.status === statuses.PAID.key ||
            bill.status === statuses.UNPAID.key ||
            bill.status === statuses.STARTED_USE
          ) {
            checkBillExist = true;
          }
        });

        // * Đã tồn tại và trạng thái != ENDED_USE.
        if (checkBillExist) {
          return reject(
            this._responseStatusBillBookingExist(statuses.UNPAID.key)
          );
        }

        // * 4. Tạo bill - Chưa tồn tại bill - Trạng thái mặc định là UNPAID (chưa thanh toán)
        let dataInsertBill = getFieldOfObject({
          fileds: [
            "user_id",
            "total_price",
            "note",
            "payment",
            "time_destination",
            "voucher",
          ],
          object: data,
        });

        dataInsertBill =
          deleteKeyObjectOrNullOrUndefinedOrEmpty(dataInsertBill);

        await this.insert({
          data: { ...dataInsertBill, bill_id },
        });

        // * 5 - Tạo bill details.
        const insertFields = [
          "bill_id",
          "floor_id",
          "room_id",
          "price",
          "room_quantity",
        ];

        const dataInsertBillDetails = rooms.map((room) => [
          bill_id,
          room.floor_id,
          room.room_id,
          room.booking_price,
          room.booking_room,
        ]);

        await this.insertBulk({
          table: "bill_details",
          data: dataInsertBillDetails,
          insertFields,
        });

        // * 6 - Cập nhật lại số lượng phòng có sẵn.
        await Promise.all(
          rooms.map((room) => {
            const room_booking = room.room_booking + room.booking_room;

            if (room_booking >= room.room_quantity) {
              return Promise.reject(
                new APIError(400, "Phòng này đã được đặt hết")
              );
            }

            this.handleUpdate({
              table: "rooms",
              data: {
                room_booking,
                avaiable: room_booking === room.room_quantity ? 0 : 1,
              },
              id: room.room_id,
              idField: "room_id",
            });
          })
        );

        // * 7 Gửi mail
        await EmailService.sendEmail({
          email: email,
          html: billHTML({
            data: rooms,
            hotel: {
              total_price: data.total_price,
              hotel_name: data.hotel_name,
              hotel_address: `${data.hotel_address}, ${data.ward_name}, ${data.district_name}, ${data.provice_name}`,
            },
            customer: customer_fullname || "",
            note: data.note,
            payment: data.payment,
            bookingFor: booking_for,
            userBooking: `${data.last_name} ${data.first_name}`,
            billId: bill_id,
            totalNight: data.totalNight,
            time_destination: data.time_destination,
            startDate: data.startDate,
            endDate: data.endDate,
          }),
        });

        if (booking_for === bookingFor.CUSTOMER) {
          // * 7 Gửi mail
          await EmailService.sendEmail({
            email: customer_email,
            html: billHTML({
              data: rooms,
              hotel: {
                total_price: data.total_price,
                hotel_name: data.hotel_name,
                hotel_address: `${data.hotel_address}, ${data.ward_name}, ${data.district_name}, ${data.provice_name}`,
              },
              customer: customer_fullname,
              note,
              payment,
              bookingFor: booking_for,
              userBooking: `${data.last_name} ${data.first_name}`,
              billId: bill_id,
              totalNight: data.totalNight,
              time_destination: data.time_destination,
              startDate: data.startDate,
              endDate: data.endDate,
            }),
          });
        }

        // * 8 phản hồi khách hàng.
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  _responseStatusBillBookingExist = (status) => {
    return new APIError(400, statuses[status].response);
  };

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

export default new BillService("bills");
