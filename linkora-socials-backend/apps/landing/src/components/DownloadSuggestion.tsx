'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Globe, X } from 'lucide-react'

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || 'https://linkora-socials.vercel.app'
const APK_URL =
  process.env.NEXT_PUBLIC_APK_URL ||
  'https://expo.dev/accounts/devjaja/projects/linkora-socials/builds/3cfeba7e-a26c-495d-bbde-152c374d6800'

const DISMISS_KEY = 'linkora:landing:download:dismissed:2'

export default function DownloadSuggestion() {
  const [visible, setVisible] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent
    setIsAndroid(/android/i.test(ua))

    // Show once per session (reappears on the next visit).
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === '1') return
    } catch {
      /* ignore */
    }

    const timer = setTimeout(() => setVisible(true), 2200)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  const close = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, '1')
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
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,400px)] bg-[#002E5F] border border-[#FDDB24]/40 rounded-2xl shadow-2xl shadow-black/50 p-4"
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
<div className="w-11 h-11 flex-shrink-0">
          <Image
            src="/appicon.png"
            alt="Linkora logo"
            width={44}
            height={44}
            className="w-full h-full rounded-xl object-contain"
          />
        </div>
          <div>
            <h4 className="text-white font-bold text-base mb-0.5">
              Get the Linkora app
            </h4>
            <p className="text-white/70 text-sm">
              {isAndroid
                ? 'Download the Android APK and take Linkora with you.'
                : 'Open Linkora on the web — or grab the Android app.'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <a
            href={WEB_URL}
            target="_blank"
            rel="noreferrer"
            onClick={close}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[#002E5F] transition bg-white hover:bg-gray-100"
          >
            <Globe className="w-5 h-5" />
            Open the web app
          </a>
          <a
            href={APK_URL}
            target="_blank"
            rel="noreferrer"
            onClick={close}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[#002E5F] transition ${
              isAndroid
                ? 'bg-gradient-to-r from-[#FDDB24] to-[#FFC800] hover:from-[#FFC800] hover:to-[#FDDB24]'
                : 'bg-gradient-to-r from-[#FDDB24] to-[#D4A800] hover:from-[#FFC800] hover:to-[#FDDB24]'
            }`}
          >
            <Download className="w-5 h-5" />
            {isAndroid ? 'Download APK' : 'Download for Android'}
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}