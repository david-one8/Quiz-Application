import { withAuth } from "next-auth/middleware";
import { authPages } from "@/lib/auth-pages";

export default withAuth({
  pages: authPages
});

export const config = {
  matcher: ["/dashboard/:path*"]
};
