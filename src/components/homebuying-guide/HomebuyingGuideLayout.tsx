
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { GuideTableOfContents } from "./GuideTableOfContents";
import { GuideHeroSection } from "./GuideHeroSection";
import { GuideFinalCTA } from "./GuideFinalCTA";
import { GuideSection } from "./GuideSection";
import { MobileStickyCTA } from "./MobileStickyCTA";
import { DownloadGuideButton } from "./DownloadGuideButton";
import { guideSections } from "./guideSections";
import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking";

export const HomebuyingGuideLayout = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [progress, setProgress] = useState(0);

  // Track scroll depth and engagement
  const sectionIds = guideSections.map(section => section.id);
  useScrollDepthTracking(sectionIds);

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
      {/* Integrated Progress Bar - positioned below navigation */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-medium text-gray-900">No Agent Buyer Guide</h2>
              <DownloadGuideButton />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
              <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">{activeSection + 1}</span>
              </div>
            </div>
          </div>
          <Progress 
            value={progress} 
            className="h-1.5 bg-gray-100"
          />
        </div>
      </div>

      <GuideHeroSection />
      
      <div className="container mx-auto px-4 max-w-7xl">
        <GuideTableOfContents 
          sections={guideSections}
          activeSection={activeSection}
          onSectionClick={scrollToSection}
        />

        {/* Guide Content */}
        <div className="max-w-5xl mx-auto">
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

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA />
    </div>
  );
};
