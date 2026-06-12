"use client"

import { useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SKILLS_LIST } from "@/lib/skills"

type SkillInputProps = {
  skills: string[]
  onChange: (skills: string[]) => void
}

const MAX_SKILLS = 20

export default function SkillInput({ skills, onChange }: SkillInputProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isFull = skills.length >= MAX_SKILLS

  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase()

    if (!trimmed || isFull) return []

    return SKILLS_LIST.filter((skill) => {
      const isSelected = skills.some(
        (selectedSkill) => selectedSkill.toLowerCase() === skill.toLowerCase()
      )

      return !isSelected && skill.toLowerCase().includes(trimmed)
    }).slice(0, 8)
  }, [isFull, query, skills])

  function addSkill(skill: string) {
    const trimmed = skill.trim()

    if (!trimmed || skills.length >= MAX_SKILLS) return

    const exists = skills.some(
      (selectedSkill) => selectedSkill.toLowerCase() === trimmed.toLowerCase()
    )

    if (exists) {
      setQuery("")
      setIsOpen(false)
      return
    }

    onChange([...skills, trimmed])
    setQuery("")
    setIsOpen(false)
  }

  function removeSkill(skill: string) {
    onChange(skills.filter((selectedSkill) => selectedSkill !== skill))
  }

  function addCustomSkills(value: string) {
    const parts = value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)

    if (parts.length === 0) return

    let nextSkills = [...skills]

    for (const part of parts) {
      if (nextSkills.length >= MAX_SKILLS) break

      const exists = nextSkills.some(
        (selectedSkill) => selectedSkill.toLowerCase() === part.toLowerCase()
      )

      if (!exists) nextSkills = [...nextSkills, part]
    }

    onChange(nextSkills)
    setQuery("")
    setIsOpen(false)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false)
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()

      if (suggestions.length > 0) {
        addSkill(suggestions[0])
      } else {
        addCustomSkills(query)
      }
    }

    if (event.key === ",") {
      event.preventDefault()
      addCustomSkills(query)
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value

    if (value.includes(",")) {
      addCustomSkills(value)
      return
    }

    setQuery(value)
    setIsOpen(value.trim().length > 0)
  }

  return (
    <div className="relative">
      <div
        onClick={() => inputRef.current?.focus()}
        className={`rounded-2xl border border-violet-200 p-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100 transition-all duration-200 flex flex-wrap gap-2 items-center cursor-text ${
          isFull ? "bg-slate-50 opacity-70 cursor-not-allowed" : "bg-white"
        }`}
      >
        <AnimatePresence>
          {skills.map((skill) => (
            <motion.span
              key={skill}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="bg-violet-100 text-violet-700 rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1"
            >
              {skill}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  removeSkill(skill)
                }}
                className="hover:text-violet-900 leading-none"
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        <input
          ref={inputRef}
          value={query}
          disabled={isFull}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(query.trim().length > 0)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length === 0 ? "Type a skill and press Enter..." : ""}
          className="border-none outline-none bg-transparent flex-1 min-w-[160px] text-sm placeholder:text-slate-400 disabled:cursor-not-allowed"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-violet-100 bg-white shadow-xl overflow-hidden">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault()
                addSkill(suggestion)
              }}
              className="block w-full px-4 py-2 hover:bg-violet-50 cursor-pointer text-sm text-left"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400 mt-1">
        Press Enter or comma to add · Search from 100+ skills · Max 20
      </p>
    </div>
  )
}
