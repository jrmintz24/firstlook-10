
import { problemPoints } from "@/data/problemPoints";

interface ProblemSolutionSectionProps {
  onRequestShowing: () => void;
}

const ProblemSolutionSection = ({ onRequestShowing }: ProblemSolutionSectionProps) => {

  return (
    <div className="py-20 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-6">
              House Hunting Shouldn't Require Blind Faith
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The traditional real estate system forces you to commit to an agent before you know if they're right for you. We believe you should experience the service before making any commitments.
            </p>
          </div>
          
          <div className="space-y-12">
            {problemPoints.map((point, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="bg-white/90 backdrop-blur-sm border border-red-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        ❌
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">
                          What's Broken
                        </h3>
                        <p className="text-slate-700 text-lg leading-relaxed">{point.problem}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                        ✅
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-4">
                          <span className="font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">FirstLook</span> Difference
                        </h3>
                        <p className="text-purple-100 text-lg leading-relaxed">{point.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Added a compelling call-to-action section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-slate-100 to-purple-100 rounded-2xl p-8 max-w-3xl mx-auto border border-purple-200">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">
                Ready to Experience the Difference?
              </h3>
              <p className="text-slate-700 text-lg mb-6">
                Join thousands of smart buyers who've taken control of their home search. Your first private showing is completely free - no contracts, no commitments, no catch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={onRequestShowing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Get Your Free Home Tour
                </button>
                <button
                  type="button"
                  onClick={onRequestShowing}
                  className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-purple-200 hover:bg-purple-50 transition-all duration-300"
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
