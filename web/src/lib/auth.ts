import { NextAuthOptions, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from 'next-auth/providers/credentials'

declare module "next-auth" {
  interface Session {
    accessToken: string
  }
  interface User {
    accessToken: string
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60 // 1 day
  },
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' }
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong')
        }

        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          accessToken: data.accessToken
        }
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: User }) {
      if (user && user.accessToken){
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      if (token.accessToken){
        session.accessToken = token.accessToken
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}