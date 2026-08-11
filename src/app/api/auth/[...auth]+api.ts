import { auth } from "@/lib/auth"; // import Better Auth handler

const handler = auth.handler;
export { handler as GET, handler as POST }; // export handler for both GET and POST requests

