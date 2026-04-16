import nextAuthMiddleware from "next-auth/middleware";

export default function proxy(request) {
  return nextAuthMiddleware(request);
}

export const config = {
  matcher: ["/dashboard/:path*"]
};
