
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const GuideFinalCTA = () => {
  return (
    <div className="text-center py-20">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        
        <CardContent className="p-16 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-purple-300 font-medium">Ready to Start?</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight leading-tight">
            Your Home Buying Journey
            <span className="block text-purple-300">Starts Here</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Join thousands of smart buyers who've saved money and maintained control using FirstLook's modern approach to real estate.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link to="/buyer-auth">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-12 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 px-12 py-4 text-lg rounded-2xl backdrop-blur-sm font-medium transition-all duration-200">
                Read More Articles
              </Button>
            </Link>
          </div>

          <div className="text-sm text-gray-400 font-light">
            <span className="inline-flex items-center gap-2">
              <div className="w-1 h-1 bg-green-400 rounded-full" />
              No commitment required
            </span>
            <span className="mx-4">•</span>
            <span className="inline-flex items-center gap-2">
              <div className="w-1 h-1 bg-green-400 rounded-full" />
              Your first tour is free
            </span>
            <span className="mx-4">•</span>
            <span className="inline-flex items-center gap-2">
              <div className="w-1 h-1 bg-green-400 rounded-full" />
              Cancel anytime
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
