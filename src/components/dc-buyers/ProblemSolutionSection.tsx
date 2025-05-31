
const ProblemSolutionSection = () => {
  const problemPoints = [
    {
      problem: "Traditional agents require lengthy buyer agreements before showing any homes",
      solution: "FirstLook lets you tour homes immediately without any commitments"
    },
    {
      problem: "Open houses are crowded and only available on weekends",
      solution: "Get private showings 7 days a week at times that work for you"
    },
    {
      problem: "Agents pressure you to make quick decisions",
      solution: "Take your time, see multiple properties, make informed decisions"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-6">
              House Hunting in DC Shouldn't Be This Hard
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The traditional real estate process is broken. We're fixing it, one showing at a time.
            </p>
          </div>
          
          <div className="space-y-12">
            {problemPoints.map((point, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    <h3 className="text-2xl font-bold text-slate-700 mb-4 flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                        ⚠
                      </div>
                      The Problem
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed">{point.problem}</p>
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-white">
                    <h3 className="text-2xl font-bold mb-4 flex items-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                        ✨
                      </div>
                      FirstLook Solution
                    </h3>
                    <p className="text-purple-100 text-lg leading-relaxed">{point.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolutionSection;
