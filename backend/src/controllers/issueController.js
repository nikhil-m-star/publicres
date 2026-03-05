import { PrismaClient } from "@prisma/client";
import { uploadImage } from "../services/cloudinary.js";

const prisma = new PrismaClient();

/**
 * POST /api/issues — Create a new issue
 */
export const createIssue = async (req, res) => {
    try {
        const { title, description, category, latitude, longitude } = req.body;

        if (!title || !description || !category || !latitude || !longitude) {
            return res.status(400).json({ error: "All fields are required" });
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadImage(req.file.buffer);
        }

        const issue = await prisma.issue.create({
            data: {
                title,
                description,
                category,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                imageUrl,
                createdById: req.user.id,
            },
            include: {
                createdBy: { select: { id: true, name: true, email: true } },
                _count: { select: { comments: true, voteRecords: true } },
            },
        });

        res.status(201).json(issue);
    } catch (error) {
        console.error("Create issue error:", error);
        res.status(500).json({ error: "Failed to create issue" });
    }
};

/**
 * GET /api/issues — Get all issues with filters
 */
export const getIssues = async (req, res) => {
    try {
        const { category, status, search, page = 1, limit = 20 } = req.query;

        const where = {};
        if (category) where.category = category;
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [issues, total] = await Promise.all([
            prisma.issue.findMany({
                where,
                include: {
                    createdBy: { select: { id: true, name: true } },
                    _count: { select: { comments: true, voteRecords: true } },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: parseInt(limit),
            }),
            prisma.issue.count({ where }),
        ]);

        res.json({
            issues,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error("Get issues error:", error);
        res.status(500).json({ error: "Failed to fetch issues" });
    }
};

/**
 * GET /api/issues/:id — Get single issue with details
 */
export const getIssueById = async (req, res) => {
    try {
        const issue = await prisma.issue.findUnique({
            where: { id: req.params.id },
            include: {
                createdBy: { select: { id: true, name: true, email: true } },
                comments: {
                    include: {
                        user: { select: { id: true, name: true } },
                    },
                    orderBy: { createdAt: "desc" },
                },
                voteRecords: {
                    select: { userId: true },
                },
                _count: { select: { comments: true, voteRecords: true } },
            },
        });

        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        // Check if current user has voted (if authenticated)
        const hasVoted = req.user
            ? issue.voteRecords.some((v) => v.userId === req.user.id)
            : false;

        res.json({ ...issue, hasVoted });
    } catch (error) {
        console.error("Get issue error:", error);
        res.status(500).json({ error: "Failed to fetch issue" });
    }
};

/**
 * POST /api/issues/:id/vote — Toggle vote on issue
 */
export const voteOnIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const existingVote = await prisma.vote.findUnique({
            where: { issueId_userId: { issueId: id, userId } },
        });

        if (existingVote) {
            // Remove vote
            await prisma.$transaction([
                prisma.vote.delete({ where: { id: existingVote.id } }),
                prisma.issue.update({
                    where: { id },
                    data: { votes: { decrement: 1 } },
                }),
            ]);
            return res.json({ voted: false, message: "Vote removed" });
        } else {
            // Add vote
            await prisma.$transaction([
                prisma.vote.create({ data: { issueId: id, userId } }),
                prisma.issue.update({
                    where: { id },
                    data: { votes: { increment: 1 } },
                }),
            ]);
            return res.json({ voted: true, message: "Vote added" });
        }
    } catch (error) {
        console.error("Vote error:", error);
        res.status(500).json({ error: "Failed to toggle vote" });
    }
};

/**
 * POST /api/issues/:id/comment — Add comment to issue
 */
export const addComment = async (req, res) => {
    try {
        const { comment } = req.body;
        if (!comment?.trim()) {
            return res.status(400).json({ error: "Comment is required" });
        }

        const newComment = await prisma.comment.create({
            data: {
                comment: comment.trim(),
                issueId: req.params.id,
                userId: req.user.id,
            },
            include: {
                user: { select: { id: true, name: true } },
            },
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error("Add comment error:", error);
        res.status(500).json({ error: "Failed to add comment" });
    }
};

/**
 * PUT /api/issues/:id/status — Update issue status (Admin only)
 */
export const updateStatus = async (req, res) => {
    try {
        const { status, department } = req.body;
        const validStatuses = ["REPORTED", "IN_PROGRESS", "RESOLVED"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const issue = await prisma.issue.update({
            where: { id: req.params.id },
            data: {
                status,
                ...(department && { department }),
            },
            include: {
                createdBy: { select: { id: true, name: true } },
                _count: { select: { comments: true, voteRecords: true } },
            },
        });

        res.json(issue);
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({ error: "Failed to update issue status" });
    }
};

/**
 * GET /api/admin/analytics — Get analytics data
 */
export const getAnalytics = async (req, res) => {
    try {
        const [
            totalIssues,
            byCategory,
            byStatus,
            recentIssues,
            topVotedIssues,
        ] = await Promise.all([
            prisma.issue.count(),
            prisma.issue.groupBy({ by: ["category"], _count: { id: true } }),
            prisma.issue.groupBy({ by: ["status"], _count: { id: true } }),
            prisma.issue.findMany({
                orderBy: { createdAt: "desc" },
                take: 5,
                include: { createdBy: { select: { name: true } } },
            }),
            prisma.issue.findMany({
                orderBy: { votes: "desc" },
                take: 5,
                include: { createdBy: { select: { name: true } } },
            }),
        ]);

        const resolvedCount = byStatus.find((s) => s.status === "RESOLVED")?._count?.id || 0;
        const resolutionRate = totalIssues > 0 ? ((resolvedCount / totalIssues) * 100).toFixed(1) : 0;

        res.json({
            totalIssues,
            resolutionRate: parseFloat(resolutionRate),
            byCategory: byCategory.map((c) => ({
                category: c.category,
                count: c._count.id,
            })),
            byStatus: byStatus.map((s) => ({
                status: s.status,
                count: s._count.id,
            })),
            recentIssues,
            topVotedIssues,
        });
    } catch (error) {
        console.error("Analytics error:", error);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
};
