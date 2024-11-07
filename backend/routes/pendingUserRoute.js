import express from "express";
import {
  createPendingUser,
  acceptPendingUser,
  rejectPendingUser,
  getPendingUsers,
  rejectPendingUser2,
  approvePendingUser,
} from "../controllers/pendingUserController.js";

const router = express.Router();

router.get("/pending-users", getPendingUsers);
router.post("/pending-users", createPendingUser);
router.patch("/pending-users/:id", acceptPendingUser);
router.delete("/pending-users/:id", rejectPendingUser);
router.delete("/pending-users-documents/:id", rejectPendingUser2);
router.patch("/approve-user/:id", approvePendingUser);
export default router;
