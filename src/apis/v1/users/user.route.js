import { Router } from "express";
import userController from "./user.controller";

const router = Router();

router
  .route("/")
  .post(userController.create)
  .delete(userController.delete)
  .get(userController.getAll);

router
  .route("/:id")
  .delete(userController.deleteById)
  .get(userController.getById)
  .patch(userController.update);

export default router;
