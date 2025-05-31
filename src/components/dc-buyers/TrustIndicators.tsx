
const TrustIndicators = () => {
  const indicators = [
    { value: "200+", label: "Trusted Agents", gradient: "from-purple-600 to-purple-700" },
    { value: "12min", label: "Average Response", gradient: "from-blue-600 to-blue-700" },
    { value: "100%", label: "Free First Tour", gradient: "from-slate-600 to-slate-700" },
    { value: "Licensed", label: "DC Professionals", gradient: "from-purple-700 to-blue-700" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {indicators.map((indicator, index) => (
        <div 
          key={index}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg"
        >
          <div className={`text-4xl font-bold bg-gradient-to-r ${indicator.gradient} bg-clip-text text-transparent`}>
            {indicator.value}
          </div>
          <div className="text-gray-600 font-medium">{indicator.label}</div>
        </div>
      ))}
    </div>
  );
};

export default TrustIndicators;
