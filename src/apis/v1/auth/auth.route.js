import { Router } from "express";
import customerController from "../customers/customer.controller";
import authController from "./auth.controller";
import authMiddleware from "./auth.middleware";

const router = Router();

router.route("/sign-up").post(customerController.create);
router
  .route("/sign-in")
  .post(authController.signIn)
  .get(authMiddleware.verifyAccessToken, authController.getCurrentCustomer);

export default router;
