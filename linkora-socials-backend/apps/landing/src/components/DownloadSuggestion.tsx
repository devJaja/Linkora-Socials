'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Globe, X } from 'lucide-react'

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || 'https://linkora.app'
const APK_URL =
  process.env.NEXT_PUBLIC_APK_URL ||
  'https://expo.dev/accounts/devjaja/projects/linkora-socials/builds/3cfeba7e-a26c-495d-bbde-152c374d6800'
const DISMISS_KEY = 'linkora:landing:download:dismissed'

export default function DownloadSuggestion() {
  const [visible, setVisible] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent
    const isMobile =
      /Mobi|Android|iPhone|iPad/i.test(ua) || navigator.maxTouchPoints > 0
    if (!isMobile) return

    let dismissed = false
    try {
      dismissed = window.localStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      /* ignore */
    }
    if (dismissed) return

    setIsAndroid(/android/i.test(ua))
    const timer = setTimeout(() => setVisible(true), 3500)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  const close = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 120 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 120 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,380px)] bg-[#002E5F] border border-[#FDDB24]/40 rounded-2xl shadow-2xl shadow-black/50 p-4"
        role="dialog"
        aria-label="Get the Linkora app"
      >
        <button
          onClick={close}
          aria-label="Dismiss"
          className="absolute top-2 right-2 text-white/60 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FDDB24] to-[#D4A800] flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-[#002E5F]">L</span>
          </div>
          <div>
            <h4 className="text-white font-bold text-base mb-0.5">
              Get the Linkora app
            </h4>
            <p className="text-white/70 text-sm">
              {isAndroid
                ? 'Download the Android APK and take Linkora with you.'
                : 'The Android app is live. Continue on the web until iOS arrives.'}
            </p>
          </div>
        </div>

        <a
          href={isAndroid ? APK_URL : WEB_URL}
          onClick={close}
          className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[#002E5F] transition ${
            isAndroid
              ? 'bg-gradient-to-r from-[#FDDB24] to-[#FFC800] hover:from-[#FFC800] hover:to-[#FDDB24]'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          {isAndroid ? (
            <>
              <Download className="w-5 h-5" />
              Download for Android
            </>
          ) : (
            <>
              <Globe className="w-5 h-5" />
              Continue on the web
            </>
          )}
        </a>
      </motion.div>
    </AnimatePresence>
  )
}