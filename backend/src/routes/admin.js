import { Router } from "express";
import { requireAuth, requireOfficer, requirePresident } from "../middleware/clerkAuth.js";
import {
    updateStatus,
    getAnalytics,
    updateUserRole,
    getUsers,
} from "../controllers/issueController.js";
import {
    verifyByEmail,
    getNotifications,
    markNotificationAsRead,
    getMe
} from "../controllers/userController.js";

const router = Router();

// Citizen -> Admin promotion (auto-verified by bmsce.ac.in email domain)
router.post("/verify-email", requireAuth, verifyByEmail);
router.get("/me", requireAuth, getMe);

// Officer/President: Notifications
router.get("/notifications", requireAuth, requireOfficer, getNotifications);
router.put("/notifications/:id/read", requireAuth, requireOfficer, markNotificationAsRead);

// Officer/President: Update issue status
router.put("/issues/:id/status", requireAuth, requireOfficer, updateStatus);

// President only: Manage user roles (promote/demote)
router.put("/users/:id/role", requireAuth, requirePresident, updateUserRole);

// President only: List all users
router.get("/users", requireAuth, requirePresident, getUsers);

// Officer/President: Get analytics
router.get("/analytics", requireAuth, requireOfficer, getAnalytics);

export default router;
