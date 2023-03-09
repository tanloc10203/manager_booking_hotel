import config from "../../../config/index.js";
import { APIError } from "../../../utils/index.js";
import VNPayService from "./vn-pay.service.js";

class VNPayController {
  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  createPaymentUrl = async (req, res, next) => {
    try {
      const ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      const { amount, bankCode } = req.body;

      console.log(req.body);

      if (!amount) {
        return next(new APIError(404, "Missing amount!"));
      }

      const response = VNPayService.handleCreatePaymentUrl({
        ipAddr,
        amount,
        bankCode,
        user_id: req.body.user_id,
      });

      // console.log(vnpUrl);

      return res.send(response.vnpUrl);
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  };

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  vnpayReturn = async (req, res, next) => {
    try {
      const URL_REDIRECT_RETURN = `${config.app.clientURL}/vnpay_retrun`;
      const vnpParams = req.query;
      console.log("vnpParams", vnpParams);
      const response = VNPayService.handleVnpayReturn({ vnpParams });

      res.cookie("vnp_return", response.code);
      return res.redirect(URL_REDIRECT_RETURN);
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  };
}

export default new VNPayController();
