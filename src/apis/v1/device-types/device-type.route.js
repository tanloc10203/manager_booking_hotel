import { Router } from "express";
import deviceTypeController from "./device-type.controller.js";

const router = Router();

router
  .route("/")
  .post(deviceTypeController.create)
  .delete(deviceTypeController.delete)
  .get(deviceTypeController.getAll);

router
  .route("/:id")
  .delete(deviceTypeController.deleteById)
  .get(deviceTypeController.getById)
  .patch(deviceTypeController.update);

export default router;
