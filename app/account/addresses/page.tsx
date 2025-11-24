'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MapPin, Plus, Pencil, Trash2, Loader2, ArrowLeft, Star, Home, Building, Phone, Check, X } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

interface Address {
  id: string
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state?: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
}

const emptyAddress: Omit<Address, 'id'> = {
  firstName: '',
  lastName: '',
  company: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
  phone: '',
  isDefault: false
}

export default function AddressesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState(emptyAddress)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/addresses')
      const data = await res.json()
      setAddresses(data.addresses || [])
    } catch (error) {
      console.error('Error fetching addresses:', error)
      toast.error('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAddresses()
    }
  }, [status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-falco-accent mx-auto" />
          <p className="mt-3 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingAddress
        ? `/api/addresses/${editingAddress.id}`
        : '/api/addresses'

      const method = editingAddress ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        throw new Error('Failed to save address')
      }

      toast.success(editingAddress ? 'Address updated!' : 'Address added!')
      setShowForm(false)
      setEditingAddress(null)
      setFormData(emptyAddress)
      fetchAddresses()
    } catch (error) {
      toast.error('Failed to save address')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || '',
      address1: address.address1,
      address2: address.address2 || '',
      city: address.city,
      state: address.state || '',
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || '',
      isDefault: address.isDefault
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Address deleted!')
      fetchAddresses()
    } catch (error) {
      toast.error('Failed to delete address')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true })
      })
      if (!res.ok) throw new Error('Failed to update')
      toast.success('Default address updated!')
      fetchAddresses()
    } catch (error) {
      toast.error('Failed to update default address')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingAddress(null)
    setFormData(emptyAddress)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-16 sm:pb-12 mt-8 sm:mt-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/account"
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Addresses</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your shipping addresses</p>
            </div>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-falco-accent text-black font-semibold rounded-lg hover:bg-falco-gold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Address
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  required
                  placeholder="Street address"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, etc."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-falco-accent rounded focus:ring-falco-accent"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default address
                </label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-falco-accent text-black font-semibold rounded-lg hover:bg-falco-gold transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {editingAddress ? 'Update Address' : 'Save Address'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-3 text-gray-600">Loading addresses...</p>
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses yet</h3>
            <p className="text-gray-600 mb-6">Add a shipping address to speed up your checkout.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-falco-accent text-black font-semibold rounded-lg hover:bg-falco-gold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white rounded-xl shadow-sm p-5 relative ${
                  address.isDefault ? 'ring-2 ring-falco-accent' : ''
                }`}
              >
                {/* Default Badge */}
                {address.isDefault && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-falco-accent text-black text-xs font-semibold px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3" />
                    Default
                  </div>
                )}

                {/* Address Content */}
                <div className="pr-20">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">
                      {address.firstName} {address.lastName}
                    </span>
                  </div>

                  {address.company && (
                    <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
                      <Building className="w-4 h-4 text-gray-400" />
                      {address.company}
                    </div>
                  )}

                  <p className="text-sm text-gray-600 ml-6">
                    {address.address1}
                    {address.address2 && <>, {address.address2}</>}
                  </p>
                  <p className="text-sm text-gray-600 ml-6">
                    {address.city}{address.state && `, ${address.state}`} {address.postalCode}
                  </p>
                  <p className="text-sm text-gray-600 ml-6">{address.country}</p>

                  {address.phone && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {address.phone}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-sm text-falco-accent hover:underline font-medium"
                    >
                      Set as Default
                    </button>
                  )}
                  <div className="flex-1" />
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={deletingId === address.id}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === address.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Account Link */}
        <div className="mt-8 text-center">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Account
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
