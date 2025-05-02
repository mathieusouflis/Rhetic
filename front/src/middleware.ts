import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "./config/constants";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const isLoginPage = request.nextUrl.pathname === ROUTES.LOGIN;
  const isRegisterPage = request.nextUrl.pathname === ROUTES.REGISTER;
  const isAuthPage = isLoginPage || isRegisterPage;

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    ROUTES.LOGIN,
    ROUTES.REGISTER,
  ],
};
