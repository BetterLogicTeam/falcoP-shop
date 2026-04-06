import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function requireAdmin(): Promise<
  | { ok: true }
  | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions)
  const type = (session?.user as { type?: string } | undefined)?.type
  if (!session?.user || type !== 'admin') {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }
  return { ok: true }
}
