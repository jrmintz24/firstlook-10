
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
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              House Hunting in DC Shouldn't Be This Hard
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The traditional real estate process is broken. We're fixing it, one showing at a time.
            </p>
          </div>
          
          <div className="space-y-12">
            {problemPoints.map((point, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="bg-red-50 border-l-4 border-red-400 p-8 rounded-lg">
                    <h3 className="text-2xl font-bold text-red-800 mb-4">The Problem:</h3>
                    <p className="text-red-700 text-lg">{point.problem}</p>
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-green-50 border-l-4 border-green-400 p-8 rounded-lg">
                    <h3 className="text-2xl font-bold text-green-800 mb-4">FirstLook Solution:</h3>
                    <p className="text-green-700 text-lg">{point.solution}</p>
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
