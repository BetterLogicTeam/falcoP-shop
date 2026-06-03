'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Activity, Loader2, RefreshCw } from 'lucide-react'

type AuditRow = {
  id: string
  createdAt: string
  paymentIntentId: string | null
  outcome: string
  httpStatus: number | null
  errorCode: string | null
  serverTotalOre: number | null
  stripeAmountOre: number | null
  stripeStatus: string | null
  itemCount: number | null
  orderNumber: string | null
  adminNotes: string | null
}

export default function AdminCheckoutAuditPage() {
  const [logs, setLogs] = useState<AuditRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [piInput, setPiInput] = useState('')
  const [outcomeInput, setOutcomeInput] = useState('')
  const [appliedPi, setAppliedPi] = useState('')
  const [appliedOutcome, setAppliedOutcome] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const q = new URLSearchParams()
      if (appliedPi.trim()) q.set('paymentIntentId', appliedPi.trim())
      if (appliedOutcome.trim()) q.set('outcome', appliedOutcome.trim())
      q.set('limit', '200')
      const res = await fetch(`/api/admin/checkout-audit?${q.toString()}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to load')
      }
      const raw = Array.isArray(data.logs) ? data.logs : []
      setLogs(
        raw.map((r: AuditRow) => ({
          ...r,
          createdAt: typeof r.createdAt === 'string' ? r.createdAt : new Date(r.createdAt).toISOString(),
        }))
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
      setLogs([])
    } finally {
      setLoading(false)
    }
  }, [appliedPi, appliedOutcome])

  useEffect(() => {
    void load()
  }, [load])

  const applyFilters = () => {
    setAppliedPi(piInput)
    setAppliedOutcome(outcomeInput)
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-7 h-7 text-gray-700" />
            Checkout audit log
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Server and client checkout events (survives short host log retention). Filter by PaymentIntent id
            fragment or outcome.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <input
          type="text"
          placeholder="PaymentIntent id contains…"
          value={piInput}
          onChange={(e) => setPiInput(e.target.value)}
          className="min-w-[12rem] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
        />
        <input
          type="text"
          placeholder="Outcome equals…"
          value={outcomeInput}
          onChange={(e) => setOutcomeInput(e.target.value)}
          className="min-w-[10rem] rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
        />
        <button
          type="button"
          onClick={applyFilters}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Apply
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm">{error}</div>
      ) : null}

      {loading && logs.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Time (UTC)</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Outcome</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">PI</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">HTTP</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Stripe</th>
                <th className="px-3 py-2 text-right font-semibold text-gray-700">Srv öre</th>
                <th className="px-3 py-2 text-right font-semibold text-gray-700">Str öre</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Order #</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No rows yet. Complete a checkout or Klarna return after deploy + `prisma db push`.
                  </td>
                </tr>
              ) : (
                logs.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-gray-800">
                      {row.createdAt?.slice(0, 19)?.replace('T', ' ') ?? '—'}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-900">{row.outcome}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-700 max-w-[200px] truncate" title={row.paymentIntentId || ''}>
                      {row.paymentIntentId || '—'}
                    </td>
                    <td className="px-3 py-2 text-gray-700">{row.httpStatus ?? '—'}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-700">{row.stripeStatus || row.errorCode || '—'}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs">{row.serverTotalOre ?? '—'}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs">{row.stripeAmountOre ?? '—'}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-900">{row.orderNumber || '—'}</td>
                    <td className="px-3 py-2 text-xs text-gray-600 max-w-xs truncate" title={row.adminNotes || ''}>
                      {row.adminNotes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
