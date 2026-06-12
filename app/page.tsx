"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { GeneratedRoadmap, RoleMatch } from "@/lib/types"
import JobInput from "@/components/tool/JobInput"
import RoadmapOutput from "@/components/tool/RoadmapOutput"
import RoleMatches from "@/components/tool/RoleMatches"
import SkillInput from "@/components/tool/SkillInput"

const VIBRANT_GRADIENT = "linear-gradient(135deg, #7C3AED, #a855f7)"
const GRADIENT_TEXT_STYLE = {
  background: VIBRANT_GRADIENT,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
}

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
    <main className="relative min-h-screen w-full bg-white overflow-x-hidden">
      <div
        className="fixed top-[-120px] left-[-120px] w-[350px] h-[350px] rounded-full blur-[90px] opacity-[0.12] pointer-events-none"
        style={{ background: "#a855f7" }}
      />
      <div
        className="fixed top-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.15] pointer-events-none"
        style={{ background: "#7C3AED" }}
      />
      <div
        className="fixed bottom-[-120px] left-[-120px] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.12] pointer-events-none"
        style={{ background: "#7C3AED" }}
      />
      <div
        className="fixed bottom-[-120px] right-[-120px] w-[350px] h-[350px] rounded-full blur-[90px] opacity-[0.10] pointer-events-none"
        style={{ background: "#a855f7" }}
      />

      <div
        ref={pageRef}
        className="relative z-10 mx-auto w-full max-w-3xl px-4 py-16 md:py-20"
        style={{ marginInline: "auto", maxWidth: "48rem", width: "100%" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <span
            className="gradient-text text-2xl font-black tracking-tight"
            style={GRADIENT_TEXT_STYLE}
          >
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
              className="text-center mb-14"
            >
              <h1 className="whitespace-normal md:whitespace-nowrap text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15]">
                <span className="block md:inline">Find Your Path</span>
                <span
                  className="block md:inline gradient-text"
                  style={GRADIENT_TEXT_STYLE}
                >
                  {" "}
                  in Tech
                </span>
              </h1>
              <p className="text-slate-500 text-lg md:text-xl mt-5 max-w-lg mx-auto">
                Enter your skills &mdash; we'll match you to roles and build you
                a free learning roadmap in seconds.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-500 mb-8 mt-6"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-xs">
                    {"\u2713"}
                  </span>
                  100+ Skills Tracked
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-xs">
                    {"\u2713"}
                  </span>
                  AI-Powered Matching
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-xs">
                    {"\u2713"}
                  </span>
                  100% Free, No Signup
                </div>
              </motion.div>
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
            className="mt-12 md:mt-14"
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
    <div className="mx-auto mb-2 max-w-lg">
      <div className="flex items-center justify-center">
        {labels.map((label, index) => {
          const stepNumber = (index + 1) as 1 | 2 | 3
          const isDone = currentStep > stepNumber
          const isActive = currentStep === stepNumber

          return (
            <div key={label} className="contents">
              <div
                style={isActive ? { background: VIBRANT_GRADIENT } : undefined}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm ${
                  isDone
                    ? "bg-emerald-500 text-white"
                    : isActive
                      ? "text-white font-bold shadow-lg shadow-violet-200"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {isDone ? "\u2713" : stepNumber}
              </div>
              {index < labels.length - 1 && (
                <div
                  className={`h-[1.5px] flex-1 mx-3 md:mx-4 rounded-full ${
                    currentStep > stepNumber ? "bg-emerald-400" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
        {labels.map((label) => (
          <span key={label} className="text-xs text-slate-500 whitespace-nowrap">
            {label}
          </span>
        ))}
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
    <div className="bg-white rounded-3xl border border-violet-100 shadow-lg shadow-violet-100/50 p-8">
      <h2 className="text-xl font-bold text-slate-900">
        What skills do you have?
      </h2>
      <p className="text-slate-500 text-sm mt-2 mb-6">
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
        style={{
          background: skills.length === 0 ? "#e2e8f0" : VIBRANT_GRADIENT,
        }}
        className={`w-full font-semibold rounded-xl py-3.5 text-sm mt-6 transition-all disabled:cursor-not-allowed ${
          skills.length === 0 ? "text-slate-400" : "text-white hover:opacity-90"
        }`}
      >
        {isAnalyzing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            Analyzing your skills...
          </span>
        ) : (
          "Analyze My Profile \u2192"
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
