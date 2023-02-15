import { Router } from "express";
import employeeController from "./employee.controller";

const router = Router();

router
  .route("/")
  .post(employeeController.create)
  .delete(employeeController.delete)
  .get(employeeController.getAll);

router
  .route("/:id")
  .delete(employeeController.deleteById)
  .get(employeeController.getById)
  .patch(employeeController.update);

export default router;
