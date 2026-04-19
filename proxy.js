import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authPages } from "@/lib/auth-pages";

export default async function proxy(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (token) {
    return NextResponse.next();
  }

  const signInUrl = new URL(authPages.signIn, request.url);
  signInUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"]
};
