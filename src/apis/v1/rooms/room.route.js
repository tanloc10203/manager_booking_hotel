import { Router } from "express";
import { upload } from "../../../utils/index.js";
import roomController from "./room.controller.js";

const router = Router();

router
  .route("/")
  .post(upload.single("room_thumb"), roomController.create)
  .delete(roomController.delete)
  .get(roomController.getAll);

router
  .route("/:id")
  .delete(roomController.deleteById)
  .get(roomController.getById)
  .patch(roomController.update);

export default router;
