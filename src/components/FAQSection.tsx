
import { useState } from "react";
import { ChevronDown, Shield, Clock, DollarSign, CheckCircle, Users, Home } from "lucide-react";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How is FirstLook different from traditional real estate agents?",
      answer: "FirstLook provides transparent, commitment-free home showings. Unlike traditional agents who often require buyer agreements upfront, we let you explore homes without pressure or long-term commitments. Your first showing is completely free.",
      icon: Shield
    },
    {
      question: "What happens after the NAR settlement changes?",
      answer: "The NAR settlement requires greater transparency in buyer agent compensation. FirstLook embraces this change by providing clear, upfront pricing for our services. You'll know exactly what you're paying for, when you're paying it.",
      icon: DollarSign
    },
    {
      question: "How quickly can I schedule a showing?",
      answer: "We typically match you with a showing partner within 24 hours. Once matched, you can usually schedule your showing within 2-3 days, depending on property availability and your schedule preferences.",
      icon: Clock
    },
    {
      question: "Are your showing partners really licensed professionals?",
      answer: "Yes! All our showing partners are licensed real estate professionals in their respective markets. We verify credentials, check references, and ensure they meet our standards for professionalism and market knowledge.",
      icon: CheckCircle
    },
    {
      question: "What if I want to make an offer on a home I tour?",
      answer: "Great! Your showing partner can help facilitate the offer process. At that point, you can choose to work with them as your buyer's agent (with transparent pricing) or we can connect you with other qualified agents if you prefer.",
      icon: Home
    },
    {
      question: "How much does FirstLook cost?",
      answer: "Your first showing is completely free. After that, we offer transparent, per-showing rates or package deals. No hidden fees, no surprise charges - you'll know exactly what you're paying before you commit to anything.",
      icon: Users
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about FirstLook and the changing real estate landscape
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
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              We're here to help you understand how FirstLook works and how it can benefit your home search.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@firstlook.com" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              >
                Contact Support
              </a>
              <a 
                href="/faq" 
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold border-2 border-purple-200 hover:bg-purple-50 transition-all duration-300"
              >
                View Full FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
