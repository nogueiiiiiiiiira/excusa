import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  createAppointment,
  deleteAppointment,
  listAppointments,
  updateAppointment,
} from "../controllers/appointmentsController.js";

const router = Router();
router.get("/", asyncHandler(listAppointments));
router.post("/", asyncHandler(createAppointment));
router.put("/:id", asyncHandler(updateAppointment));
router.delete("/:id", asyncHandler(deleteAppointment));

export default router;
