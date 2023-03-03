import { Router } from "express";
import { upload } from "../../../utils/index.js";
import roomController from "./room.controller.js";

const router = Router();

router
  .route("/")
  .post(
    upload.fields([
      { name: "room_thumb", maxCount: 1 },
      { name: "r_image_value", maxCount: 50 },
    ]),
    roomController.create
  )
  .delete(roomController.delete)
  .get(roomController.getAll);

router
  .route("/:id")
  .delete(roomController.deleteById)
  .get(roomController.getById)
  .patch(
    upload.fields([
      { name: "room_thumb", maxCount: 1 },
      { name: "r_image_value", maxCount: 50 },
    ]),
    roomController.update
  );

export default router;
