
import { AlertTriangle, Scale, Home, ArrowRight } from "lucide-react";

const IndustryChangesSection = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              The Real Estate Industry Has Changed
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Recent industry shifts have created new challenges - but also new opportunities for homebuyers who know where to look.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Zillow Issues */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-red-200 shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Why Zillow Can't Show You Homes</h3>
                  <p className="text-gray-600 text-lg">The platform you browse on isn't the one that opens doors</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Zillow shows listings but requires you to contact separate agents for showings</p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Those agents often require buyer agreements before any home visits</p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">No transparency on who you'll work with or what it will cost</p>
                </div>
              </div>
            </div>

            {/* NAR Settlement */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-blue-200 shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">NAR Settlement Changes Everything</h3>
                  <p className="text-gray-600 text-lg">New rules mean buyers need more control and transparency</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Buyer agent compensation is no longer automatically included in listings</p>
                </div>
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">You deserve to know exactly what services cost before committing</p>
                </div>
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Buyers now have more power to choose how and when to work with agents</p>
                </div>
              </div>
            </div>
          </div>

          {/* Solution Bridge */}
          <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">FirstLook Bridges The Gap</h3>
            <p className="text-purple-100 text-lg mb-6 max-w-3xl mx-auto">
              We connect you directly with verified showing professionals who can tour homes on your schedule, 
              with complete pricing transparency and zero upfront commitments.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm font-medium">
              <span className="bg-white/20 px-4 py-2 rounded-full">Browse Properties</span>
              <ArrowRight className="w-4 h-4" />
              <span className="bg-white/20 px-4 py-2 rounded-full">Request Showing</span>
              <ArrowRight className="w-4 h-4" />
              <span className="bg-white/20 px-4 py-2 rounded-full">Tour With Professional</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryChangesSection;
