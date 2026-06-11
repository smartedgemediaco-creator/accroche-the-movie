"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { movies } from "@/data/movies"
import type { Movie } from "@/data/movies"

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-12 md:h-12 ml-1">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 md:w-10 md:h-10">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function FullScreenModal({ movie, onClose }: { movie: Movie; onClose: () => void }) {
  const [showTitle, setShowTitle] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setShowTitle(true), 800)
    const hideTimer = setTimeout(() => setShowTitle(false), 4000)
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer) }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    const autoClose = setTimeout(onClose, 120000)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
      clearTimeout(autoClose)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      onClick={onClose}
      style={{ animation: "fadeIn 0.3s ease both" }}
    >
      <div
        className="relative w-full h-full"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        <video
          className="w-full h-full object-contain bg-black"
          autoPlay
          controls
          playsInline
        >
          <source src={movie.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 px-8 pointer-events-none transition-all duration-700"
        style={{
          opacity: showTitle ? 1 : 0,
          transform: showTitle ? "translateY(0)" : "translateY(12px)",
        }}
      >
        <div className="mx-auto max-w-4xl text-center pb-6 md:pb-8">
          <h2 className="text-sm md:text-lg lg:text-xl font-medium text-white/50 leading-tight">
            {movie.title}
          </h2>
          <p className="text-sm md:text-lg font-semibold text-zinc-300 tracking-widest uppercase mt-1.5">
            Hooked
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 left-4 md:top-6 md:left-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 z-10 backdrop-blur-sm"
        aria-label="Close"
      >
        <CloseIcon />
      </button>
    </div>
  )
}

const VIDEO_PASSWORD = "laocoe"

function PasswordModal({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [value, setValue] = useState("")
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.toLowerCase() === VIDEO_PASSWORD) {
      onSuccess()
    } else {
      setError(true)
      setTimeout(() => setError(false), 500)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6"
      onClick={onClose}
      style={{ animation: "fadeIn 0.3s ease both" }}
    >
      <div
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full border border-[#c8a84e]/20 flex items-center justify-center text-[#c8a84e]/60 mb-5">
            <LockIcon />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Restricted Access</h2>
          <p className="text-sm text-zinc-500">Enter the password to view this content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/5 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#c8a84e]/30 transition-all duration-300"
              style={{ animation: error ? "shake 0.4s ease both" : undefined }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#c8a84e]/10 border border-[#c8a84e]/20 text-[#c8a84e]/80 text-sm tracking-[0.2em] uppercase font-medium hover:bg-[#c8a84e]/20 hover:border-[#c8a84e]/30 transition-all duration-300"
          >
            Unlock
          </button>
        </form>

        {error && (
          <p className="text-xs text-red-400/80 text-center mt-4" style={{ animation: "fadeIn 0.2s ease both" }}>
            Incorrect password. Try again.
          </p>
        )}
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 z-10 backdrop-blur-sm"
        aria-label="Close"
      >
        <CloseIcon />
      </button>
    </div>
  )
}

function MovieCard({ title, videoUrl, onPlay, index }: {
  title: string
  videoUrl: string
  onPlay: () => void
  index: number
}) {
  return (
    <button
      onClick={onPlay}
      className="group block w-full text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a84e]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
      style={{
        animation: "fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) both",
        animationDelay: `${0.2 + index * 0.15}s`,
      }}
    >
      <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-3xl bg-zinc-950 transition-all duration-700 group-hover:shadow-[0_0_80px_rgba(200,168,78,0.08)]">
        <Image
          src="/images/video-placeholder.png"
          alt={title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 80vw"
        />

        <div className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,168,78,0.15) 0%, transparent 70%)",
          }}
        />

        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.06) 3px, rgba(255,255,255,0.06) 4px)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 md:gap-8 pb-12 md:pb-16">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-500 group-hover:border-[#c8a84e] group-hover:bg-[#c8a84e]/15 group-hover:scale-110 group-hover:shadow-[0_0_100px_rgba(200,168,78,0.3)] backdrop-blur-sm bg-white/5">
            <span className="text-white/70 group-hover:text-[#c8a84e] transition-colors duration-500">
              <PlayIcon />
            </span>
          </div>
          <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-white/40 group-hover:text-[#c8a84e]/70 transition-colors duration-500">
            Click to play
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pt-48 pb-6 md:pb-10 px-6 md:px-10">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-[#c8a84e]/60 mb-3">
              {index === 0 ? "Feature Presentation" : "Next Feature"}
            </p>
            <h2 className="text-xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance">
              {index === 0 ? (
                <span className="text-sm md:text-lg lg:text-xl font-semibold tracking-tight">Accroche Movie Screening (Convened By The Oyo State Ministry Of Health)</span>
              ) : (
                title
              )}
            </h2>
          </div>
        </div>
      </div>
    </button>
  )
}

export default function MovieSection() {
  const [pendingMovie, setPendingMovie] = useState<Movie | null>(null)
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null)
  const closePlayer = useCallback(() => setPlayingMovie(null), [])

  const handlePlay = (movie: Movie) => setPendingMovie(movie)

  return (
    <>
      <section className="relative min-h-screen pb-24 md:pb-32 pt-16 md:pt-24 px-6 md:px-10 lg:px-16 max-w-7xl mx-auto space-y-10 md:space-y-16">
        <div className="absolute inset-0 page-pattern pointer-events-none opacity-50" />

        <div className="relative mb-12 md:mb-16 text-center">
          <p
            className="text-xs md:text-sm tracking-[0.35em] uppercase text-[#c8a84e]/60 mb-6 md:mb-8"
            style={{ animation: "fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) both" }}
          >
            Laocoe Productions
          </p>
          <h1
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white leading-none mb-3 md:mb-4"
            style={{ animation: "fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both" }}
          >
            ACCROCHE
          </h1>
          <p
            className="text-base md:text-xl lg:text-2xl font-semibold text-zinc-300 tracking-wide italic"
            style={{ animation: "fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both" }}
          >
            Hooked
          </p>
        </div>

        <div className="divider-glow max-w-xs mx-auto mb-10 md:mb-16" />

        {movies.map((movie, i) => (
          <div key={i}>
            {i > 0 && <div className="divider-glow-thin max-w-2xl mx-auto mb-10 md:mb-16" />}
            <MovieCard
              title={movie.title}
              videoUrl={movie.videoUrl}
              index={i}
              onPlay={() => handlePlay(movie)}
            />
          </div>
        ))}
      </section>

      {pendingMovie && (
        <PasswordModal
          onSuccess={() => { setPlayingMovie(pendingMovie); setPendingMovie(null) }}
          onClose={() => setPendingMovie(null)}
        />
      )}

      {playingMovie && (
        <FullScreenModal movie={playingMovie} onClose={closePlayer} />
      )}
    </>
  )
}
