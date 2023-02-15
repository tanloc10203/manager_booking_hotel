import { Router } from "express";
import { upload } from "../../../utils";
import HotelController from "./hotel.controller";

const router = Router();

router
  .route("/")
  .post(upload.single("hotel_image"), HotelController.create)
  .delete(HotelController.delete)
  .get(HotelController.getAll);

router
  .route("/:id")
  .delete(HotelController.deleteById)
  .get(HotelController.getById)
  .patch(HotelController.update);

export default router;
