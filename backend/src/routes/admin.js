import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/clerkAuth.js";
import { updateStatus, getAnalytics } from "../controllers/issueController.js";

const router = Router();

// All admin routes require auth + admin role
router.use(requireAuth, requireAdmin);

// Update issue status
router.put("/issues/:id/status", updateStatus);

// Get analytics dashboard data
router.get("/analytics", getAnalytics);

export default router;
