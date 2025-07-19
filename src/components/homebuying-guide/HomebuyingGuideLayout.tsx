
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
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
        <div className="container mx-auto px-6 sm:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 md:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <h2 className="text-sm md:text-base font-medium text-gray-900">Complete Homebuying Guide</h2>
              </div>
              <div className="hidden sm:block">
                <DownloadGuideButton />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm md:text-base text-gray-600 font-medium">{Math.round(progress)}% Complete</span>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm md:text-base font-medium">{activeSection + 1}</span>
              </div>
            </div>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-gray-100 rounded-full overflow-hidden"
          />
        </div>
      </div>

      <GuideHeroSection />
      
      <GuideTableOfContents 
        sections={guideSections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      <div className="bg-gray-50">
        <div className="container mx-auto px-6 sm:px-8 max-w-5xl py-16">
          {guideSections.map((section, index) => (
            <GuideSection 
              key={section.id}
              section={section}
              index={index}
            />
          ))}
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
          <GuideFinalCTA />
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA />
    </div>
  );
};
