const ProblemBridge = () => {
  return (
    <div className="py-8 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="container mx-auto px-6 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            The Hidden Problem
          </div>
          
          <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-4 leading-tight">
            Most buyers don't realize they're already paying thousands for an agent they don't have.
          </h3>
          
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto mb-6">
            Every home listing includes a buyer's agent commission — but if you don't have an agent, 
            that money just disappears into the seller's pocket.
          </p>
          
          <div className="text-blue-600 font-medium">
            Here's how we fix that: ↓
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemBridge;