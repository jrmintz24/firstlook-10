
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const GuideFinalCTA = () => {
  return (
    <div className="text-center py-24">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl overflow-hidden relative transform hover:scale-[1.02] transition-all duration-500">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        
        <CardContent className="p-16 md:p-20 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Sparkles className="w-7 h-7 text-purple-400 animate-pulse" />
            <span className="text-purple-300 font-semibold text-lg tracking-wide">Ready to Start?</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tight leading-tight">
            Your Home Buying Journey
            <span className="block text-purple-300 font-light">Starts Here</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-14 max-w-4xl mx-auto font-light leading-relaxed">
            Join thousands of smart buyers who've saved money and maintained control using FirstLook's modern approach to real estate.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-14">
            <Link to="/buyer-auth">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-14 py-5 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold tracking-wide transform hover:scale-105 hover:-translate-y-1">
                Get Started Free
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 px-14 py-5 text-lg rounded-2xl backdrop-blur-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1">
                Read More Articles
              </Button>
            </Link>
          </div>

          <div className="text-sm text-gray-400 font-medium space-x-6">
            <span className="inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              No commitment required
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Your first tour is free
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Cancel anytime
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
