
import { AlertTriangle, Shield, DollarSign } from "lucide-react";

const IndustryChanges = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            The Industry is <span className="font-semibold text-gray-900">Finally Changing</span>
          </h2>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            New rules mean you can finally choose how much to pay for buyer representation
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-8 bg-red-50 rounded-3xl border border-red-100">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">The Old Way</h3>
            <p className="text-gray-600 leading-relaxed font-light">
              Hidden 6% commissions built into home prices, with buyers having no choice in how much they pay for representation.
            </p>
          </div>
          
          <div className="text-center p-8 bg-blue-50 rounded-3xl border border-blue-100">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">New Rules</h3>
            <p className="text-gray-600 leading-relaxed font-light">
              Buyers can now negotiate representation fees and choose services à la carte, creating real transparency.
            </p>
          </div>
          
          <div className="text-center p-8 bg-green-50 rounded-3xl border border-green-100">
            <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">FirstLook Way</h3>
            <p className="text-gray-600 leading-relaxed font-light">
              Transparent pricing, commission rebates, and services only when you need them. You're in control.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-gray-50 text-gray-600 px-10 py-6 rounded-3xl border border-gray-200 shadow-lg">
            <span className="text-3xl">💡</span>
            <span className="font-medium text-xl">Save thousands with transparent pricing—<span className="font-bold text-gray-900">your first home tour is on us</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryChanges;
