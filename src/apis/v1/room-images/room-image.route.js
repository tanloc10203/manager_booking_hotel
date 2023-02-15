import { Router } from "express";
import { upload } from "../../../utils";
import roomImageController from "./room-image.controller";

const router = Router();

router
  .route("/")
  .post(upload.any("r_image_value"), roomImageController.create)
  .delete(roomImageController.delete)
  .get(roomImageController.getAll);

router
  .route("/:id")
  .delete(roomImageController.deleteById)
  .get(roomImageController.getById)
  .patch(roomImageController.update);

export default router;
