import { Router } from "express";
import { upload } from "../../../utils/index.js";
import HotelController from "./hotel.controller.js";

const router = Router();

router
  .route("/")
  .post(
    upload.fields([
      { name: "hotel_image", maxCount: 1 },
      { name: "h_image_value", maxCount: 50 },
    ]),
    HotelController.create
  )
  .delete(HotelController.delete)
  .get(HotelController.getAll);

router.route("/options").get(HotelController.getOptions);
router.route("/counts-province").get(HotelController.countProvince);
router.route("/list-hotel").get(HotelController.findListHotel);
router.route("/slug/:hotelSlug").get(HotelController.getHotelBySlug);

router
  .route("/:id")
  .delete(HotelController.deleteById)
  .get(HotelController.getById)
  .patch(
    upload.fields([
      { name: "hotel_image", maxCount: 1 },
      { name: "h_image_value", maxCount: 50 },
    ]),
    HotelController.update
  );

export default router;
