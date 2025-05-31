
const TrustIndicators = () => {
  const indicators = [
    { value: "500+", label: "Available Properties", color: "blue" },
    { value: "2hrs", label: "Average Response", color: "green" },
    { value: "100%", label: "Free First Tour", color: "purple" },
    { value: "Licensed", label: "DC Professionals", color: "orange" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {indicators.map((indicator, index) => (
        <div 
          key={index}
          className={`bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-${indicator.color}-100 shadow-lg`}
        >
          <div className={`text-4xl font-bold text-${indicator.color}-600`}>
            {indicator.value}
          </div>
          <div className="text-gray-600 font-medium">{indicator.label}</div>
        </div>
      ))}
    </div>
  );
};

export default TrustIndicators;
