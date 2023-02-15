import { APIError } from "../../../utils";
import customerService from "./customer.service";

class CustomerController {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.username ||
        !body.password ||
        !body.phone
      ) {
        return next(
          new APIError(
            404,
            "Missing first_name, last_name, email, username, password, phone!"
          )
        );
      }

      const response = await customerService.create({ ...body });

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

      const response = await customerService.getById(id);

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
      const id = req.params.id;

      const response = await customerService.getAll();

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

      const response = await customerService.deleteById(id);

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
      const response = await customerService.delete();

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

      const response = await customerService.update(id, data);

      return res.status(200).json({
        message: "Update success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }
}

export default new CustomerController();
