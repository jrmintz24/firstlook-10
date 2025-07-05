
const HowItWorks = () => {
  const steps = [
    {
      emoji: "🏠",
      title: "Drop an Address",
      description: "Just enter the home you want to see. No gatekeepers, no logins.",
    },
    {
      emoji: "📅",
      title: "Schedule Your Tour",
      description: "Pick your time — we'll handle the rest. Meet a local FirstLook Pro or tour solo.",
    },
    {
      emoji: "🎯",
      title: "Choose Your Offer Path",
      description: "• Self-guided contract\n• Agent-coached strategy — You decide how hands-on you want to be.",
    },
    {
      emoji: "🤝",
      title: "Get Extra Help, Anytime",
      description: "Tap into real estate expertise only when needed. No pressure. All on-demand.",
    },
    {
      emoji: "💰",
      title: "Unlock Pro Rewards",
      description: "FirstLook Members earn serious rebates — often $20K+. Upgrade when you're ready.",
    },
  ];

  return (
    <div id="how-it-works" className="py-12 sm:py-16 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-lg leading-8 text-gray-600 font-light">
            House hunting without the gatekeeping.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-6 py-12 px-4">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col items-start p-6 rounded-2xl bg-white shadow-sm w-full md:w-1/5 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">
                  {step.emoji}
                </div>
                <span className="text-sm font-semibold text-gray-700">Step {index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center w-full">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {step.description.split('\n').map((line, lineIndex) => {
                  if (line.includes('Self-guided contract') || line.includes('Agent-coached strategy')) {
                    const parts = line.split('—');
                    return (
                      <span key={lineIndex}>
                        <strong>{parts[0].trim()}</strong>
                        {parts[1] && ` — ${parts[1].trim()}`}
                        {lineIndex < step.description.split('\n').length - 1 && <br />}
                      </span>
                    );
                  }
                  return (
                    <span key={lineIndex}>
                      {line}
                      {lineIndex < step.description.split('\n').length - 1 && <br />}
                    </span>
                  );
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
