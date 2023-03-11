import { APIError, createUUID } from "../../../utils/index.js";
import billService from "./bill.service.js";

class BillController {
  async create(req, res, next) {
    try {
      const body = req.body;
      const bill_id = createUUID();

      if (!body.user_id || !body.total_price || !body.payment || !body.rooms) {
        return next(
          new APIError(404, "Missing user_id, total_price, payment, rooms!")
        );
      }

      const response = await billService.create({
        ...body,
        bill_id,
      });

      return res.status(201).json({
        message: "Booking success.",
        response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const response = await billService.getById(id);

      return res.status(200).json({
        message: "Get success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = req.query;
      const response = await billService.getAll(filters);

      return res.status(200).json({
        message: "Get all success.",
        data: response,
      });
    } catch (error) {
      console.log("error getALL", error);
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;

      const response = await billService.deleteById(id);

      return res.status(200).json({
        message: "Delete success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const response = await billService.delete();

      return res.status(200).json({
        message: "Delete all success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;

      const response = await billService.update(id, data);

      return res.status(200).json({
        message: "Update success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }
}

export default new BillController();
