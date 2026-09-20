import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/admin-login", "/admin-verificar"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Tudo fora do login/verificação exige o cookie de sessão admin.
  // O layout /admin valida a sessão e os papéis de verdade.
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!isPublic && !req.cookies.get("hx_admin_session")?.value) {
    return NextResponse.redirect(new URL("/admin-login", req.nextUrl.origin));
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|brand|favicon.ico|.*\\.(?:png|jpe?g|gif|svg|webp|ico|css|js|txt|pdf|woff2?|mp[34]|webmanifest)$).*)",
  ],
};
