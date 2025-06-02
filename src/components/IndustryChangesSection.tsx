
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
                  <p className="text-gray-600 text-lg">The site you browse isn't the one that gets you inside.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🚫</span>
                  <p className="text-gray-700">Browsing is easy—but to actually tour a home, you're forced to chase down agents.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🚫</span>
                  <p className="text-gray-700">Agents often pressure you to sign buyer agreements or commitments before you ever step inside.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🚫</span>
                  <p className="text-gray-700">You're left in the dark on who you'll meet, what it'll cost, or when you'll get access.</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-purple-800 font-medium">
                  With FirstLook, you control when and how you tour—no pressure, no surprise commitments, just homes on your terms.
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
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">The NAR Settlement Flipped the Script</h3>
                  <p className="text-gray-600 text-lg">New rules give buyers real power and real choices for the first time.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">✅</span>
                  <p className="text-gray-700">Agent fees are no longer automatic—you decide if, when, and how you work with a pro.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">✅</span>
                  <p className="text-gray-700">You deserve to know exactly what you're paying for before you ever commit.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">✅</span>
                  <p className="text-gray-700">You control how, when, and whether to involve an agent—full transparency, your choice every step of the way.</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-medium">
                  FirstLook is the only platform built for this new era—giving you full transparency and freedom to shop the way you want.
                </p>
              </div>
            </div>
          </div>

          {/* Solution Bridge */}
          <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">FirstLook: See Homes on Your Terms—No Surprises, No Pressure</h3>
            <p className="text-purple-100 text-lg mb-6 max-w-3xl mx-auto">
              We connect you directly with trusted, verified showing professionals. Tour homes when you want, keep your info private, and get total pricing transparency—no upfront commitments, ever.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm font-medium mb-6">
              <span className="bg-white/20 px-4 py-2 rounded-full">Browse Properties</span>
              <ArrowRight className="w-4 h-4" />
              <span className="bg-white/20 px-4 py-2 rounded-full">Request a Showing</span>
              <ArrowRight className="w-4 h-4" />
              <span className="bg-white/20 px-4 py-2 rounded-full">Tour On Your Schedule</span>
            </div>
            <p className="text-white font-medium">
              Ready to shop like a pro, without agent headaches? Get started free.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryChangesSection;
