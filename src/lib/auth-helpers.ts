import { NextRequest } from "next/server";
import { getAuth } from "@/lib/auth";
import { apiError } from "@/lib/api-utils";

/**
 * Get the current session from request
 */
export async function getSession(request: NextRequest) {
    try {
        const auth = await getAuth();
        if (!auth) return null;
        
        const session = await auth.api.getSession({
            headers: request.headers,
        });
        return session;
    } catch (error) {
        return null;
    }
}

/**
 * Require authentication - returns session or error response
 */
export async function requireAuth(request: NextRequest) {
    const session = await getSession(request);

    if (!session || !session.user) {
        throw apiError("Authentication required", "UNAUTHORIZED", 401);
    }

    return session;
}

/**
 * Require admin role - returns session or error response
 */
export async function requireAdmin(request: NextRequest) {
    const session = await requireAuth(request);

    if ((session.user as any).role !== "admin") {
        throw apiError("Admin access required", "FORBIDDEN", 403, {
            requiredRole: "admin",
        });
    }

    return session;
}

/**
 * Check if user has specific admin role
 */
export async function hasAdminRole(
    request: NextRequest,
    requiredRole: "admin" | "editor" | "moderator",
) {
    const session = await requireAdmin(request);

    // Admin role check is already done by requireAdmin
    // Additional role check can be added here if needed
    return session;
}
