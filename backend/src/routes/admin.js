import { Router } from "express";
import { requireAuth, requireOfficer, requirePresident } from "../middleware/clerkAuth.js";
import {
    updateStatus,
    getAnalytics,
    updateUserRole,
    getUsers,
} from "../controllers/issueController.js";
import {
    verifyAdminOtp,
    getNotifications,
    markNotificationAsRead
} from "../controllers/userController.js";

const router = Router();

// Citizen -> Admin promotion (requires valid OTP)
router.post("/verify-otp", requireAuth, verifyAdminOtp);

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
