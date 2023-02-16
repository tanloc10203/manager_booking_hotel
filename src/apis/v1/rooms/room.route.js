import { Router } from "express";
import { upload } from "../../../utils";
import roomController from "./room.controller";

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
