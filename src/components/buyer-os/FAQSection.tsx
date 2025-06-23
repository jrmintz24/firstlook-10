
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
      answer: "FirstLook gives you control. You tour homes on your schedule without signing exclusive agreements. You only work with an agent when you're ready to make an offer, and you can choose from our network of professionals."
    },
    {
      question: "What happens after I tour a home?",
      answer: "Nothing, unless you want something to happen. There's no pressure to make decisions. If you love a home and want to make an offer, we can connect you with experienced agents who will help you negotiate and write competitive offers."
    },
    {
      question: "How does the commission rebate work?",
      answer: "When you buy a home through FirstLook and the seller offers buyer agent commission, we keep 10% as our service fee and return 90% to you as a rebate at closing. This can save you thousands of dollars."
    },
    {
      question: "Can I really see a home for free?",
      answer: "Yes! Your first tour is completely free with no strings attached. After that, our transparent pricing starts at just $39/month for 2 tours, or you can pay per tour without a subscription."
    },
    {
      question: "Are FirstLook Pros licensed real estate professionals?",
      answer: "Yes, all FirstLook Pros are licensed real estate professionals in DC. They're knowledgeable about the local market and can answer questions about homes, neighborhoods, and the buying process."
    },
    {
      question: "What if I need help with financing or offers?",
      answer: "FirstLook Pros can provide guidance and connect you with trusted lenders and agents. For offer writing, we offer professional services starting at $499, including negotiation support."
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Everything you need to know about the FirstLook experience
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
              <AccordionTrigger className="text-left py-6 text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-gray-600 leading-relaxed">
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
