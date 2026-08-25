import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  createProcedure,
  deleteProcedure,
  listProcedures,
  updateProcedure,
} from "../controllers/proceduresController.js";

const router = Router();
router.get("/", asyncHandler(listProcedures));
router.post("/", asyncHandler(createProcedure));
router.put("/:id", asyncHandler(updateProcedure));
router.delete("/:id", asyncHandler(deleteProcedure));

export default router;
