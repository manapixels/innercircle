import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import { Database } from './app/_lib/definitions'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  // const { data: { session } } = await supabase.auth.getSession()

  // if (!session) {
  //   // Redirect to login page
  //   const redirectUrl = req.nextUrl.clone()
  //   redirectUrl.pathname = '/login'
  //   return NextResponse.redirect(redirectUrl)
  // }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if user is not signed in and the current path is not / redirect the user to /
  if (!user && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}