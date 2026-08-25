import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  createClient,
  deleteClient,
  listClients,
  updateClient,
} from "../controllers/clientsController.js";

const router = Router();
router.get("/", asyncHandler(listClients));
router.post("/", asyncHandler(createClient));
router.put("/:id", asyncHandler(updateClient));
router.delete("/:id", asyncHandler(deleteClient));

export default router;
