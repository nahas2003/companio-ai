import * as React from 'react'
import Link from 'next/link'
import { HelpCircle, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden text-white">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative z-10 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
          <HelpCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
          <h2 className="text-xl font-semibold text-slate-200">Page Not Found</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            The page you are looking for does not exist, has been removed, or is temporarily
            unavailable.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition duration-300 font-semibold text-sm border border-slate-700 w-full"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Safety
          </Link>
        </div>
      </div>
    </div>
  )
}
