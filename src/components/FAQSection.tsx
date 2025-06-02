
import { useState } from "react";
import { ChevronDown, Shield, Clock, DollarSign, CheckCircle, Users, Home } from "lucide-react";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "Why should I trust FirstLook instead of just working with a traditional agent?",
      answer: "Traditional agents often require you to sign exclusive buyer agreements before showing you a single home, creating pressure and limiting your options. FirstLook gives you the freedom to explore homes with licensed professionals without any upfront commitments. You can evaluate the service and the agent before making any decisions about representation.",
      icon: Shield
    },
    {
      question: "What's the catch? How can the first showing really be free?",
      answer: "No catch. We believe in proving our value upfront. Your first showing is completely free because we want you to experience the quality of our service. If you love it, you can book additional showings starting at $50 each, or work with your showing partner for offers and negotiations. Many traditional agents spend thousands on marketing - we'd rather invest in your experience.",
      icon: DollarSign
    },
    {
      question: "How is this different from just going to open houses?",
      answer: "Open houses happen on the seller's schedule, often inconvenient weekends, with crowds and pressure. FirstLook gives you private, one-on-one tours scheduled around YOUR availability - evenings, early mornings, or weekends. You get undivided attention, can ask detailed questions, and truly evaluate if the home fits your lifestyle.",
      icon: Clock
    },
    {
      question: "Are your showing partners actually qualified real estate professionals?",
      answer: "Absolutely. Every FirstLook partner is a licensed real estate agent in their market, fully insured, and thoroughly vetted. They have local expertise and can provide insights about neighborhoods, pricing, and market conditions. The difference is they're focused on serving you, not pressuring you into a binding agreement.",
      icon: CheckCircle
    },
    {
      question: "What if I want to make an offer after seeing a home I love?",
      answer: "Perfect! Your showing partner can absolutely help you with offers, negotiations, and the entire buying process. At that point, you can choose to work with them as your buyer's agent with clear, transparent pricing, or we can connect you with other qualified professionals. You're always in control of the next steps.",
      icon: Home
    },
    {
      question: "How does this work with the recent changes in real estate?",
      answer: "The NAR settlement requires greater transparency in buyer representation and compensation. FirstLook was built with this transparency in mind from day one. You know exactly what you're paying (if anything) and when. No surprise commission structures or hidden agreements - just clear, honest service focused on your needs.",
      icon: Users
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-6">
            Is FirstLook Right For You?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The honest answers to the questions every smart homebuyer is asking about this new approach
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => {
            const IconComponent = faq.icon;
            const isOpen = openFAQ === index;
            
            return (
              <div 
                key={index}
                className="mb-6 bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <button
                  className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-2xl"
                  onClick={() => setOpenFAQ(isOpen ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown 
                      className={`w-6 h-6 text-purple-600 transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="ml-16 text-gray-700 text-lg leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 max-w-2xl mx-auto border border-purple-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to experience the difference?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of smart homebuyers who are taking control of their home search with FirstLook's transparent, commitment-free approach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@firstlook.com" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              >
                Get Your Free Showing
              </a>
              <a 
                href="/faq" 
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold border-2 border-purple-200 hover:bg-purple-50 transition-all duration-300"
              >
                Read All FAQs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
