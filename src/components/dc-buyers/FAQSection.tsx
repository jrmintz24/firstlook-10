
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "How is FirstLook different from traditional real estate agents?",
      answer: "Traditional agents often require binding buyer agreements before showing any homes. FirstLook connects you with licensed professionals for individual showings without any upfront commitments. You decide if and when you want to work with an agent for next steps."
    },
    {
      question: "What does 'free first showing' actually mean? Are there hidden costs?",
      answer: "Your first property tour is completely free - no fees, no contracts, no obligations. If you want additional showings, our transparent flat-rate pricing starts at $50 per showing. No hidden fees, ever. You'll know exactly what you're paying before you book."
    },
    {
      question: "How does FirstLook relate to the recent NAR settlement changes?",
      answer: "The NAR settlement requires greater transparency in real estate compensation. FirstLook was built with this transparency in mind - you know upfront what you're paying (if anything) and there are no surprise commission structures or hidden agreements."
    },
    {
      question: "Are FirstLook partners actually licensed real estate professionals?",
      answer: "Yes, absolutely. Every showing partner is a licensed real estate agent in Washington DC, fully insured, and verified through our screening process. They have local market expertise and can help with next steps if you choose to move forward."
    },
    {
      question: "What happens after my free showing?",
      answer: "After your tour, you have complete control. You can: book additional showings, ask your showing partner to help with offers or negotiations, or simply walk away with no obligations. The choice is entirely yours."
    },
    {
      question: "How quickly can I schedule a showing?",
      answer: "Most showings can be scheduled within 24-48 hours. Our partners work 7 days a week and can accommodate early morning, evening, and weekend appointments based on your schedule and the property's availability."
    },
    {
      question: "What if I want to make an offer on a home I tour?",
      answer: "If you love a property and want to move forward, your showing partner can help you with the offer process. You can choose to work with them as your buyer's agent, or we can connect you with other qualified professionals. You're never locked into anything."
    },
    {
      question: "Can I tour multiple properties in different DC neighborhoods?",
      answer: "Absolutely! Each property tour is independent. You can explore homes in Capitol Hill, Georgetown, Dupont Circle, or any DC neighborhood that interests you. We'll match you with partners who know each specific area."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about transparent home touring in DC
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <button
                  className="w-full px-6 py-6 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    {openFAQ === index ? (
                      <ChevronUp className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Still have questions? We're here to help.
            </p>
            <a 
              href="mailto:hello@firstlook.homes" 
              className="text-purple-600 hover:text-purple-700 font-medium underline"
            >
              Contact us directly
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
