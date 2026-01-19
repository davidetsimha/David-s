import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n for admin routes - admin is not internationalized
  if (pathname.startsWith('/admin')) {
    // Only handle Supabase session for admin routes
    return updateSession(request);
  }

  // Handle i18n for public routes
  const response = intlMiddleware(request);

  // Update Supabase session
  const supabaseResponse = await updateSession(request);

  // Merge cookies from Supabase response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, {
      ...cookie,
    });
  });

  return response;
}

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Static files (images, fonts, etc.)
  // - Next.js internal routes
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|videos|.*\\..*|sitemap.xml|robots.txt).*)',
  ],
};
