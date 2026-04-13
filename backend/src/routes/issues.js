import { Router } from "express";
import rateLimit from "express-rate-limit";
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
    getCityReport,
    getMyIssues
} from "../controllers/issueController.js";

const router = Router();

const duplicateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: "Too many requests. Please try again later." },
});

// Public: Get all issues (with optional filters)
router.get("/", getIssues);

// Public: Get analytics/stats for landing page
router.get("/stats", getAnalytics);

// Public: Leaderboard
router.get("/leaderboard", getLeaderboard);

// Public: Get AI City Report
router.get("/city-report", getCityReport);

// Protected: Get issues created by the current user
router.get("/mine", requireAuth, getMyIssues);

// Public: Check Dupes via Post
router.post("/check-duplicate", duplicateLimiter, checkDuplicateIssue);

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
