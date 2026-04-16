import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { getInitializationErrorResponse } from "@/lib/bootstrap";

const handler = NextAuth(authOptions);

export async function GET(req, ctx) {
  const initializationError = await getInitializationErrorResponse();

  if (initializationError) {
    return initializationError;
  }

  return handler(req, ctx);
}

export async function POST(req, ctx) {
  const initializationError = await getInitializationErrorResponse();

  if (initializationError) {
    return initializationError;
  }

  return handler(req, ctx);
}
