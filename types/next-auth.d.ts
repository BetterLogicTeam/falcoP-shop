import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      type: 'admin' | 'customer'
      role?: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    type: 'admin' | 'customer'
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    type: 'admin' | 'customer'
    role?: string
  }
}
