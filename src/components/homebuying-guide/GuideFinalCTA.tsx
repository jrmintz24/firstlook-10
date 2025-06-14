
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const GuideFinalCTA = () => {
  return (
    <div className="text-center py-16">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl">
        <CardContent className="p-12">
          <h2 className="text-3xl font-light mb-4">Ready to Start Your Home Buying Journey?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of smart buyers who've saved money and maintained control using FirstLook's modern approach to real estate.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/buyer-auth">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg">
                Read More Articles
              </Button>
            </Link>
          </div>

          <div className="text-sm text-gray-400">
            No commitment required • Your first tour is free • Cancel anytime
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
