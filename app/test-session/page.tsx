'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function TestSessionPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Session Debug Page</h1>

          <div className="space-y-4">
            {/* Status */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-gray-700 mb-2">Session Status:</h2>
              <div className="flex items-center space-x-2">
                {status === 'loading' && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span className="text-blue-600">Loading...</span>
                  </>
                )}
                {status === 'authenticated' && (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-semibold">Authenticated ✓</span>
                  </>
                )}
                {status === 'unauthenticated' && (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 font-semibold">Not Authenticated</span>
                  </>
                )}
              </div>
            </div>

            {/* Session Data */}
            {session && (
              <div className="border-b pb-4">
                <h2 className="font-semibold text-gray-700 mb-2">Session Data:</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm"><strong>Name:</strong> {session.user?.name}</p>
                  <p className="text-sm"><strong>Email:</strong> {session.user?.email}</p>
                  <p className="text-sm"><strong>User Type:</strong> {(session.user as any)?.type || 'N/A'}</p>
                </div>
              </div>
            )}

            {/* Raw Session Object */}
            <div>
              <h2 className="font-semibold text-gray-700 mb-2">Raw Session Object:</h2>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify({ status, session }, null, 2)}
              </pre>
            </div>

            {/* Navigation */}
            <div className="pt-4 flex space-x-4">
              <Link
                href="/"
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
              >
                Back to Home
              </Link>
              {!session && (
                <>
                  <Link
                    href="/auth/login"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Register
                  </Link>
                </>
              )}
              {session && (
                <Link
                  href="/account"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  My Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
