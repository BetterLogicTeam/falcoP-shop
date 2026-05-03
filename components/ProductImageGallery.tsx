'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
} from 'lucide-react'

const PLACEHOLDER = '/images/placeholder-product.jpg'

const ZOOM_LEVELS = [1, 1.25, 1.5, 2, 2.5, 3] as const

type ProductImageGalleryProps = {
  urls: string[]
  alt: string
  /** Smaller controls + no cursor-follow zoom (e.g. quick-add modal) */
  compact?: boolean
  className?: string
}

export default function ProductImageGallery({
  urls: urlsProp,
  alt,
  compact = false,
  className = '',
}: ProductImageGalleryProps) {
  const urls = useMemo(() => {
    const u = urlsProp.filter(Boolean)
    return u.length > 0 ? u : [PLACEHOLDER]
  }, [urlsProp])

  const urlKey = urls.join('|')
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  /** Lightbox opens at 100% (index 0 in ZOOM_LEVELS). */
  const [zoomIdx, setZoomIdx] = useState(0)
  const zoom = ZOOM_LEVELS[Math.min(zoomIdx, ZOOM_LEVELS.length - 1)]
  /** Prev/next “pills” in lightbox: tap image area to hide/show (e.g. clean screenshot on mobile). */
  const [lightboxNavVisible, setLightboxNavVisible] = useState(true)

  const [hoverZoom, setHoverZoom] = useState(false)
  const [origin, setOrigin] = useState({ x: '50%', y: '50%' })

  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    setActiveIndex(0)
  }, [urlKey])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft')
        setActiveIndex((i) => (i - 1 + urls.length) % urls.length)
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % urls.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, urls.length])

  const safeIndex = Math.min(activeIndex, urls.length - 1)
  const currentSrc = urls[safeIndex] || PLACEHOLDER

  const goPrev = () => {
    setActiveIndex((i) => (i - 1 + urls.length) % urls.length)
  }

  const goNext = () => {
    setActiveIndex((i) => (i + 1) % urls.length)
  }

  const onMainMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (compact) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    setOrigin({ x: `${x}%`, y: `${y}%` })
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current
    touchStartX.current = null
    if (start == null || urls.length < 2) return
    const end = e.changedTouches[0]?.clientX
    if (end == null) return
    const dx = end - start
    if (dx > 56) goPrev()
    else if (dx < -56) goNext()
  }

  const zoomIn = () =>
    setZoomIdx((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1))
  const zoomOut = () => setZoomIdx((i) => Math.max(i - 1, 0))
  const zoomReset = () => setZoomIdx(0)

  const openLightbox = () => {
    setZoomIdx(0)
    setLightboxNavVisible(true)
    setLightboxOpen(true)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-gray-700/80 bg-gray-900 shadow-inner ${
          compact ? 'aspect-[5/4] max-h-52 sm:max-h-60' : 'aspect-square'
        } ${compact ? '' : 'group/main'}`}
        onMouseMove={onMainMouseMove}
        onMouseEnter={() => !compact && setHoverZoom(true)}
        onMouseLeave={() => {
          setHoverZoom(false)
          setOrigin({ x: '50%', y: '50%' })
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          onClick={openLightbox}
          className="relative block h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-falco-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          aria-label={`View ${alt} larger`}
        >
          <Image
            src={currentSrc}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-200 ease-out"
            style={{
              transform:
                !compact && hoverZoom ? 'scale(1.75)' : 'scale(1)',
              transformOrigin: compact ? 'center center' : `${origin.x} ${origin.y}`,
            }}
            unoptimized
            onError={(e) => {
              const t = e.target as HTMLImageElement
              if (t.src.endsWith(PLACEHOLDER)) return
              t.src = PLACEHOLDER
            }}
          />
        </button>

        {urls.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              className={`absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/55 p-2 text-white backdrop-blur-sm transition hover:bg-black/75 ${
                compact ? 'opacity-90' : 'opacity-0 group-hover/main:opacity-100'
              }`}
              aria-label="Previous image"
            >
              <ChevronLeft className={compact ? 'h-5 w-5' : 'h-6 w-6'} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className={`absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/55 p-2 text-white backdrop-blur-sm transition hover:bg-black/75 ${
                compact ? 'opacity-90' : 'opacity-0 group-hover/main:opacity-100'
              }`}
              aria-label="Next image"
            >
              <ChevronRight className={compact ? 'h-5 w-5' : 'h-6 w-6'} />
            </button>
          </>
        )}

        {urls.length > 1 && (
          <div
            className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-1.5"
            aria-hidden
          >
            {urls.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === safeIndex ? 'w-6 bg-falco-accent' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        <p className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-2 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
          {urls.length > 1 ? `${safeIndex + 1} / ${urls.length}` : 'Gallery'}
        </p>
      </div>

      {urls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {urls.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-20 ${
                safeIndex === index
                  ? 'border-falco-accent ring-2 ring-falco-accent/30'
                  : 'border-gray-600 hover:border-gray-400'
              }`}
              aria-label={`Show image ${index + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} — ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
                onError={(e) => {
                  const t = e.target as HTMLImageElement
                  if (t.src.endsWith(PLACEHOLDER)) return
                  t.src = PLACEHOLDER
                }}
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="Product image viewer"
        >
          <div
            className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2 sm:px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm text-white/90">
              {safeIndex + 1} / {urls.length}
            </span>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={zoomOut}
                className="rounded-lg border border-white/20 p-2 text-white hover:bg-white/10"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="min-w-[3rem] text-center text-sm text-white/80">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={zoomIn}
                className="rounded-lg border border-white/20 p-2 text-white hover:bg-white/10"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={zoomReset}
                className="rounded-lg border border-white/20 p-2 text-white hover:bg-white/10"
                aria-label="Reset zoom"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="rounded-lg border border-white/20 p-2 text-white hover:bg-white/10"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            className="relative flex min-h-0 flex-1 cursor-default items-center justify-center overflow-auto p-4"
            onClick={() => setLightboxNavVisible((v) => !v)}
            role="presentation"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- dynamic zoom transform */}
            <img
              src={currentSrc}
              alt={alt}
              className="max-h-[85dvh] max-w-full select-none object-contain transition-transform duration-150 ease-out"
              style={{ transform: `scale(${zoom})` }}
              draggable={false}
              onError={(e) => {
                const t = e.target as HTMLImageElement
                if (t.src.endsWith(PLACEHOLDER)) return
                t.src = PLACEHOLDER
              }}
            />

            {urls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    goPrev()
                  }}
                  className={`absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-2 text-white transition-opacity duration-200 hover:bg-black/80 sm:left-4 ${
                    lightboxNavVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    goNext()
                  }}
                  className={`absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-2 text-white transition-opacity duration-200 hover:bg-black/80 sm:right-4 ${
                    lightboxNavVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                  aria-label="Next"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
