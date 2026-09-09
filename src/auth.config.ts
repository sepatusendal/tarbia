import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnLogin = nextUrl.pathname.startsWith("/login")

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl))
        }
        return true
      }

      // Redirect manually (rather than returning false) so NextAuth doesn't
      // tack on a `?callbackUrl=...` — login always sends users to
      // /dashboard regardless (see login/actions.ts), so it'd go unused.
      if (!isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl))
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
