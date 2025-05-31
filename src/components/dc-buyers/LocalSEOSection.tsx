
import { CheckCircle } from "lucide-react";

const LocalSEOSection = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Your Trusted Partner for DC Real Estate
          </h2>
          
          <div className="prose prose-xl mx-auto text-gray-700">
            <p className="text-xl leading-relaxed mb-8">
              Washington DC's real estate market is unique, complex, and moves at lightning speed. With median home prices reaching $650,000 and inventory changing daily, you need more than just access to listings - you need expert guidance and the flexibility to move quickly when the right property appears.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-12">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-6">DC Market Expertise</h3>
                <p className="mb-4">
                  Our showing partners don't just know real estate - they know DC. From understanding historic district regulations in Georgetown to navigating the competitive bidding wars in Capitol Hill, they provide insights you won't get from generic online platforms.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Metro accessibility analysis</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Neighborhood development trends</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />School district insights</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Local market pricing strategy</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-6">No Commitment Required</h3>
                <p className="mb-4">
                  Traditional real estate requires you to commit to an agent before seeing a single property. FirstLook flips this model - experience our service first, then decide if you want to work together long-term.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Free first showing guaranteed</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />No buyer representation agreements</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Transparent pricing always</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Work with multiple partners if needed</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-3xl font-semibold text-gray-900 mt-12 mb-6 text-center">
              Ready to Experience the Difference?
            </h3>
            <p className="text-center text-xl mb-8">
              Join hundreds of DC homebuyers who have discovered a better way to house hunt. Your dream home is waiting, and your first showing is completely free.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalSEOSection;
