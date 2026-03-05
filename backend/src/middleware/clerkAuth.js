import { clerkClient, verifyToken } from "@clerk/express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Middleware to verify Clerk authentication and attach user to request.
 * Creates a new user record in DB on first login.
 */
export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        const clerkUserId = payload.sub;

        if (!clerkUserId) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        let user = await prisma.user.findUnique({
            where: { clerkId: clerkUserId },
        });

        if (!user) {
            const clerkUser = await clerkClient.users.getUser(clerkUserId);
            user = await prisma.user.create({
                data: {
                    clerkId: clerkUserId,
                    name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
                    email: clerkUser.emailAddresses[0]?.emailAddress || "",
                    role: "CITIZEN",
                },
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ error: "Unauthorized: Authentication failed" });
    }
};

/**
 * Middleware to require OFFICER or PRESIDENT role.
 */
export const requireOfficer = (req, res, next) => {
    if (req.user?.role !== "OFFICER" && req.user?.role !== "PRESIDENT") {
        return res.status(403).json({ error: "Forbidden: Officer or President access required" });
    }
    next();
};

/**
 * Middleware to require PRESIDENT role.
 */
export const requirePresident = (req, res, next) => {
    if (req.user?.role !== "PRESIDENT") {
        return res.status(403).json({ error: "Forbidden: President access required" });
    }
    next();
};

/**
 * Legacy compatibility — allows OFFICER or PRESIDENT.
 */
export const requireAdmin = requireOfficer;
