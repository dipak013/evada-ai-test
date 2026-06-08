import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
  try {
    const session = req.cookies.get("sessionid");

    // Check if trying to access protected routes without session
    if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
      const response = NextResponse.redirect(new URL("/login", req.url));

      // Add cache control headers to prevent caching
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");

      return response;
    }

    // For authenticated dashboard routes, add cache control headers
    if (session && req.nextUrl.pathname.startsWith("/dashboard")) {
      const response = NextResponse.next();

      // Prevent caching of authenticated pages
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");

      return response;
    }

    // Allow the request to continue
    return NextResponse.next();
  } catch (err) {
    // On error, redirect to login as safe fallback
    console.error("Proxy error:", err);
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
