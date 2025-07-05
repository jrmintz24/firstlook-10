
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
      question: "🏠 Can I really see a home without hiring an agent?",
      answer: "Yes! With FirstLook, you can book one free tour a month (on the Basic plan), and up to five a month on Premium. No contracts, no pressure. You only connect with an agent if you choose to."
    },
    {
      question: "🔏 Will I be asked to sign anything?",
      answer: "Before your first tour, you'll sign a simple, non-exclusive, non-paid tour agreement that satisfies state requirements. It's not a commitment—it's just a permission slip so your showing agent can legally walk you through the property."
    },
    {
      question: "📅 How do I book a tour?",
      answer: "Easy: Find a home you want to see, Enter the address on FirstLook, Pick a time that works for you, A licensed pro will meet you there"
    },
    {
      question: "🔐 Is FirstLook safe and private?",
      answer: "Absolutely. Your contact info is never shared with agents unless you explicitly choose to connect with one. All of our showing partners are licensed professionals who pass a screening and onboarding process. You'll always know who you're meeting and when. We also provide: Agent profiles and reviews, Tour confirmations with full details, A secure messaging system for any follow-up questions. Your privacy and safety are our top priorities."
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
      question: "👩‍💼 Do I have to use FirstLook for the whole transaction?",
      answer: "Nope. After touring, you can: Use FirstLook to help you write and manage your offer (Premium plan), Choose one of our agents to represent you and pay a discounted referral fee, Or go off-platform and work directly with your favorite agent—we'll just collect a referral fee based on how many homes they showed you"
    },
    {
      question: "📍Why can't I just use Zillow?",
      answer: "You can—but here's the catch: Zillow sends your info to 3+ agents instantly, You get hit with sales calls, You're pushed to sign contracts before you're ready. FirstLook puts the buyer first. No spam. No pressure. Just tours when and how you want them."
    },
    {
      question: "🚫 Are there any hidden fees?",
      answer: "Nope. Our pricing is simple, transparent, and month-to-month. Cancel anytime. Extra tours and offer-writing help are clearly priced and optional."
    },
    {
      question: "💬 What if I have more questions?",
      answer: "We're happy to help. Just shoot us a message or check out our support center."
    }
  ];

  return (
    <div className="py-12 sm:py-18 bg-white">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-gray-900 mb-6">
            Everything You Need to Know About Touring, Offers, and Buying With FirstLook
          </h2>
        </div>
        
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

        {/* Ready to Start CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-8 sm:p-12 text-white">
            <h3 className="text-3xl sm:text-4xl font-light mb-6 tracking-tight">
              🏁 Ready to Start Touring?
            </h3>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed font-light max-w-2xl mx-auto">
              Pick your plan, find a home, and book your first tour today. Your future home is closer than you think.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-medium text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg">
                Get Your Free Tour
              </button>
              <button className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-medium text-lg hover:bg-white/10 transition-all duration-300">
                View Pricing Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
