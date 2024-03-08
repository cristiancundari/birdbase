import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";
import { Role } from "@prisma/client";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  try {
    // This `try/catch` block is only here for the interactive tutorial.
    // Feel free to remove once you have Supabase connected.
    const { supabase, response } = createClient(request);

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(
        new URL(
          "/auth/login?callback=" +
            encodeURIComponent(
              request.nextUrl.pathname + request.nextUrl.search
            ),
          request.url
        )
      );
    }

    if (pathname.startsWith("/admin")) {
      const profilo = await supabase
        .from("profili")
        .select("id")
        .eq("id", session?.user.id)
        .eq("ruolo", Role.ADMIN)
        .single();
      if (!profilo.data) {
        return NextResponse.redirect(new URL("/app/home", request.url));
      }
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: ["/app/:path*", "/api/:path*", "/admin/:path*"],
};
