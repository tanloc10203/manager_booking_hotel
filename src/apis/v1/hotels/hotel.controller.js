import { APIError } from "../../../utils/index.js";
import hotelService from "./hotel.service.js";
import _ from "lodash";

class HotelController {
  async create(req, res, next) {
    try {
      const body = req.body;
      const file = req.file;

      if (
        !body.hotel_name ||
        !body.hotel_desc ||
        !body.hotel_address ||
        _.isEmpty(file)
      ) {
        return next(
          new APIError(
            404,
            "Missing hotel_name, hotel_desc, hotel_address, hotel_image!"
          )
        );
      }

      const response = await hotelService.create({
        ...body,
        hotel_image: file.filename,
      });

      return res.status(201).json({
        message: "Create success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;

      const response = await hotelService.getById(id);

      return res.status(200).json({
        message: "Get success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = req.query;

      const response = await hotelService.getAll(filters);

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

      const response = await hotelService.deleteById(id);

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
      const response = await hotelService.delete();

      return res.status(200).json({
        message: "Delete all success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;

      const response = await hotelService.update(id, data);

      return res.status(200).json({
        message: "Update success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }
}

export default new HotelController();
