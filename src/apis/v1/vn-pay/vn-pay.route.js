import { Router } from "express";
import vnPayController from "./vn-pay.controller.js";

const router = Router();

router.post("/create-payment-url", vnPayController.createPaymentUrl);

export default router;
