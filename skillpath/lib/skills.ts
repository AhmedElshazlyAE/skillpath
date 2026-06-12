export const SKILLS_LIST: string[] = [
  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust",
  "C++", "C#", "PHP", "Ruby", "Swift", "Kotlin", "Dart", "Scala", "R",
  // Frontend
  "React", "Vue.js", "Angular", "Next.js", "Nuxt.js", "Svelte",
  "HTML", "CSS", "Tailwind CSS", "SASS", "Redux", "Zustand",
  // Backend
  "Node.js", "Express", "NestJS", "Django", "FastAPI", "Flask",
  "Spring Boot", "Laravel", "Ruby on Rails", ".NET", "GraphQL",
  // Databases
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite",
  "Firebase", "Supabase", "Prisma", "SQL",
  // DevOps & Cloud
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Linux",
  "Bash", "Terraform", "Ansible", "CI/CD", "Git", "GitHub Actions",
  // Data & AI
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
  "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Jupyter",
  "Data Analysis", "Data Engineering", "Apache Spark", "Kafka",
  "Power BI", "Tableau", "Hugging Face", "LangChain",
  // Mobile
  "Flutter", "React Native", "Android", "iOS",
  "SwiftUI", "Jetpack Compose",
  // Design
  "Figma", "Adobe XD", "Prototyping", "UX Research", "Wireframing",
  "Design Systems", "Accessibility",
  // Security
  "Cybersecurity", "Penetration Testing", "Networking",
  "Linux Security", "SIEM", "Cloud Security", "OWASP",
  // Other
  "REST API", "WebSockets", "gRPC", "Agile", "Scrum",
  "Technical Writing", "Product Management", "System Design",
]

export function extractSkills(text: string): string[] {
  const lower = text.toLowerCase()
  return SKILLS_LIST.filter(skill =>
    lower.includes(skill.toLowerCase())
  )
}
