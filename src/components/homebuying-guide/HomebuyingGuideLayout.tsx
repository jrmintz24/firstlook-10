
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { GuideTableOfContents } from "./GuideTableOfContents";
import { GuideHeroSection } from "./GuideHeroSection";
import { GuideFinalCTA } from "./GuideFinalCTA";
import { GuideSection } from "./GuideSection";
import { guideSections } from "./guideSections";

export const HomebuyingGuideLayout = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section, index) => {
        const element = section as HTMLElement;
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(index);
          setProgress(((index + 1) / sections.length) * 100);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const element = document.querySelector(`[data-section="${guideSections[index].id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Progress Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-900">Complete Guide to Buying a Home Without an Agent</h2>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <GuideHeroSection />
      
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <GuideTableOfContents 
          sections={guideSections}
          activeSection={activeSection}
          onSectionClick={scrollToSection}
        />

        {/* Guide Content */}
        <div className="max-w-4xl mx-auto">
          {guideSections.map((section, index) => (
            <GuideSection 
              key={section.id}
              section={section}
              index={index}
            />
          ))}
        </div>

        <GuideFinalCTA />
      </div>
    </div>
  );
};
