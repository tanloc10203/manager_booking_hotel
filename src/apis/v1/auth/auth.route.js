import { Router } from "express";
import { userController } from "../users";
import authController from "./auth.controller";
import authMiddleware from "./auth.middleware";

const router = Router();

router.route("/sign-up").post(userController.create);

router.route("/change-password").post(authController.changePassword);

router.route("/forgot-password").post(authController.forgotPassword);

router
  .route("/refresh-token")
  .get(authMiddleware.verifyRefreshToken, authController.refreshToken);

router
  .route("/sign-in")
  .post(authController.signIn)
  .get(authMiddleware.verifyAccessToken, authController.getCurrentCustomer);

export default router;
