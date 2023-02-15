import { Router } from "express";
import { upload } from "../../../utils";
import hotelImageController from "./hotel-image.controller";

const router = Router();

router
  .route("/")
  .post(upload.any("h_image_value"), hotelImageController.create)
  .delete(hotelImageController.delete)
  .get(hotelImageController.getAll);

router
  .route("/:id")
  .delete(hotelImageController.deleteById)
  .get(hotelImageController.getById)
  .patch(hotelImageController.update);

export default router;
