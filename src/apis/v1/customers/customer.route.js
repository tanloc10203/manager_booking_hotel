import { Router } from "express";
import customerController from "./customer.controller";

const router = Router();

router
  .route("/")
  .post(customerController.create)
  .delete(customerController.delete)
  .get(customerController.getAll);

router
  .route("/:id")
  .delete(customerController.deleteById)
  .get(customerController.getById)
  .patch(customerController.update);

export default router;
