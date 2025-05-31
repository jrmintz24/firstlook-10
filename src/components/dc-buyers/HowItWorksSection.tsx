
const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Request a Showing",
      description: "Tell us which DC property you want to see. No registration required for your first tour.",
      color: "blue"
    },
    {
      number: 2,
      title: "Get Matched",
      description: "We connect you with a licensed showing partner who knows your target neighborhood.",
      color: "green"
    },
    {
      number: 3,
      title: "Tour Your Home",
      description: "Visit the property at your convenience. No pressure, no commitments, just expertise.",
      color: "purple"
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            How FirstLook Works in DC
          </h2>
          <p className="text-xl text-gray-600">
            Three simple steps to your perfect home tour.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className={`w-20 h-20 mx-auto mb-6 bg-${step.color}-600 rounded-full flex items-center justify-center`}>
                <span className="text-3xl font-bold text-white">{step.number}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 text-lg">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
