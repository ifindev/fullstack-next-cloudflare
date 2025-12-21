/** biome-ignore-all lint/style/noNonNullAssertion: <we will make sure it's not null> */
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { getDb } from "@/db";
import { Resend } from "resend";

let authInstance: ReturnType<typeof betterAuth> | null = null;

const createAuth = async () => {
    if (authInstance) {
        return authInstance;
    }

    const { env } = await getCloudflareContext({ async: true });
    const db = await getDb();

    // Initialize Resend for email sending
    const resend = new Resend((env as any).RESEND_API_KEY);

    authInstance = betterAuth({
        secret: env.BETTER_AUTH_SECRET,
        database: drizzleAdapter(db, {
            provider: "sqlite",
        }),
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: true,
            sendResetPassword: async ({ user, url }) => {
                // Send password reset email
                await resend.emails.send({
                    from: (env as any).SMTP_FROM_EMAIL || "noreply@toolsail.top",
                    to: user.email,
                    subject: "Reset your Toolsail password",
                    html: `
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h2 style="color: #0A0A0A;">Reset Your Password</h2>
                            <p>Hi ${user.name || "there"},</p>
                            <p>We received a request to reset your password for your Toolsail account.</p>
                            <p>Click the button below to create a new password:</p>
                            <a href="${url}" style="display: inline-block; background-color: #0A0A0A; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 16px; margin: 20px 0; font-weight: 600;">
                                Reset Password
                            </a>
                            <p>If you didn't request this, you can safely ignore this email.</p>
                            <p style="color: #757575; font-size: 14px;">This link will expire in 1 hour.</p>
                            <hr style="margin: 32px 0; border: none; border-top: 1px solid #E0E0E0;" />
                            <p style="color: #424242; font-size: 13px;">
                                Toolsail Team<br/>
                                <a href="mailto:contact@toolsail.top" style="color: #424242;">contact@toolsail.top</a>
                            </p>
                        </div>
                    `,
                });
            },
        },
        socialProviders: {
            google: {
                enabled:
                    process.env.NEXT_PUBLIC_FEATURE_GOOGLE_OAUTH === "true",
                clientId: (env as any).GOOGLE_CLIENT_ID!,
                clientSecret: (env as any).GOOGLE_CLIENT_SECRET!,
            },
        },
        session: {
            expiresIn: 60 * 60 * 24 * 30, // 30 days
            updateAge: 60 * 60 * 24, // Update session every 24 hours
        },
        user: {
            additionalFields: {
                role: {
                    type: "string",
                    defaultValue: "user",
                    input: false, // Don't allow users to set their own role
                },
            },
        },
        plugins: [nextCookies()],
    });

    return authInstance;
};

export const getAuth = async () => {
    return await createAuth();
};

export type Session = Awaited<ReturnType<typeof getAuth>>["$Infer"]["Session"];
export type User = Session["user"];
