import { useEffect, useState, useRef, useCallback, useMemo } from "react"

interface ScrollSection {
  id: string
  ref: React.RefObject<HTMLElement | null>
}

export function useScrollNavigation() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Create refs at the top level
  const heroRef = useRef<HTMLElement>(null)
  const robotRef = useRef<HTMLElement>(null)
  const learningPathsRef = useRef<HTMLElement>(null)
  const curriculumRef = useRef<HTMLElement>(null)
  const ageGroupsRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const achievementsRef = useRef<HTMLElement>(null)
  const testimonialsRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  const sections: ScrollSection[] = useMemo(() => [
    { id: "hero", ref: heroRef },
    { id: "robot", ref: robotRef },
    { id: "learning-paths", ref: learningPathsRef },
    { id: "curriculum", ref: curriculumRef },
    { id: "age-groups", ref: ageGroupsRef },
    { id: "features", ref: featuresRef },
    { id: "achievements", ref: achievementsRef },
    { id: "testimonials", ref: testimonialsRef },
    { id: "about", ref: aboutRef },
    { id: "contact", ref: contactRef },
  ], []) // Refs are stable, no dependencies needed

  const scrollToSection = useCallback((sectionIndex: number) => {
    if (sectionIndex >= 0 && sectionIndex < sections.length) {
      setCurrentSection(sectionIndex)
      const targetSection = sections[sectionIndex].ref.current
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  }, [sections])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault()
        const nextSection = Math.min(sections.length - 1, currentSection + 1)
        if (nextSection !== currentSection) {
          scrollToSection(nextSection)
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault()
        const prevSection = Math.max(0, currentSection - 1)
        if (prevSection !== currentSection) {
          scrollToSection(prevSection)
        }
      }
    }

    const handleVisibility = () => setIsVisible(true)

    window.addEventListener("keydown", handleKeyDown)
    setTimeout(handleVisibility, 100)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentSection, scrollToSection, sections.length])

  return {
    currentSection,
    sections,
    isVisible,
    scrollToSection,
  }
}
