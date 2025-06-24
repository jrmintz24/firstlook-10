
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How is FirstLook different from working with a traditional agent?",
      answer: "Traditional agents work on commission and often expect exclusivity upfront. FirstLook lets you explore on your own terms — no contracts, no pressure. You only pay for what you need."
    },
    {
      question: "Can I really tour a home without hiring an agent?",
      answer: "Yes. We partner with licensed showing agents who meet you at the home. No buyer's agreement needed — just a simple tour disclosure form."
    },
    {
      question: "How does the commission rebate work?",
      answer: "If a seller offers buyer commission, we collect it as your agent of record, keep 10%, and return 90% to you. That's often $5,000–$15,000 back at closing."
    },
    {
      question: "Why can't I get the commission rebate directly?",
      answer: "Because of how real estate contracts are written, only a licensed agent can receive commissions. Without FirstLook acting as your placeholder agent, that money goes to someone else."
    },
    {
      question: "What if I need help writing an offer?",
      answer: "Pro members get access to our DIY offer builder. Premium members get dedicated support from a licensed real estate agent. You can also purchase full-service support à la carte."
    },
    {
      question: "Are your showing partners licensed professionals?",
      answer: "Yes. Every FirstLook Pro is a licensed real estate agent, trained in non-pushy, buyer-first tour etiquette."
    }
  ];

  return (
    <div className="py-16 sm:py-20 bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 py-2">
              <AccordionTrigger className="text-left py-6 text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-gray-600 leading-relaxed font-light text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQSection;
