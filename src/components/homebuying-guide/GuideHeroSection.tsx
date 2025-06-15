
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";

export const GuideHeroSection = () => {
  return (
    <div className="pt-32 pb-20 bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] opacity-40" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      
      <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-purple-200 rounded-full px-5 py-3 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-gray-800 tracking-wide">Free Guide • No Email Required</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extralight text-gray-900 mb-8 tracking-tight leading-[0.9] animate-fade-in-up">
          Buy Your Home
          <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-light">
            Without an Agent
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          Save thousands in commission fees while maintaining complete control over your homebuying journey. 
          This comprehensive guide shows you exactly how to navigate every step of the process with confidence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <Link to="/buyer-auth">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-5 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold tracking-wide transform hover:scale-105 hover:-translate-y-1">
              Start Your Home Search
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="px-12 py-5 text-lg border-2 border-gray-300 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold backdrop-blur-sm bg-white/90 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1">
            <Download className="mr-3 h-5 w-5" />
            Download PDF Guide
          </Button>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group">
            <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">$15,000+</div>
            <div className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">Average savings vs traditional agent</div>
          </div>
          <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group">
            <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">8 Steps</div>
            <div className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">Complete process covered</div>
          </div>
          <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group">
            <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">100%</div>
            <div className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">Control over your purchase</div>
          </div>
        </div>
      </div>
    </div>
  );
};
