import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'admin-login',
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email }
        })

        if (!admin) {
          throw new Error('Invalid email or password')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          admin.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          type: 'admin'
        }
      }
    }),
    CredentialsProvider({
      id: 'customer-login',
      name: 'Customer Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const customer = await prisma.customer.findUnique({
          where: { email: credentials.email }
        })

        if (!customer || !customer.password) {
          throw new Error('Invalid email or password')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          customer.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: customer.id,
          email: customer.email,
          name: `${customer.firstName} ${customer.lastName}`,
          type: 'customer'
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.type = (user as any).type
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        (session.user as any).type = token.type
        (session.user as any).role = token.role
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}
