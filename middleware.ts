import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuth } from "@/utils/isAuth";
import { isAdmin } from "@/utils/isAdmin";

export default function middleware(request: NextRequest) {
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
