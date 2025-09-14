import { toNextJsHandler } from "better-auth/next-js";
import { getAuthInstance } from "@/modules/auth/utils/auth-utils";

// Create a dynamic handler that gets the auth instance
const createHandler = async () => {
    const auth = await getAuthInstance();
    return toNextJsHandler(auth.handler);
};

// Export the handlers
export async function GET(request: Request) {
    const { GET: handler } = await createHandler();
    return handler(request);
}

export async function POST(request: Request) {
    const { POST: handler } = await createHandler();
    return handler(request);
}
