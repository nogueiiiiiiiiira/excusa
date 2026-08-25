import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  listGeneralHistory,
  listSystemHistory,
} from "../controllers/historyController.js";

const router = Router();

router.get("/general", asyncHandler(listGeneralHistory));
router.get("/system", asyncHandler(listSystemHistory));

export default router;
