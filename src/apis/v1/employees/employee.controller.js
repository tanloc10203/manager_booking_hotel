import { APIError } from "../../../utils";
import employeeService from "./employee.service";

class EmployeeController {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (
        !body.emp_first_name ||
        !body.emp_last_name ||
        !body.emp_email ||
        !body.emp_username ||
        !body.emp_password ||
        !body.emp_phone ||
        !body.hotel_id
      ) {
        return next(
          new APIError(
            404,
            "Missing emp_first_name, emp_last_name, emp_email, emp_username, emp_password, emp_phone, hotel_id!"
          )
        );
      }

      const response = await employeeService.create({ ...body });

      return res.status(201).json({
        message: "Create success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;

      const response = await employeeService.getById(id);

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
      const response = await employeeService.getAll(filters);

      return res.status(200).json({
        message: "Get all success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async deleteById(req, res, next) {
    try {
      const id = req.params.id;

      const response = await employeeService.deleteById(id);

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
      const response = await employeeService.delete();

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
      const id = req.params.id;
      const data = req.body;

      const response = await employeeService.update(id, data);

      return res.status(200).json({
        message: "Update success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }
}

export default new EmployeeController();
