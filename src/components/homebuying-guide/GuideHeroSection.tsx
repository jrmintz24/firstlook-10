
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";

export const GuideHeroSection = () => {
  return (
    <div className="pt-32 pb-20 bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] opacity-40" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-2 mb-8">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-700">Free Guide • No Email Required</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-tight">
          Buy Your Home
          <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Without an Agent
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Save thousands in commission fees while maintaining complete control over your homebuying journey. 
          This comprehensive guide shows you exactly how to navigate every step of the process with confidence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/buyer-auth">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
              Start Your Home Search
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="px-10 py-4 text-lg border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium backdrop-blur-sm bg-white/80">
            <Download className="mr-2 h-5 w-5" />
            Download PDF Guide
          </Button>
        </div>

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">$15,000+</div>
            <div className="text-sm text-gray-600 font-medium">Average savings vs traditional agent</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">8 Steps</div>
            <div className="text-sm text-gray-600 font-medium">Complete process covered</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">100%</div>
            <div className="text-sm text-gray-600 font-medium">Control over your purchase</div>
          </div>
        </div>
      </div>
    </div>
  );
};
