
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
            {/* Zillow Issues - Updated Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-red-200 shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Why Zillow Leaves You at the Door</h3>
                  <p className="text-gray-600 text-lg">The site you browse on isn't the one that gets you inside.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🚪</span>
                  <p className="text-gray-700">Zillow stops at the listing—you're left chasing agents just to see a home.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🚫</span>
                  <p className="text-gray-700">Agents may demand commitments or paperwork before you can even tour.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">❓</span>
                  <p className="text-gray-700">You never know who you'll meet, what it will cost, or when you'll get in.</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-purple-800 font-medium">
                  FirstLook gives you instant, on-demand access to the homes you want—no agent commitments, no pressure, no surprises.
                </p>
              </div>
            </div>

            {/* NAR Settlement - Updated Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-blue-200 shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">The NAR Settlement Puts Buyers in the Driver's Seat</h3>
                  <p className="text-gray-600 text-lg">New rules just flipped the script—now you get more control, more options, and total transparency.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 font-medium">No more hidden agent fees:</p>
                    <p className="text-gray-700">Buyer agent compensation isn't baked into listings anymore—you get to decide if, when, and how you want help.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 font-medium">Clarity before you commit:</p>
                    <p className="text-gray-700">Know exactly what you're paying for—and what you're not—before you ever sign anything.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 font-medium">Real power of choice:</p>
                    <p className="text-gray-700">Pick the services you need, skip the ones you don't, and decide when and how you want to work with an agent—if at all.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-medium">
                  FirstLook was built for this new era. You're in control, every step of the way.
                </p>
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
