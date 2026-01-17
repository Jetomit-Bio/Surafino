import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Chránené routy
  if (pathname.startsWith("/manager")) {
    // povolíme iba login stránku bez tokenu
    if (!token && pathname !== "/manager/login") {
      const loginUrl = new URL(
        "/manager/login",
        req.url
      );
      return NextResponse.redirect(loginUrl);
    }

    // ak je prihlásený a ide na login → hoď ho do managera
    if (token && pathname === "/manager/login") {
      const managerUrl = new URL(
        "/manager",
        req.url
      );
      return NextResponse.redirect(managerUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manager/:path*"],
};
