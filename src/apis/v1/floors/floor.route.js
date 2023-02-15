import { Router } from "express";
import floorController from "./floor.controller";

const router = Router();

router
  .route("/")
  .post(floorController.create)
  .delete(floorController.delete)
  .get(floorController.getAll);

router
  .route("/:id")
  .delete(floorController.deleteById)
  .get(floorController.getById)
  .patch(floorController.update);

export default router;
