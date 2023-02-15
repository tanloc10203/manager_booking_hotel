import { APIError } from "../../../utils";
import cooperateService from "./cooperate.service";
import _ from "lodash";

class CooperateController {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (!body.concern_id || !body.hotel_id) {
        return next(new APIError(404, "Missing concern_id, hotel_id!"));
      }

      const response = await cooperateService.create(body);

      return res.status(201).json({
        message: "Create success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = req.query;

      const response = await cooperateService.getAll(filters);

      return res.status(200).json({
        message: "Get all success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  async deleteById(req, res, next) {
    try {
      const id = req.params.id;

      const response = await cooperateService.deleteById(id);

      return res.status(200).json({
        message: "Delete success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const response = await cooperateService.delete();

      return res.status(200).json({
        message: "Delete all success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }
}

export default new CooperateController();
