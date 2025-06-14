
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";

export const GuideHeroSection = () => {
  return (
    <div className="pt-20 pb-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
          The Complete Guide to Buying a Home Without an Agent
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
          Save thousands in commission fees while maintaining complete control over your homebuying journey. 
          This comprehensive guide shows you exactly how to navigate every step of the process.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/buyer-auth">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-xl">
              Start Your Home Search
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 border-gray-200 rounded-xl">
            <Download className="mr-2 h-5 w-5" />
            Download Guide
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">$15,000+</div>
            <div className="text-sm text-gray-600">Average savings on a $500k home</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">8 Steps</div>
            <div className="text-sm text-gray-600">Complete process covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">100%</div>
            <div className="text-sm text-gray-600">Control over your purchase</div>
          </div>
        </div>
      </div>
    </div>
  );
};
