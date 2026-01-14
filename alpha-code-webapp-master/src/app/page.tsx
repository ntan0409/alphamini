"use client"
import { useRef } from "react"
import { useScrollNavigation } from "@/hooks/use-scroll-navigation"
import { Header } from "@/components/home/header"
import { HeroSection } from "@/components/home/hero-section"
import { RobotSection } from "@/components/home/robot-section"
import { LearningPathsSection } from "@/components/home/learning-paths-section"
import { CurriculumSection } from "@/components/home/curriculum-section"
import { AgeGroupsSection } from "@/components/home/age-groups-section"
import { FeaturesSection } from "@/components/home/features-section"
import { AchievementsSection } from "@/components/home/achievements-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { AboutSection } from "@/components/home/about-section"
import { Footer } from "@/components/home/footer"


export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { currentSection, sections, isVisible, scrollToSection } = useScrollNavigation()

  return (
    <div ref={containerRef} className="min-h-screen bg-white overflow-x-hidden relative scroll-auto">
      <Header currentSection={currentSection} onNavigate={scrollToSection} />
      
      <HeroSection 
        ref={sections[0].ref} 
        currentSection={currentSection} 
        isVisible={isVisible} 
      />
      
      <RobotSection 
        ref={sections[1].ref} 
        currentSection={currentSection} 
      />

      <LearningPathsSection 
        ref={sections[2].ref} 
        currentSection={currentSection} 
      />
      
      <CurriculumSection 
        ref={sections[3].ref} 
        currentSection={currentSection} 
      />

      <AgeGroupsSection 
        ref={sections[4].ref} 
        currentSection={currentSection} 
      />
      
      <FeaturesSection 
        ref={sections[5].ref} 
        currentSection={currentSection} 
      />

      <AchievementsSection 
        ref={sections[6].ref} 
        currentSection={currentSection} 
      />

      <TestimonialsSection 
        ref={sections[7].ref} 
        currentSection={currentSection} 
      />
      
      <AboutSection 
        ref={sections[8].ref} 
        currentSection={currentSection} 
      />
      
      <Footer 
        ref={sections[9].ref} 
        currentSection={currentSection} 
      />
    </div>
  )
}
