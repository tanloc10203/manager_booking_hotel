import { Router } from "express";
import CooperateController from "./cooperate.controller";

const router = Router();

router
  .route("/")
  .post(CooperateController.create)
  .get(CooperateController.getAll);

router.route("/:id").delete(CooperateController.deleteById);

export default router;
