
import { AlertTriangle, Scale, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IndustryChangesSectionProps {
  onRequestShowing?: () => void;
}

const IndustryChangesSection = ({ onRequestShowing }: IndustryChangesSectionProps) => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              The Real Estate Industry Has Changed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Recent industry shifts have created new challenges - but also new opportunities for homebuyers who know where to look.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Zillow Issues - Updated Section */}
            <div className="bg-gray-50 rounded-3xl p-8 border-0 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">Why Zillow Leaves You at the Door</h3>
                  <p className="text-gray-600 text-lg font-light">You browse online, but touring means agent games, pressure, and zero clarity.</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🚫</span>
                  <p className="text-gray-700 font-light">You have to chase down agents just to get a tour.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🚫</span>
                  <p className="text-gray-700 font-light">You're pushed to sign agreements before you even see a home.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🚫</span>
                  <p className="text-gray-700 font-light">You never know who will show up, what it'll cost, or what the next step is.</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">With FirstLook, you skip the chase:</h4>
                <p className="text-gray-700 font-light mb-2">Tour homes on your terms, instantly.</p>
                <p className="text-gray-700 font-light">No surprise commitments, no pressure—just the freedom to see what you want, when you want.</p>
              </div>
            </div>

            {/* NAR Settlement - Updated Section */}
            <div className="bg-gray-50 rounded-3xl p-8 border-0 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">The NAR Settlement Flipped the Script</h3>
                  <p className="text-gray-600 text-lg font-light">For the first time, buyers control every part of the process.</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">✅</span>
                  <p className="text-gray-700 font-light">Agent fees are never automatic—you decide if, when, and how to work with a pro.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">✅</span>
                  <p className="text-gray-700 font-light">You see exactly what you pay, with no hidden surprises.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">✅</span>
                  <p className="text-gray-700 font-light">You control how, when, and whether an agent is involved—full transparency, every step of the way.</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">FirstLook is the only platform built for this new era:</h4>
                <p className="text-gray-700 font-light mb-2">Tour with zero pressure or commitment.</p>
                <p className="text-gray-700 font-light mb-4">Pay only for what you use—no 3% defaults, no hidden deals.</p>
                <p className="text-gray-600 font-light mb-4">Ready to see it for yourself?</p>
                <Button 
                  onClick={onRequestShowing}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-medium shadow-none"
                >
                  Schedule Your First Tour Now →
                </Button>
              </div>
            </div>
          </div>

          {/* Solution Bridge */}
          <div className="text-center bg-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-4 tracking-tight">See Homes on Your Terms—No Surprises, No Pressure</h3>
            <p className="text-gray-300 text-lg mb-6 max-w-3xl mx-auto leading-relaxed font-light">
              We connect you directly with trusted, verified showing professionals. Tour homes when you want, keep your info private, and get total pricing transparency—no upfront commitments, ever.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm font-medium mb-6 flex-wrap">
              <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20">Browse Properties</span>
              <ArrowRight className="w-4 h-4 text-gray-300" />
              <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20">Request a Showing</span>
              <ArrowRight className="w-4 h-4 text-gray-300" />
              <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20">Tour On Your Schedule</span>
            </div>
            <p className="text-white font-medium text-lg">
              Ready to shop like a pro, without agent headaches?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryChangesSection;
