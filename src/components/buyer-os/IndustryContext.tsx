
import { Compass, DollarSign, Handshake, Zap } from "lucide-react";

const IndustryContext = () => {
  return (
    <div className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6 sm:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="text-3xl">🌀</span>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
              Why FirstLook Exists: <span className="font-medium">Real Estate Is Being Rewritten</span>
            </h2>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg border border-gray-100 mb-12">
            <div className="prose prose-lg max-w-none text-gray-700 font-light leading-relaxed space-y-6">
              <p className="text-lg">
                In 2024, a massive legal settlement forced the real estate industry to change. The National Association of Realtors (NAR) agreed to end the practice of built-in 6% commissions, giving buyers real choice for the first time.
              </p>
              
              <p className="text-lg font-medium text-gray-900">
                But choice without clarity creates chaos.
              </p>
              
              <p className="text-lg">
                Platforms like Zillow are pivoting to keep control by bundling services behind the scenes. The result? Buyers still get pushed into full-service agreements before they even see a house.
              </p>
              
              <p className="text-lg font-semibold text-gray-900">
                FirstLook does the opposite.
              </p>
            </div>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-8 tracking-tight">
              We're building a new system where:
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Compass className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-gray-700 font-light leading-relaxed">
                <span className="font-medium text-gray-900">🧭 You choose when you need help</span> — and when you don't.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-700 font-light leading-relaxed">
                <span className="font-medium text-gray-900">💸 You save thousands</span> with commission rebates.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Handshake className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-gray-700 font-light leading-relaxed">
                <span className="font-medium text-gray-900">🤝 You only pay for what you use</span> — no pressure, no surprise fees.
              </p>
            </div>
          </div>

          <div className="text-center bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-8 sm:p-10 text-white">
            <div className="max-w-3xl mx-auto">
              <p className="text-xl sm:text-2xl font-light mb-4 leading-relaxed">
                It's not just a showing app.
              </p>
              <p className="text-xl sm:text-2xl font-medium leading-relaxed">
                It's a buyer-powered real estate platform, built for transparency and flexibility.
              </p>
              <div className="mt-6">
                <Zap className="h-8 w-8 mx-auto text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryContext;
