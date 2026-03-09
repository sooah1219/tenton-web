import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "admin_token";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (pathname.startsWith("/tentonAdmin")) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin-login";
      url.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tentonAdmin/:path*"],
};
