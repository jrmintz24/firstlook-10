
import { problemPoints } from "@/data/problemPoints";

interface ProblemSolutionSectionProps {
  onRequestShowing: () => void;
}

const ProblemSolutionSection = ({ onRequestShowing }: ProblemSolutionSectionProps) => {

  return (
    <div className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              House Hunting Shouldn't Require Blind Faith
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              The traditional real estate system forces you to commit to an agent before you know if they're right for you. We believe you should experience the service before making any commitments.
            </p>
          </div>
          
          <div className="space-y-12">
            {problemPoints.map((point, index) => (
              <div key={index} className="max-w-3xl mx-auto">
                {/* Problem Card */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 text-xl font-medium flex-shrink-0">
                      ❌
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900 mb-3">
                        What's Broken
                      </h3>
                      <p className="text-gray-700 leading-relaxed font-light">{point.problem}</p>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="flex justify-center mb-6">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-gray-600"></div>
                  </div>
                </div>

                {/* Solution Card */}
                <div className="bg-gray-900 rounded-2xl p-8 text-white shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl font-medium flex-shrink-0">
                      ✅
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-3">
                        <span className="font-medium">FirstLook</span> Difference
                      </h3>
                      <p className="text-gray-200 leading-relaxed font-light">{point.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <div className="bg-white rounded-2xl p-12 max-w-3xl mx-auto border border-gray-200 shadow-sm">
              <h3 className="text-3xl font-light text-gray-900 mb-6 tracking-tight">
                Ready to Experience the Difference?
              </h3>
              <p className="text-gray-600 text-lg mb-8 font-light leading-relaxed">
                Join thousands of smart buyers who've taken control of their home search. Your first private showing is completely free - no contracts, no commitments, no catch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={onRequestShowing}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-none"
                >
                  Get Your Free Home Tour
                </button>
                <button
                  type="button"
                  onClick={onRequestShowing}
                  className="bg-white text-gray-900 px-8 py-4 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-none"
                >
                  See How It Works
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolutionSection;
