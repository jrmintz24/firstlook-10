
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
      answer: "You're not locked in. No contracts. No pressure. You decide when — and if — to involve an agent."
    },
    {
      question: "What happens after I tour a home?",
      answer: "You choose next steps. Walk away, book more, or ask for help with an offer."
    },
    {
      question: "How does the commission rebate work?",
      answer: "If the seller offers a buyer agent commission, we keep 10% as our service fee and give you back 90% — at closing. Simple, clean, and often worth thousands."
    },
    {
      question: "Can I really see a home for free?",
      answer: "Yes. First tour is on us — no strings."
    },
    {
      question: "Are FirstLook Pros licensed agents?",
      answer: "Yes, fully licensed in DC and vetted by our team."
    },
    {
      question: "What if I need help with financing or offers?",
      answer: "Once you upgrade, you get access to expert help — à la carte, when you need it."
    }
  ];

  return (
    <div className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900 mb-6">
            FAQs
          </h2>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 py-2">
              <AccordionTrigger className="text-left py-8 text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-8 text-gray-600 leading-relaxed font-light text-base">
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
