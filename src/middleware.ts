import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith("/about")) {
		return NextResponse.rewrite(new URL("/about-2", request.url));
	}

	if (request.nextUrl.pathname.startsWith("/dashboard")) {
		return NextResponse.rewrite(new URL("/dashboard/user", request.url));
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
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
