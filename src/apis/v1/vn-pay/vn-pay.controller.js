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

      if (!amount || !bankCode) {
        return next(new APIError(404, "Missing amount or bankCode!"));
      }

      const response = VNPayService.handleCreatePaymentUrl({
        ipAddr,
        amount,
        bankCode,
      });

      return res.json({
        response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  };
}

export default new VNPayController();
