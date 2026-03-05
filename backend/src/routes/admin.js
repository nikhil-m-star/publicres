import { Router } from "express";
import { requireAuth, requireOfficer, requirePresident } from "../middleware/clerkAuth.js";
import {
    updateStatus,
    getAnalytics,
    updateUserRole,
    getUsers,
} from "../controllers/issueController.js";

const router = Router();

// Officer/President: Update issue status
router.put("/issues/:id/status", requireAuth, requireOfficer, updateStatus);

// President only: Manage user roles (promote/demote)
router.put("/users/:id/role", requireAuth, requirePresident, updateUserRole);

// President only: List all users
router.get("/users", requireAuth, requirePresident, getUsers);

// Officer/President: Get analytics
router.get("/analytics", requireAuth, requireOfficer, getAnalytics);

export default router;
