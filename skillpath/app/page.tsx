"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { GeneratedRoadmap, RoleMatch } from "@/lib/types"
import JobInput from "@/components/tool/JobInput"
import RoadmapOutput from "@/components/tool/RoadmapOutput"
import RoleMatches from "@/components/tool/RoleMatches"
import SkillInput from "@/components/tool/SkillInput"

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [skills, setSkills] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [roleMatches, setRoleMatches] = useState<RoleMatch[] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [roadmap, setRoadmap] = useState<GeneratedRoadmap | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [jobText, setJobText] = useState("")
  const pageRef = useRef<HTMLDivElement | null>(null)

  async function handleAnalyze() {
    setError(null)
    setIsAnalyzing(true)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      })
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      setRoleMatches(data.matches)
      setStep(2)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function handleSelectRole(role: string) {
    setError(null)
    setIsGenerating(true)

    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, targetRole: role }),
      })
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      setRoadmap(data)
      setStep(3)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleJobSubmit() {
    setError(null)
    setIsGenerating(true)

    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, jobDescription: jobText }),
      })
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      setRoadmap(data)
      setStep(3)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setIsGenerating(false)
    }
  }

  function handleStartOver() {
    setStep(1)
    setSkills([])
    setRoleMatches(null)
    setRoadmap(null)
    setJobText("")
    setError(null)
  }

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      <div className="fixed inset-x-0 top-0 h-56 bg-gradient-to-b from-violet-50/80 to-transparent pointer-events-none" />
      <div className="fixed inset-x-0 bottom-0 h-48 bg-gradient-to-t from-purple-50/60 to-transparent pointer-events-none" />

      <div ref={pageRef} className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <span className="gradient-text text-2xl font-black tracking-tight">
            SkillPath
          </span>
          <p className="text-slate-400 text-xs mt-1 font-medium uppercase tracking-widest">
            AI Career Path Generator
          </p>
        </motion.div>

        <AnimatePresence>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center mb-10"
            >
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Find Your Path
                <span className="gradient-text"> in Tech</span>
              </h1>
              <p className="text-slate-500 text-lg mt-3 max-w-md mx-auto">
                Enter your skills &mdash; we'll match you to roles and build you
                a free learning roadmap in seconds.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <StepIndicator currentStep={step} />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex justify-between items-center"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 ml-2"
            >
              &times;
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {step === 1 && (
              <Step1
                skills={skills}
                onSkillsChange={setSkills}
                isAnalyzing={isAnalyzing}
                onAnalyze={handleAnalyze}
              />
            )}
            {step === 2 && (
              <Step2
                roleMatches={roleMatches!}
                isGenerating={isGenerating}
                jobText={jobText}
                onJobTextChange={setJobText}
                onSelectRole={handleSelectRole}
                onJobSubmit={handleJobSubmit}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step3
                roadmap={roadmap!}
                onStartOver={handleStartOver}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-slate-400 text-xs mt-16 pb-8">
          Powered by Google Gemini &middot; Free forever &middot; No login required
        </p>
      </div>
    </main>
  )
}

function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const labels = ["Your Skills", "Choose Path", "Roadmap"]

  return (
    <div className="mx-auto max-w-sm">
      <div className="flex items-center justify-center">
        {labels.map((label, index) => {
          const stepNumber = (index + 1) as 1 | 2 | 3
          const isDone = currentStep > stepNumber
          const isActive = currentStep === stepNumber

          return (
            <div key={label} className="contents">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                    isDone
                      ? "bg-emerald-500 text-white"
                      : isActive
                        ? "gradient-bg text-white font-bold"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isDone ? "✓" : stepNumber}
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {label}
                </span>
              </div>
              {index < labels.length - 1 && (
                <div
                  className={`h-px flex-1 mx-2 self-start mt-4 ${
                    currentStep > stepNumber ? "bg-emerald-400" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

type Step1Props = {
  skills: string[]
  onSkillsChange: (skills: string[]) => void
  isAnalyzing: boolean
  onAnalyze: () => void
}

function Step1({ skills, onSkillsChange, isAnalyzing, onAnalyze }: Step1Props) {
  return (
    <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-6 mt-6">
      <h2 className="text-xl font-bold text-slate-900">
        What skills do you have?
      </h2>
      <p className="text-slate-500 text-sm mt-1 mb-4">
        Add skills from the list or type your own.
      </p>

      <SkillInput skills={skills} onChange={onSkillsChange} />

      {skills.length > 0 && (
        <p className="text-violet-600 text-sm font-medium mt-2">
          {skills.length} skill{skills.length === 1 ? "" : "s"} added
        </p>
      )}

      <button
        type="button"
        onClick={onAnalyze}
        disabled={skills.length === 0 || isAnalyzing}
        className="w-full gradient-bg text-white font-semibold rounded-xl py-3.5 text-sm mt-6 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            Analyzing your skills...
          </span>
        ) : (
          "Analyze My Profile →"
        )}
      </button>

      {isAnalyzing && (
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item * 0.12 }}
              className="shimmer-card h-24 rounded-2xl"
            />
          ))}
        </div>
      )}
    </div>
  )
}

type Step2Props = {
  roleMatches: RoleMatch[]
  isGenerating: boolean
  jobText: string
  onJobTextChange: (value: string) => void
  onSelectRole: (role: string) => Promise<void>
  onJobSubmit: () => void | Promise<void>
  onBack: () => void
}

function Step2({
  roleMatches,
  isGenerating,
  jobText,
  onJobTextChange,
  onSelectRole,
  onJobSubmit,
  onBack,
}: Step2Props) {
  const [generatingRole, setGeneratingRole] = useState<string | null>(null)

  async function handleRoleClick(role: string) {
    setGeneratingRole(role)
    await onSelectRole(role)
    setGeneratingRole(null)
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={onBack}
        className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-1 mb-4 transition-colors"
      >
        &larr; Back
      </button>
      <RoleMatches
        matches={roleMatches}
        onSelectRole={handleRoleClick}
        isGenerating={isGenerating}
        generatingRole={generatingRole}
      />
      {isGenerating ? (
        <RoadmapSkeleton />
      ) : (
        <JobInput
          value={jobText}
          onChange={onJobTextChange}
          onSubmit={onJobSubmit}
          isLoading={isGenerating}
        />
      )}
    </div>
  )
}

function RoadmapSkeleton() {
  return (
    <div className="mt-6 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="shimmer-card h-8 w-48 rounded-full" />
        <div className="shimmer-card h-8 w-24 rounded-full" />
      </div>
      <div className="mt-6 space-y-3">
        {[0, 1, 2, 3, 4].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item * 0.08 }}
            className="shimmer-card h-16 rounded-2xl"
          />
        ))}
      </div>
    </div>
  )
}

type Step3Props = {
  roadmap: GeneratedRoadmap
  onStartOver: () => void
}

function Step3({ roadmap, onStartOver }: Step3Props) {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={onStartOver}
          className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-1 transition-colors"
        >
          &larr; Start Over
        </button>
      </div>
      <RoadmapOutput roadmap={roadmap} />
    </div>
  )
}
