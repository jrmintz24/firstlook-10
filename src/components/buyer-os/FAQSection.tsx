
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "❓ What is FirstLook?",
      answer: "FirstLook is a home touring platform built for modern buyers. We let you schedule showings on your terms—with no contracts, no pressure, and no gatekeeping. Want to bring in an agent later? Cool. Want to go solo until you're ready to make an offer? Also fine. You're in control."
    },
    {
      question: "💡 Why was FirstLook created?",
      answer: "After a 2024 legal settlement, buyers are now responsible for signing their own buyer agency agreements and paying their agents directly. This left a lot of buyers confused—and unrepresented. FirstLook bridges that gap by: Letting you tour homes freely, Offering optional help when you're ready, Giving you access to huge commission rebates. We're here to make buying a home simpler, fairer, and a whole lot less pushy."
    },
    {
      question: "🔏 Will I be asked to sign anything?",
      answer: "Before your first tour, you'll sign a simple, non-exclusive, non-paid tour agreement that satisfies state requirements. It's not a commitment—it's just a permission slip so your showing agent can legally walk you through the property."
    },
    {
      question: "📄 What happens after I tour a home?",
      answer: "Nothing—unless you want more help. You can: Keep browsing and booking tours, Upgrade your plan to unlock offer-writing tools, Ask FirstLook to help write and negotiate an offer"
    },
    {
      question: "🧾 How does the commission rebate work?",
      answer: "If the seller offers a buyer agent commission (which many still do), and you buy through FirstLook: We collect the commission at closing, We keep just 10% as a service fee, You get 90% back as a rebate. Example: Seller offers 2.5% on a $500,000 home = $12,500, FirstLook keeps $1,250, You get $11,250 back at closing 💸"
    },
    {
      question: "📍Why can't I just use Zillow?",
      answer: "You can—but here's the catch: Zillow sends your info to 3+ agents instantly, You get hit with sales calls, You're pushed to sign contracts before you're ready. FirstLook puts the buyer first. No spam. No pressure. Just tours when and how you want them."
    }
  ];

  return (
    <div className="py-8 sm:py-12 bg-white">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`} 
              className="bg-gray-50 rounded-2xl border-0 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <AccordionTrigger className="text-left py-6 px-8 text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6 text-gray-600 leading-relaxed font-light text-base">
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
