import { Router } from "express";
import billController from "./bill.controller.js";

const router = Router();

router
  .route("/")
  .post(billController.create)
  .delete(billController.delete)
  .get(billController.getAll);

router
  .route("/:id")
  .delete(billController.deleteById)
  .get(billController.getById)
  .patch(billController.update);

export default router;
