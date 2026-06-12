"use client"

import { motion } from "framer-motion"
import type { RoleMatch } from "@/lib/types"

type RoleMatchesProps = {
  matches: RoleMatch[]
  onSelectRole: (role: string) => void
  isGenerating: boolean
  generatingRole: string | null
}

function getBadgeClass(matchPercent: number) {
  if (matchPercent >= 70) return "bg-emerald-100 text-emerald-700"
  if (matchPercent >= 40) return "bg-violet-100 text-violet-700"

  return "bg-slate-100 text-slate-500"
}

const VIBRANT_GRADIENT = "linear-gradient(135deg, #7C3AED, #a855f7)"

export default function RoleMatches({
  matches,
  onSelectRole,
  isGenerating,
  generatingRole,
}: RoleMatchesProps) {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900">
        You're a strong match for these roles
      </h2>
      <p className="text-slate-500 text-sm mt-1">
        Click any role to generate your free personalized roadmap
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {matches.map((match, index) => {
          const isCurrent = isGenerating && generatingRole === match.role

          return (
            <motion.div
              key={`${match.role}-${match.field}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              onClick={() => {
                if (!isGenerating) onSelectRole(match.role)
              }}
              className={`relative bg-white rounded-2xl border border-violet-100 p-4 hover:border-violet-400 hover:shadow-lg cursor-pointer transition-all duration-200 group ${
                isGenerating ? "pointer-events-none" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-slate-900 leading-snug">
                  {match.role}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${getBadgeClass(
                    match.matchPercent
                  )}`}
                >
                  {match.matchPercent}%
                </span>
              </div>

              <div className="w-full bg-violet-50 rounded-full h-1.5 mt-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: VIBRANT_GRADIENT }}
                  initial={{ width: 0 }}
                  animate={{ width: `${match.matchPercent}%` }}
                  transition={{
                    duration: 0.9,
                    delay: index * 0.08 + 0.2,
                    ease: "easeOut",
                  }}
                />
              </div>

              <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                {match.description}
              </p>

              {match.missingSkills.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-400">Need:</span>
                  {match.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-red-50 text-red-500 text-xs rounded-full px-2 py-0.5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-violet-600 text-xs font-semibold group-hover:text-violet-800 transition-colors mt-4">
                Generate Roadmap &rarr;
              </p>

              {isCurrent && (
                <div className="absolute inset-0 rounded-2xl bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-violet-600 text-sm font-semibold">
                  <span className="h-6 w-6 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
                  Building roadmap...
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
