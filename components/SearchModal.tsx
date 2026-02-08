'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

type SearchModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    onClose()
    if (q) {
      router.push(`/shop?q=${encodeURIComponent(q)}`)
    } else {
      router.push('/shop')
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed z-[101] top-20 sm:top-24 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-full sm:max-w-xl">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 p-3 sm:p-4 min-w-0">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 min-w-0 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-3 py-2.5 text-base sm:text-lg outline-none focus:border-falco-accent focus:ring-1 focus:ring-falco-accent"
              aria-label="Search products"
            />
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <button
              type="submit"
              className="w-full bg-falco-accent text-black py-3 rounded-xl font-semibold hover:bg-falco-gold transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
