import { Router } from "express";
import vnPayController from "./vn-pay.controller.js";

const router = Router();

router.post("/create-payment-url", vnPayController.createPaymentUrl);
router.get("/return", vnPayController.vnpayReturn);

export default router;
