import { PrismaClient } from "@prisma/client";
import { uploadImage } from "../services/cloudinary.js";
import { assessIntensity, checkDuplicate as groqCheckDuplicate, generateCityReport as groqGenerateCityReport } from "../services/groq.js";

const prisma = new PrismaClient();

/**
 * POST /api/issues/check-duplicate — AI-powered semantic duplicate check
 */
export const checkDuplicateIssue = async (req, res) => {
    try {
        const { title, description, city, area } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: "Title and description required for duplicate check" });
        }

        const assignedCity = city || "Bengaluru";
        const assignedArea = typeof area === "string" && area.trim().length > 0 ? area.trim() : null;

        // Fetch recent issues from the same city (last 7 days)
        const recentIssues = await prisma.issue.findMany({
            where: {
                city: assignedCity,
                ...(assignedArea ? { area: assignedArea } : {}),
                createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                status: { not: "RESOLVED" }
            },
            take: 20,
            select: { id: true, title: true, description: true }
        });

        const result = await groqCheckDuplicate(title, description, recentIssues);
        res.json(result);
    } catch (error) {
        console.error("Check duplicate error:", error);
        res.status(500).json({ error: "Failed to check duplicates" });
    }
};

/**
 * GET /api/issues/city-report?city=Bengaluru — Generate AI summary of city issues
 */
export const getCityReport = async (req, res) => {
    try {
        const city = (req.query.city || "Bengaluru").toString();
        const area = typeof req.query.area === "string" && req.query.area.trim() ? req.query.area.trim() : null;

        // Fetch up to 50 recent issues to summarize
        const recentIssues = await prisma.issue.findMany({
            where: {
                city,
                ...(area ? { area } : {}),
            },
            orderBy: { createdAt: "desc" },
            take: 50,
            select: { id: true, title: true, description: true, category: true, status: true }
        });

        const reportLabel = area || city;
        const reportMarkdown = await groqGenerateCityReport(reportLabel, recentIssues);

        res.json({ city, reportMarkdown });
    } catch (error) {
        console.error("City Report error:", error);
        res.status(500).json({ error: "Failed to generate AI city report" });
    }
};

/**
 * POST /api/issues — Create a new issue
 */
export const createIssue = async (req, res) => {
    try {
        const { title, description, category, latitude, longitude, city, area } = req.body;

        if (!title || !description || !category || !latitude || !longitude) {
            return res.status(400).json({ error: "All fields are required" });
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadImage(req.file.buffer);
        }

        // Assess intensity via Groq AI
        const intensity = await assessIntensity(title, description, category);

        const assignedCity = city || "Bengaluru";
        const normalizedArea = typeof area === "string" && area.trim().length > 0 ? area.trim() : null;

        const issue = await prisma.issue.create({
            data: {
                title,
                description,
                category,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                city: assignedCity,
                ...(normalizedArea ? { area: normalizedArea } : {}),
                imageUrl,
                intensity,
                createdById: req.user.id,
            },
            include: {
                createdBy: { select: { id: true, name: true, email: true } },
                _count: { select: { comments: true, voteRecords: true } },
            },
        });

        // Trigger Notification for severe issues (Intensity >= 8) or Bribery
        if (intensity >= 8 || category === "BRIBERY") {
            // Find presidents and top officers in that city
            const admins = await prisma.user.findMany({
                where: {
                    role: { in: ["PRESIDENT", "OFFICER"] },
                    city: assignedCity,
                }
            });

            // For bribery, alert everyone in the city. For severe issues, alert president + local area officers.
            const targets = category === "BRIBERY"
                ? admins
                : admins.filter((a) =>
                    a.role === "PRESIDENT" || (normalizedArea ? a.area === normalizedArea : a.role === "OFFICER")
                );

            if (targets.length > 0) {
                const locationLabel = normalizedArea ? `${normalizedArea}, ${assignedCity}` : assignedCity;
                await prisma.notification.createMany({
                    data: targets.map((admin) => ({
                        userId: admin.id,
                        issueId: issue.id,
                        message: category === "BRIBERY"
                            ? `🚨 URGENT: New Bribery Report filed in ${locationLabel}.`
                            : `⚠️ High Intensity Alert (Score: ${intensity}/10): ${title} in ${locationLabel}.`,
                    }))
                });
            }
        }

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
        const { category, status, search, page = 1, limit = 20, area } = req.query;

        const where = {};
        if (category) where.category = category;
        if (status) where.status = status;
        if (area) where.area = area;
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
                    assignedTo: { select: { id: true, name: true, area: true } },
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
 * GET /api/admin/issues — Officer/President scoped issue list
 */
export const getAdminIssues = async (req, res) => {
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

        if (req.user?.role === "OFFICER") {
            if (!req.user.area) {
                return res.json({
                    issues: [],
                    pagination: { page: parseInt(page), limit: parseInt(limit), total: 0, pages: 0 },
                });
            }
            where.area = req.user.area;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [issues, total] = await Promise.all([
            prisma.issue.findMany({
                where,
                include: {
                    createdBy: { select: { id: true, name: true } },
                    assignedTo: { select: { id: true, name: true, area: true } },
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
        console.error("Get admin issues error:", error);
        res.status(500).json({ error: "Failed to fetch admin issues" });
    }
};

/**
 * GET /api/issues/mine — Get issues created by the current user
 */
export const getMyIssues = async (req, res) => {
    try {
        const { category, status, search, page = 1, limit = 20 } = req.query;

        const where = { createdById: req.user.id };
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
                    assignedTo: { select: { id: true, name: true, area: true } },
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
        console.error("Get my issues error:", error);
        res.status(500).json({ error: "Failed to fetch your issues" });
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
                assignedTo: { select: { id: true, name: true, area: true, avgRating: true } },
                resolvedBy: { select: { id: true, name: true } },
                comments: {
                    include: {
                        user: { select: { id: true, name: true, role: true } },
                    },
                    orderBy: { createdAt: "desc" },
                },
                voteRecords: {
                    select: { userId: true },
                },
                ratings: {
                    include: {
                        givenBy: { select: { id: true, name: true } },
                    },
                },
                _count: { select: { comments: true, voteRecords: true } },
            },
        });

        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

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
            await prisma.$transaction([
                prisma.vote.delete({ where: { id: existingVote.id } }),
                prisma.issue.update({
                    where: { id },
                    data: { votes: { decrement: 1 } },
                }),
            ]);
            return res.json({ voted: false, message: "Vote removed" });
        } else {
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
                user: { select: { id: true, name: true, role: true } },
            },
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error("Add comment error:", error);
        res.status(500).json({ error: "Failed to add comment" });
    }
};

/**
 * PUT /api/admin/issues/:id/status — Update issue status (role-based)
 *   OFFICER: can only set IN_PROGRESS (and claims the issue)
 *   PRESIDENT: can set IN_PROGRESS or RESOLVED
 */
export const updateStatus = async (req, res) => {
    try {
        const { status, department } = req.body;
        const userRole = req.user.role;

        // Validate status value
        const validStatuses = ["REPORTED", "IN_PROGRESS", "RESOLVED"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        // Role-based restrictions
        if (userRole === "OFFICER" && status === "RESOLVED") {
            return res.status(403).json({
                error: "Officers can only mark issues as In Progress. Only the President can mark as Resolved.",
            });
        }

        const existingIssue = await prisma.issue.findUnique({
            where: { id: req.params.id },
        });

        if (!existingIssue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        const updateData = {
            status,
            ...(department && { department }),
        };

        // If setting to IN_PROGRESS, assign the officer
        if (status === "IN_PROGRESS") {
            updateData.assignedToId = req.user.id;
            // Increment assigned count for the officer
            await prisma.user.update({
                where: { id: req.user.id },
                data: { assignedCount: { increment: 1 } },
            });
        }

        // If PRESIDENT resolves, record who resolved it
        if (status === "RESOLVED") {
            updateData.resolvedById = req.user.id;
            // Increment resolved count for the resolver
            await prisma.user.update({
                where: { id: req.user.id },
                data: { resolvedCount: { increment: 1 } },
            });

            // Also increment for the assigned officer if different
            if (existingIssue.assignedToId && existingIssue.assignedToId !== req.user.id) {
                await prisma.user.update({
                    where: { id: existingIssue.assignedToId },
                    data: { resolvedCount: { increment: 1 } },
                });
            }
        }

        const issue = await prisma.issue.update({
            where: { id: req.params.id },
            data: updateData,
            include: {
                createdBy: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true, area: true } },
                _count: { select: { comments: true, voteRecords: true } },
            },
        });

        if (existingIssue.createdById) {
            const statusLabel =
                status === "IN_PROGRESS"
                    ? "In Progress"
                    : status === "RESOLVED"
                        ? "Resolved"
                        : "Reported";
            await prisma.notification.create({
                data: {
                    userId: existingIssue.createdById,
                    issueId: issue.id,
                    message: `Update: Your report "${issue.title}" is now ${statusLabel}.`,
                },
            });
        }

        res.json(issue);
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({ error: "Failed to update issue status" });
    }
};

/**
 * POST /api/issues/:id/rate — Citizen rates the officer who handled their issue
 */
export const rateOfficer = async (req, res) => {
    try {
        const { score, feedback } = req.body;
        const issueId = req.params.id;
        const userId = req.user.id;

        if (!score || score < 1 || score > 5) {
            return res.status(400).json({ error: "Rating must be 1-5" });
        }

        // Get the issue
        const issue = await prisma.issue.findUnique({
            where: { id: issueId },
        });

        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        // Only the citizen who created the issue can rate
        if (issue.createdById !== userId) {
            return res.status(403).json({ error: "Only the issue reporter can rate" });
        }

        // Must have an assigned officer or resolver (optional)
        const officerId = issue.resolvedById || issue.assignedToId;

        // Create or update rating
        const rating = await prisma.rating.upsert({
            where: {
                issueId_givenById: { issueId, givenById: userId },
            },
            update: { score, feedback },
            create: {
                score,
                feedback,
                issueId,
                givenById: userId,
                ...(officerId && { officerId }),
            },
        });

        // Recalculate officer's average rating if applicable
        let officerAvgRating = 0;
        let totalRatings = 0;
        if (officerId) {
            const allRatings = await prisma.rating.aggregate({
                where: { officerId },
                _avg: { score: true },
                _count: { score: true },
            });

            officerAvgRating = allRatings._avg.score || 0;
            totalRatings = allRatings._count.score;

            await prisma.user.update({
                where: { id: officerId },
                data: {
                    avgRating: officerAvgRating,
                },
            });
        }

        res.json({
            rating,
            officerAvgRating,
            totalRatings,
        });
    } catch (error) {
        console.error("Rate officer error:", error);
        res.status(500).json({ error: "Failed to rate officer" });
    }
};

/**
 * GET /api/leaderboard — Public leaderboard
 */
export const getLeaderboard = async (req, res) => {
    try {
        // Top officers by rating and resolution
        const officers = await prisma.user.findMany({
            where: { role: { in: ["OFFICER", "PRESIDENT"] } },
            select: {
                id: true,
                name: true,
                role: true,
                area: true,
                avgRating: true,
                resolvedCount: true,
                assignedCount: true,
                _count: { select: { ratingsReceived: true } },
            },
            orderBy: [{ avgRating: "desc" }, { resolvedCount: "desc" }],
        });

        // Top citizens by issues reported + resolved
        const citizens = await prisma.user.findMany({
            where: { role: "CITIZEN" },
            select: {
                id: true,
                name: true,
                _count: { select: { issues: true, votes: true, comments: true } },
            },
            orderBy: { issues: { _count: "desc" } },
            take: 20,
        });

        // Add resolution percentage to officers
        const officersWithStats = officers.map((o) => ({
            ...o,
            totalRatings: o._count.ratingsReceived,
            resolutionRate:
                o.assignedCount > 0
                    ? parseFloat(((o.resolvedCount / o.assignedCount) * 100).toFixed(1))
                    : 0,
        }));

        res.json({ officers: officersWithStats, citizens });
    } catch (error) {
        console.error("Leaderboard error:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
};

/**
 * PUT /api/admin/users/:id/role — President can promote/demote users
 */
export const updateUserRole = async (req, res) => {
    try {
        const { role, area } = req.body;
        const validRoles = ["CITIZEN", "OFFICER", "PRESIDENT"];

        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: {
                role,
                ...(area && { area }),
            },
        });

        res.json(user);
    } catch (error) {
        console.error("Update role error:", error);
        res.status(500).json({ error: "Failed to update user role" });
    }
};

/**
 * GET /api/admin/users — List all users (for president role management)
 */
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                area: true,
                avgRating: true,
                resolvedCount: true,
                createdAt: true,
                _count: { select: { issues: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        res.json(users);
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

/**
 * GET /api/admin/analytics — Officer/President analytics (area-scoped for officers)
 */
export const getAdminAnalytics = async (req, res) => {
    try {
        const where = {};
        if (req.user?.role === "OFFICER") {
            if (!req.user.area) {
                return res.json({
                    totalIssues: 0,
                    resolutionRate: 0,
                    byCategory: [],
                    byStatus: [],
                    recentIssues: [],
                    topVotedIssues: [],
                });
            }
            where.area = req.user.area;
        }

        const [totalIssues, byCategory, byStatus, recentIssues, topVotedIssues] =
            await Promise.all([
                prisma.issue.count({ where }),
                prisma.issue.groupBy({ by: ["category"], where, _count: { id: true } }),
                prisma.issue.groupBy({ by: ["status"], where, _count: { id: true } }),
                prisma.issue.findMany({
                    where,
                    orderBy: { createdAt: "desc" },
                    take: 5,
                    include: { createdBy: { select: { name: true } } },
                }),
                prisma.issue.findMany({
                    where,
                    orderBy: { votes: "desc" },
                    take: 5,
                    include: { createdBy: { select: { name: true } } },
                }),
            ]);

        const resolvedCount =
            byStatus.find((s) => s.status === "RESOLVED")?._count?.id || 0;
        const resolutionRate =
            totalIssues > 0 ? ((resolvedCount / totalIssues) * 100).toFixed(1) : 0;

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
        console.error("Admin analytics error:", error);
        res.status(500).json({ error: "Failed to fetch admin analytics" });
    }
};

/**
 * GET /api/issues/stats — Public analytics (no auth)
 */
export const getAnalytics = async (req, res) => {
    try {
        const [totalIssues, byCategory, byStatus, recentIssues, topVotedIssues] =
            await Promise.all([
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

        const resolvedCount =
            byStatus.find((s) => s.status === "RESOLVED")?._count?.id || 0;
        const resolutionRate =
            totalIssues > 0 ? ((resolvedCount / totalIssues) * 100).toFixed(1) : 0;

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

/**
 * POST /api/admin/users/:id/rate — Citizen rates an officer generally from the leaderboard
 */
export const rateOfficerGeneral = async (req, res) => {
    try {
        const { score, feedback } = req.body;
        const officerId = req.params.id;
        const userId = req.user.id; // rater

        if (!score || score < 1 || score > 5) {
            return res.status(400).json({ error: "Rating must be 1-5" });
        }

        // Validate officer
        const officer = await prisma.user.findUnique({
            where: { id: officerId }
        });

        if (!officer || (officer.role !== "OFFICER" && officer.role !== "PRESIDENT")) {
            return res.status(404).json({ error: "Officer not found" });
        }

        // Create rating (no issue fixed link)
        const rating = await prisma.rating.create({
            data: {
                score,
                feedback,
                givenById: userId,
                officerId: officerId,
            },
        });

        // Recalculate officer's average rating
        const allRatings = await prisma.rating.aggregate({
            where: { officerId },
            _avg: { score: true },
            _count: { score: true },
        });

        await prisma.user.update({
            where: { id: officerId },
            data: {
                avgRating: allRatings._avg.score || 0,
            },
        });

        res.json({
            rating,
            officerAvgRating: allRatings._avg.score,
            totalRatings: allRatings._count.score,
        });
    } catch (error) {
        console.error("General rate officer error:", error);
        res.status(500).json({ error: "Failed to rate officer" });
    }
};
