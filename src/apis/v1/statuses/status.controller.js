import { APIError } from "../../../utils";
import StatusService from "./status.service";

class StatusController {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (!body.type || !body.desc || !body.key || !body.value) {
        return next(new APIError(404, "Missing type, desc, key, value!"));
      }

      const response = await StatusService.create({ ...body });

      return res.status(201).json({
        message: "Create success!",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }
}

export default new StatusController();
