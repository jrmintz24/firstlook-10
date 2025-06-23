
import { AlertTriangle, Scale, Zap } from "lucide-react";

const IndustryChanges = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            The Industry is <span className="font-semibold text-gray-900">Finally Changing</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-8 bg-red-50 rounded-3xl border border-red-100">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">The Old Way</h3>
            <div className="text-gray-600 leading-relaxed font-light space-y-2">
              <p>• 6% commissions baked into prices</p>
              <p>• No transparency</p>
              <p>• Pressure to sign contracts early</p>
            </div>
          </div>
          
          <div className="text-center p-8 bg-blue-50 rounded-3xl border border-blue-100">
            <Scale className="h-12 w-12 text-blue-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">The New Rules</h3>
            <div className="text-gray-600 leading-relaxed font-light space-y-2">
              <p>• You choose if you want an agent</p>
              <p>• Buyer fees can be negotiated</p>
              <p>• Platforms like FirstLook give you power</p>
            </div>
          </div>
          
          <div className="text-center p-8 bg-green-50 rounded-3xl border border-green-100">
            <Zap className="h-12 w-12 text-green-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">The FirstLook Way</h3>
            <div className="text-gray-600 leading-relaxed font-light space-y-2">
              <p>• Transparent pricing</p>
              <p>• A la carte services</p>
              <p>• Huge commission rebates when you buy</p>
              <p className="font-semibold text-gray-900">• You're in control.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryChanges;
