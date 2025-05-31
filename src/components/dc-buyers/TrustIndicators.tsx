
const TrustIndicators = () => {
  const indicators = [
    { value: "200+", label: "Trusted Agents", gradient: "from-purple-500 to-pink-600" },
    { value: "12min", label: "Average Response", gradient: "from-green-500 to-emerald-600" },
    { value: "100%", label: "Free First Tour", gradient: "from-blue-500 to-cyan-600" },
    { value: "Licensed", label: "DC Professionals", gradient: "from-pink-500 to-orange-500" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {indicators.map((indicator, index) => (
        <div 
          key={index}
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg"
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
