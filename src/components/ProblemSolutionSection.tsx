
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
            <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              House Hunting Shouldn't Require Blind Faith
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              The traditional real estate system forces you to commit to an agent before you know if they're right for you. We believe you should experience the service before making any commitments.
            </p>
          </div>
          
          <div className="space-y-16">
            {problemPoints.map((point, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 text-2xl font-medium flex-shrink-0">
                        ❌
                      </div>
                      <div>
                        <h3 className="text-2xl font-medium text-gray-900 mb-4">
                          What's Broken
                        </h3>
                        <p className="text-gray-700 text-lg leading-relaxed font-light">{point.problem}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl font-medium flex-shrink-0">
                        ✅
                      </div>
                      <div>
                        <h3 className="text-2xl font-medium mb-4">
                          <span className="font-medium">FirstLook</span> Difference
                        </h3>
                        <p className="text-gray-200 text-lg leading-relaxed font-light">{point.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <div className="bg-white rounded-3xl p-12 max-w-3xl mx-auto border border-gray-200 shadow-sm">
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
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-medium text-lg transition-all duration-200 shadow-none"
                >
                  Get Your Free Home Tour
                </button>
                <button
                  type="button"
                  onClick={onRequestShowing}
                  className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-medium text-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-none"
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
