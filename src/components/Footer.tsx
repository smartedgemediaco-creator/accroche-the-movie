"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

const INSTAGRAM_URL =
  "https://www.instagram.com/accroche_movie?igsh=MW13OGNlZnRkbzc1Nw=="

const galleryImages = Array.from({ length: 6 }, (_, i) => ({
  src: `/images/gallery/gallery ${i + 1}.jpg`,
  alt: `Gallery ${i + 1}`,
}))

function GalleryGrid() {
  const [selected, setSelected] = useState<number | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selected === null) return
      if (e.key === "Escape") setSelected(null)
      if (e.key === "ArrowLeft" && selected > 0)
        setSelected(selected - 1)
      if (e.key === "ArrowRight" && selected < galleryImages.length - 1)
        setSelected(selected + 1)
    },
    [selected]
  )

  useEffect(() => {
    if (selected !== null) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [selected, handleKeyDown])

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {galleryImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a84e]/50"
            style={{
              animation: `fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 33vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-8 h-8 text-white/80"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </div>
          </button>
        ))}
      </div>



      {selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
          style={{ animation: "fadeIn 0.3s ease both" }}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 z-10"
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative max-w-4xl max-h-[80vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
          >
            <Image
              src={galleryImages[selected].src}
              alt={galleryImages[selected].alt}
              fill
              className="object-contain"
              sizes="90vw"
              unoptimized
            />
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/10 transition-all duration-500 text-xs tracking-[0.2em] uppercase backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3.5 h-3.5"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            View on Instagram
          </a>

          {selected > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelected(selected - 1)
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
              aria-label="Previous image"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          {selected < galleryImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelected(selected + 1)
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
              aria-label="Next image"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default function Footer() {
  return (
    <footer className="relative pt-4 md:pt-8 pb-10 md:pb-16 px-6 overflow-hidden">
      <div className="divider-glow mb-4 md:mb-8 max-w-2xl mx-auto" />

      <div className="relative text-center max-w-lg mx-auto flex flex-col items-center">
        <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#c8a84e]/40 mb-4">
          Laocoe Productions
        </p>

        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="w-8 h-px bg-zinc-800" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84e]/30" />
          <span className="w-8 h-px bg-zinc-800" />
        </div>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#8b3a3a]/50 text-[#c47a7a] hover:text-white hover:border-[#c47a7a] hover:bg-[#8b3a3a]/15 transition-all duration-500 group mb-10"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <span className="text-xs tracking-[0.2em] uppercase font-medium">
            Follow on Instagram
          </span>
        </a>

        <div className="w-full mb-10">
          <GalleryGrid />
        </div>

        <a
          href="https://laocoeproductions.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 text-xs md:text-sm tracking-[0.25em] uppercase text-[#38bdf8]/60 hover:text-[#38bdf8] transition-all duration-500 group mb-6"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-3.5 h-3.5"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          laocoeproductions.com
        </a>

        <p className="text-xs text-zinc-700 tracking-wider uppercase">
          &copy; {new Date().getFullYear()} Accroche. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
