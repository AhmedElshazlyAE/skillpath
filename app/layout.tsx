import type { Metadata } from "next"
import { Sora } from "next/font/google"
import "./globals.css"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SkillPath \u2014 Find Your Tech Career Path",
  description:
    "Enter your skills and get a personalized AI-powered career roadmap in seconds. No login required.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={sora.variable}>
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  )
}
