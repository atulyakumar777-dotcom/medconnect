import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Doctor routes
    if (path.startsWith("/doctor") && !path.startsWith("/doctors") && token?.role !== "DOCTOR") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Patient routes
    if ((path.startsWith("/my-appointments") || path.startsWith("/my-profile")) && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Allow public routes
        if (
          path === "/" ||
          path.startsWith("/doctors") ||
          path.startsWith("/about") ||
          path.startsWith("/contact") ||
          path.startsWith("/login") ||
          path.startsWith("/register") ||
          path.startsWith("/api")
        ) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/doctor/:path*",
    "/my-appointments",
    "/my-profile",
  ],
};
