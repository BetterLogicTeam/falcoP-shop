'use client'

import { useEffect, useState } from 'react'
import { Plus, Loader2, Trash2, Percent, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatPrice } from '@/lib/currency'

interface Coupon {
  id: string
  code: string
  description?: string | null
  discountType: string
  discountValue: number
  minOrderAmount?: number | null
  maxDiscount?: number | null
  usageLimit?: number | null
  usageCount: number
  isActive: boolean
  createdAt: string
  stats?: {
    totalOrders: number
    totalSales: number
    totalDiscountGiven: number
  }
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
  })

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch coupons')
      setCoupons(data.coupons || [])
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch coupons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const createCoupon = async () => {
    if (!form.code.trim() || !form.discountValue) {
      toast.error('Code and discount value are required')
      return
    }

    try {
      setSaving(true)
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code,
          description: form.description || null,
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
          usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create coupon')

      toast.success('Coupon created')
      setForm({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        maxDiscount: '',
        usageLimit: '',
      })
      fetchCoupons()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create coupon')
    } finally {
      setSaving(false)
    }
  }

  const toggleCoupon = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update coupon')
      toast.success(`Coupon ${!coupon.isActive ? 'activated' : 'disabled'}`)
      fetchCoupons()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update coupon')
    }
  }

  const deleteCoupon = async (coupon: Coupon) => {
    if (!confirm(`Delete coupon ${coupon.code}?`)) return

    try {
      const res = await fetch(`/api/coupons/${coupon.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete coupon')
      toast.success('Coupon removed')
      fetchCoupons()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete coupon')
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Coupons & Influencer Tracking</h1>
        <p className="text-gray-600">Create discount codes, remove old codes, and track sales per code.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Create coupon</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={form.code}
            onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
            placeholder="Code (e.g. INFLUENCER10)"
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-falco-accent focus:border-transparent"
          />
          <input
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Influencer / note"
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-falco-accent focus:border-transparent"
          />
          <select
            value={form.discountType}
            onChange={(e) => setForm((p) => ({ ...p, discountType: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-falco-accent focus:border-transparent"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed amount (SEK)</option>
          </select>
          <input
            type="number"
            value={form.discountValue}
            onChange={(e) => setForm((p) => ({ ...p, discountValue: e.target.value }))}
            placeholder="Discount value"
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-falco-accent focus:border-transparent"
          />
          <input
            type="number"
            value={form.minOrderAmount}
            onChange={(e) => setForm((p) => ({ ...p, minOrderAmount: e.target.value }))}
            placeholder="Min order amount (optional)"
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-falco-accent focus:border-transparent"
          />
          <input
            type="number"
            value={form.maxDiscount}
            onChange={(e) => setForm((p) => ({ ...p, maxDiscount: e.target.value }))}
            placeholder="Max discount (optional)"
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-falco-accent focus:border-transparent"
          />
          <input
            type="number"
            value={form.usageLimit}
            onChange={(e) => setForm((p) => ({ ...p, usageLimit: e.target.value }))}
            placeholder="Usage limit (optional)"
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-falco-accent focus:border-transparent"
          />
        </div>
        <button
          onClick={createCoupon}
          disabled={saving}
          className="mt-4 px-4 py-2 bg-falco-accent text-black rounded-lg font-semibold inline-flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">All coupons</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No coupons yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">Code</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">Discount</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">Usage</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">Influencer Sales</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-900">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{coupon.code}</div>
                      <div className="text-xs text-gray-500">{coupon.description || '-'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-1 text-sm text-gray-900">
                        {coupon.discountType === 'percentage' ? <Percent className="w-3 h-3" /> : <Tag className="w-3 h-3" />}
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : formatPrice(coupon.discountValue || 0)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {coupon.usageCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>{coupon.stats?.totalOrders || 0} orders</div>
                      <div className="text-gray-600">{formatPrice(coupon.stats?.totalSales || 0)} sales</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCoupon(coupon)}
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => deleteCoupon(coupon)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

