
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";

export const GuideHeroSection = () => {
  return (
    <div className="pt-32 pb-20 bg-white relative overflow-hidden">
      {/* Background decoration - subtle and minimal */}
      <div className="absolute inset-0 bg-gray-50/30" />
      
      <div className="container mx-auto px-6 sm:px-8 max-w-5xl text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-8 shadow-sm">
          <div className="w-2 h-2 bg-gray-900 rounded-full" />
          <span className="text-sm font-medium text-gray-700">Free Guide • No Email Required</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extralight text-gray-900 mb-6 tracking-tight leading-none">
          Buy Your Home
        </h1>
        
        <h2 className="text-4xl md:text-6xl font-extralight text-gray-900 mb-8 tracking-tight leading-tight">
          Without an Agent
        </h2>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
          Save thousands in commission fees while maintaining complete control over your homebuying journey. 
          This comprehensive guide shows you exactly how to navigate every step of the process with confidence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/buyer-auth">
            <Button size="lg" className="bg-gray-900 hover:bg-black text-white px-10 py-5 text-base font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl min-w-[280px] h-[56px]">
              Start Your Home Search
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="px-10 py-5 text-base border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-300 font-medium rounded-xl shadow-sm hover:shadow-md min-w-[280px] h-[56px]">
            <Download className="mr-3 h-5 w-5" />
            Download PDF Guide
          </Button>
        </div>

        {/* Stats Grid - cleaner, minimal design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="text-4xl md:text-5xl font-light text-gray-900 mb-2">$15,000+</div>
            <div className="text-sm md:text-base text-gray-600 font-light">Average savings vs traditional agent</div>
          </div>
          <div className="text-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="text-4xl md:text-5xl font-light text-gray-900 mb-2">9 Steps</div>
            <div className="text-sm md:text-base text-gray-600 font-light">Complete process covered</div>
          </div>
          <div className="text-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="text-4xl md:text-5xl font-light text-gray-900 mb-2">100%</div>
            <div className="text-sm md:text-base text-gray-600 font-light">Control over your purchase</div>
          </div>
        </div>
      </div>
    </div>
  );
};
