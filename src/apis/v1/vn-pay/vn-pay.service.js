import dateFormat from "dateformat";
import config from "../../../config/index.js";
import { sortObject } from "../../../utils/functions.js";
import queryString from "qs";
import crypto from "crypto";

class VNPayService {
  static handleCreatePaymentUrl = ({ ipAddr, amount, bankCode }) => {
    try {
      const date = new Date();
      const createDate = dateFormat(date, "yyyymmddHHmmss");
      const orderId = dateFormat(date, "HHmmss");

      const location = config.location; // vn
      const currCode = config.vnp.currCode; // VND

      const tmnCode = config.vnp.vnp_TmnCode;
      const secretKey = config.vnp.vnp_HashSecret;
      const returnUrl = config.vnp.vnp_ReturnUrl;

      let vnpUrl = config.vnp.vnp_Url;
      let vnpParams = {};

      vnpParams["vnp_Version"] = "2.1.0";
      vnpParams["vnp_Command"] = "pay";
      vnpParams["vnp_TmnCode"] = tmnCode;
      vnpParams["vnp_Locale"] = location;
      vnpParams["vnp_CurrCode"] = currCode;
      vnpParams["vnp_TxnRef"] = orderId;
      vnpParams["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
      vnpParams["vnp_OrderType"] = "other";
      vnpParams["vnp_Amount"] = amount * 100;
      vnpParams["vnp_ReturnUrl"] = returnUrl;
      vnpParams["vnp_IpAddr"] = ipAddr;
      vnpParams["vnp_CreateDate"] = createDate;

      if (bankCode !== null && bankCode !== "") {
        vnpParams["vnp_BankCode"] = bankCode;
      }

      vnpParams = sortObject(vnpParams);

      const signData = queryString.stringify(vnpParams, { encode: false });

      const hmac = crypto.createHmac("sha512", secretKey);

      const signed = hmac
        .update(new Buffer.from(signData, "utf-8"))
        .digest("hex");

      vnpParams["vnp_SecureHash"] = signed;

      vnpUrl += "?" + queryString.stringify(vnpParams, { encode: false });

      return { vnpUrl, orderId };
    } catch (error) {
      Promise.reject(error);
    }
  };
}

export default VNPayService;
