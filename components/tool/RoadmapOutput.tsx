"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Hammer,
} from "lucide-react"
import type { GeneratedRoadmap, RoadmapStep } from "@/lib/types"

type RoadmapOutputProps = {
  roadmap: GeneratedRoadmap
}

const typeStyles: Record<RoadmapStep["type"], string> = {
  course: "bg-blue-50 text-blue-600",
  certificate: "bg-emerald-50 text-emerald-600",
  book: "bg-purple-50 text-purple-600",
  project: "bg-orange-50 text-orange-600",
  concept: "bg-slate-100 text-slate-600",
}

export default function RoadmapOutput({ roadmap }: RoadmapOutputProps) {
  const [copied, setCopied] = useState(false)
  const [openStep, setOpenStep] = useState<string | null>(
    roadmap.steps[0]?.id ?? null
  )
  const months = Math.ceil(roadmap.totalDurationWeeks / 4)

  function buildMarkdown(): string {
    return [
      `# ${roadmap.targetRole} \u2014 Learning Roadmap`,
      `**Duration:** ~${months} months (${roadmap.totalDurationWeeks} weeks)`,
      `**Skill Gaps:** ${roadmap.skillGaps.join(", ")}`,
      ``,
      `## Learning Steps`,
      ...roadmap.steps.map((s, i) =>
        [
          `### ${i + 1}. ${s.title}`,
          `**Type:** ${s.type} \u00b7 **Duration:** ${s.durationWeeks} weeks`,
          s.description,
          `**Skills:** ${s.skills.join(", ")}`,
          `**Resources:**`,
          ...s.resources.map(
            (r) => `- [${r.name}](${r.url}) \u2014 ${r.platform}`
          ),
          ``,
        ].join("\n")
      ),
      `## Recommended Certifications`,
      ...roadmap.topCertificates.map(
        (c) => `- [${c.name}](${c.url}) \u2014 ${c.provider}`
      ),
      ``,
      `## Projects to Build`,
      ...roadmap.suggestedProjects.map((p) => `- ${p}`),
    ].join("\n")
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildMarkdown())
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-0 top-0 border border-violet-200 text-violet-600 rounded-xl px-4 py-2 text-sm font-medium hover:bg-violet-50 transition-colors flex items-center gap-2"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy Roadmap
          </>
        )}
      </button>

      <header className="pr-44">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="gradient-text text-2xl font-black">
            {roadmap.targetRole}
          </h2>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
            ~{months} months
          </span>
        </div>

        {roadmap.skillGaps.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-slate-500 text-sm">Gaps to fill:</span>
            {roadmap.skillGaps.map((gap) => (
              <span
                key={gap}
                className="bg-red-50 text-red-500 rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                {gap}
              </span>
            ))}
          </div>
        )}

        <div className="text-sm text-slate-500 flex flex-wrap gap-4 mt-3">
          <span>&#128203; {roadmap.steps.length} Steps</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span>&#9201; ~{months} Months</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span>&#10003; All Free Resources</span>
        </div>
      </header>

      <div className="mt-8">
        {roadmap.steps.map((step, index) => {
          const isOpen = openStep === step.id
          const typeClass = typeStyles[step.type] ?? typeStyles.concept

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
              className="flex gap-4 relative"
            >
              <div className="relative flex flex-col items-center">
                <div className="w-8 h-8 rounded-full gradient-bg text-white font-bold text-sm flex items-center justify-center flex-shrink-0 z-10">
                  {index + 1}
                </div>
                {index < roadmap.steps.length - 1 && (
                  <div className="absolute left-4 top-8 w-px h-full border-l-2 border-dashed border-violet-200" />
                )}
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => setOpenStep(isOpen ? null : step.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setOpenStep(isOpen ? null : step.id)
                  }
                }}
                className="flex-1 text-left bg-white rounded-2xl border border-violet-100 p-4 mb-4 hover:border-violet-300 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${typeClass}`}
                      >
                        {step.type}
                      </span>
                      <span className="bg-slate-100 text-slate-500 text-xs rounded-full px-2.5 py-0.5 font-medium">
                        {step.durationWeeks} weeks
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mt-1">
                      {step.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                    {step.description}
                  </p>

                  {step.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {step.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {step.resources.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {step.resources.map((resource) => (
                        <a
                          key={`${resource.name}-${resource.url}`}
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="flex flex-wrap items-center gap-2 text-sm text-slate-700 hover:text-violet-700"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-violet-500" />
                          <span className="font-medium">{resource.name}</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                            {resource.platform}
                          </span>
                          {resource.free && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                              Free
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {roadmap.topCertificates.length > 0 && (
        <section>
          <h3 className="font-bold text-slate-900 mt-8 mb-3">
            Top Certifications
          </h3>
          <div className="flex gap-3 flex-wrap">
            {roadmap.topCertificates.map((cert) => (
              <a
                key={`${cert.name}-${cert.url}`}
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-violet-100 px-4 py-3 hover:border-violet-300 transition-colors"
              >
                <p className="font-medium text-sm text-slate-900">{cert.name}</p>
                <p className="text-slate-400 text-xs">{cert.provider}</p>
                <p className="text-xs mt-2 text-violet-600">
                  View &rarr;
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {roadmap.suggestedProjects.length > 0 && (
        <section>
          <h3 className="font-bold text-slate-900 mt-6 mb-3">
            Projects to Build
          </h3>
          <div>
            {roadmap.suggestedProjects.map((project, index) => (
              <div
                key={`${project}-${index}`}
                className="bg-violet-50 rounded-xl px-4 py-3 text-sm text-slate-700 mb-2 flex items-start gap-3"
              >
                <Hammer className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                <span>
                  <span className="font-semibold text-violet-700">
                    {index + 1}.
                  </span>{" "}
                  {project}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}
