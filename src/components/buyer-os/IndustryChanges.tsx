
import { AlertTriangle, Scale, Zap } from "lucide-react";

const IndustryChanges = () => {
  return (
    <div className="py-24 sm:py-32 bg-white">
      <div className="container mx-auto px-6 sm:px-8">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 tracking-tight">
            The Industry is <span className="font-medium text-gray-900">Finally Changing</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="text-center p-10 bg-red-50/50 rounded-3xl border border-red-100">
            <AlertTriangle className="h-14 w-14 text-red-600 mx-auto mb-8" />
            <h3 className="text-xl font-medium text-gray-900 mb-6">The Old Way</h3>
            <div className="text-gray-600 leading-relaxed font-light space-y-3">
              <p>• 6% commissions baked into prices</p>
              <p>• No transparency</p>
              <p>• Pressure to sign contracts early</p>
            </div>
          </div>
          
          <div className="text-center p-10 bg-blue-50/50 rounded-3xl border border-blue-100">
            <Scale className="h-14 w-14 text-blue-600 mx-auto mb-8" />
            <h3 className="text-xl font-medium text-gray-900 mb-6">The New Rules</h3>
            <div className="text-gray-600 leading-relaxed font-light space-y-3">
              <p>• You choose if you want an agent</p>
              <p>• Buyer fees can be negotiated</p>
              <p>• Platforms like FirstLook give you power</p>
            </div>
          </div>
          
          <div className="text-center p-10 bg-green-50/50 rounded-3xl border border-green-100">
            <Zap className="h-14 w-14 text-green-600 mx-auto mb-8" />
            <h3 className="text-xl font-medium text-gray-900 mb-6">The FirstLook Way</h3>
            <div className="text-gray-600 leading-relaxed font-light space-y-3">
              <p>• Transparent pricing</p>
              <p>• A la carte services</p>
              <p>• Huge commission rebates when you buy</p>
              <p className="font-medium text-gray-900">• You're in control.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryChanges;
