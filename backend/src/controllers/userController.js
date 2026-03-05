import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

/**
 * POST /api/admin/verify-email
 * Allows a citizen with a @bmsce.ac.in email to upgrade to OFFICER or PRESIDENT
 */
export const verifyByEmail = async (req, res) => {
    try {
        const { requestedRole, area } = req.body;
        const userId = req.user.id;

        if (!requestedRole) {
            return res.status(400).json({ error: "requestedRole is required" });
        }

        const validRoles = ["OFFICER", "PRESIDENT"];
        if (!validRoles.includes(requestedRole)) {
            return res.status(400).json({ error: "Invalid role requested. Must be OFFICER or PRESIDENT." });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || !user.email.endsWith('@bmsce.ac.in')) {
            return res.status(403).json({ error: "Access Denied: You must use a valid bmsce.ac.in email address to verify as an Officer or President." });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                role: requestedRole,
                ...(area && { area }) // optionally set officer area
            }
        });

        res.json({ message: "Verification successful", user: updatedUser });
    } catch (error) {
        console.error("Email domain verify error:", error);
        res.status(500).json({ error: "Failed to verify email domain" });
    }
};

/**
 * GET /api/admin/notifications
 * Officers/Presidents get their unread AI intensity & bribery notifications
 */
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 20,
            include: { issue: { select: { id: true, title: true, category: true, intensity: true } } }
        });

        const unreadCount = await prisma.notification.count({
            where: { userId, isRead: false }
        });

        res.json({ notifications, unreadCount });
    } catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

/**
 * PUT /api/admin/notifications/:id/read
 * Mark a specific notification as read
 */
export const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Ensure the notification belongs to this user
        const notification = await prisma.notification.findUnique({ where: { id } });
        if (!notification || notification.userId !== userId) {
            return res.status(404).json({ error: "Notification not found" });
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });

        res.json(updated);
    } catch (error) {
        console.error("Mark notification read error:", error);
        res.status(500).json({ error: "Failed to mark as read" });
    }
};
