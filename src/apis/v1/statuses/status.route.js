import { Router } from "express";
import StatusController from "./status.controller";

const router = Router();

router
  .route("/")
  .post(StatusController.create)
  .get((req, res) => {
    res.send("ok");
  });

export default router;
