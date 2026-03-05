import { Router } from "express";
import { requireAuth } from "../middleware/clerkAuth.js";
import { upload } from "../services/cloudinary.js";
import {
    createIssue,
    getIssues,
    getIssueById,
    voteOnIssue,
    addComment,
} from "../controllers/issueController.js";

const router = Router();

// Public: Get all issues (with optional filters)
router.get("/", getIssues);

// Public: Get single issue
router.get("/:id", getIssueById);

// Protected: Create issue (with optional image upload)
router.post("/", requireAuth, upload.single("image"), createIssue);

// Protected: Vote on issue
router.post("/:id/vote", requireAuth, voteOnIssue);

// Protected: Comment on issue
router.post("/:id/comment", requireAuth, addComment);

export default router;
