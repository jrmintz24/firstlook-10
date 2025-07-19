
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const MobileStickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling past the hero section (approximately 800px)
      setIsVisible(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMobile || !isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-50">
      <Link to="/buyer-auth" className="block">
        <Button className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300">
          Get Started Free
          <ArrowRight className="ml-3 h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
};
