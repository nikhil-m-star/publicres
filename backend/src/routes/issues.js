import { Router } from "express";
import { requireAuth } from "../middleware/clerkAuth.js";
import { upload } from "../services/cloudinary.js";
import {
    createIssue,
    getIssues,
    getIssueById,
    voteOnIssue,
    addComment,
    rateOfficer,
    getAnalytics,
    getLeaderboard,
    checkDuplicateIssue,
    getCityReport
} from "../controllers/issueController.js";

const router = Router();

// Public: Get all issues (with optional filters)
router.get("/", getIssues);

// Public: Get analytics/stats for landing page
router.get("/stats", getAnalytics);

// Public: Leaderboard
router.get("/leaderboard", getLeaderboard);

// Public: Get AI City Report
router.get("/city-report", getCityReport);

// Public: Check Dupes via Post
router.post("/check-duplicate", checkDuplicateIssue);

// Public: Get single issue
router.get("/:id", getIssueById);

// Protected: Create issue (with optional image upload)
router.post("/", requireAuth, upload.single("image"), createIssue);

// Protected: Vote on issue
router.post("/:id/vote", requireAuth, voteOnIssue);

// Protected: Comment on issue
router.post("/:id/comment", requireAuth, addComment);

// Protected: Rate officer on resolved issue
router.post("/:id/rate", requireAuth, rateOfficer);

export default router;
