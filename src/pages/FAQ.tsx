
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Shield, Gift, Handshake, DollarSign, AlertCircle, CreditCard, Calendar, Users, MapPin, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const FAQ = () => {
  useEffect(() => {
    document.title = 'FAQs | FirstLook';
  }, []);

  const gettingStartedFAQs = [
    {
      question: "❓ What is FirstLook?",
      answer: "FirstLook is a home touring platform built for modern buyers. We let you schedule showings on your terms—with no contracts, no pressure, and no gatekeeping. Want to bring in an agent later? Cool. Want to go solo until you're ready to make an offer? Also fine. You're in control.",
      icon: Home
    },
    {
      question: "💡 Why was FirstLook created?",
      answer: "After a 2024 legal settlement, buyers are now responsible for signing their own buyer agency agreements and paying their agents directly. This left a lot of buyers confused—and unrepresented. FirstLook bridges that gap by: Letting you tour homes freely, Offering optional help when you're ready, Giving you access to huge commission rebates. We're here to make buying a home simpler, fairer, and a whole lot less pushy.",
      icon: Shield
    },
    {
      question: "🔏 Will I be asked to sign anything?",
      answer: "Before your first tour, you'll sign a simple, non-exclusive, non-paid tour agreement that satisfies state requirements. It's not a commitment—it's just a permission slip so your showing agent can legally walk you through the property.",
      icon: Shield
    }
  ];

  const touringProcessFAQs = [
    {
      question: "🏠 Can I really see a home without hiring an agent?",
      answer: "Yes! With FirstLook, you can book one free tour a month (on the Basic plan), and up to five a month on Premium. No contracts, no pressure. You only connect with an agent if you choose to.",
      icon: Home
    },
    {
      question: "📅 How do I book a tour?",
      answer: "Easy: Find a home you want to see, Enter the address on FirstLook, Pick a time that works for you, A licensed pro will meet you there",
      icon: Calendar
    },
    {
      question: "🔐 Is FirstLook safe and private?",
      answer: "Absolutely. Your contact info is never shared with agents unless you explicitly choose to connect with one. All of our showing partners are licensed professionals who pass a screening and onboarding process. You'll always know who you're meeting and when. We also provide: Agent profiles and reviews, Tour confirmations with full details, A secure messaging system for any follow-up questions. Your privacy and safety are our top priorities.",
      icon: Shield
    },
    {
      question: "📄 What happens after I tour a home?",
      answer: "Nothing—unless you want more help. You can: Keep browsing and booking tours, Upgrade your plan to unlock offer-writing tools, Ask FirstLook to help write and negotiate an offer",
      icon: Users
    }
  ];

  const pricingCommissionFAQs = [
    {
      question: "🧾 How does the commission rebate work?",
      answer: "If the seller offers a buyer agent commission (which many still do), and you buy through FirstLook: We collect the commission at closing, We keep just 10% as a service fee, You get 90% back as a rebate. Example: Seller offers 2.5% on a $500,000 home = $12,500, FirstLook keeps $1,250, You get $11,250 back at closing 💸",
      icon: DollarSign
    },
    {
      question: "🚫 Are there any hidden fees?",
      answer: "Nope. Our pricing is simple, transparent, and month-to-month. Cancel anytime. Extra tours and offer-writing help are clearly priced and optional.",
      icon: AlertCircle
    },
    {
      question: "💰 How much does FirstLook cost?",
      answer: "We offer flexible pricing: Basic plan includes 1 free tour per month, Premium plan includes up to 5 tours per month plus offer-writing tools, Pay-per-tour options are also available. All plans are month-to-month with no long-term commitments.",
      icon: CreditCard
    }
  ];

  const flexibilityChoiceFAQs = [
    {
      question: "👩‍💼 Do I have to use FirstLook for the whole transaction?",
      answer: "Nope. After touring, you can: Use FirstLook to help you write and manage your offer (Premium plan), Choose one of our agents to represent you and pay a discounted referral fee, Or go off-platform and work directly with your favorite agent—we'll just collect a referral fee based on how many homes they showed you",
      icon: Handshake
    },
    {
      question: "📍 Why can't I just use Zillow?",
      answer: "You can—but here's the catch: Zillow sends your info to 3+ agents instantly, You get hit with sales calls, You're pushed to sign contracts before you're ready. FirstLook puts the buyer first. No spam. No pressure. Just tours when and how you want them.",
      icon: Shield
    },
    {
      question: "🏘️ Can I work with my own agent if I change my mind?",
      answer: "Absolutely! FirstLook is designed to give you maximum flexibility. You can start touring homes with us and later decide to work with your own agent for offers and negotiations. We're not here to lock you in—we're here to give you options.",
      icon: Users
    }
  ];

  const practicalDetailsFAQs = [
    {
      question: "📍 Do you operate in my area?",
      answer: "We're currently live in the DC metro area (including Northern Virginia and parts of Maryland). More cities launching soon! Contact us to be notified when we expand to your area.",
      icon: MapPin
    },
    {
      question: "💬 What if I have more questions?",
      answer: "We're happy to help. Just shoot us a message or check out our support center. Our team is available to answer any questions about the platform, touring process, or home buying in general.",
      icon: HelpCircle
    },
    {
      question: "🔄 Can I reschedule or cancel a tour?",
      answer: "Yes! Life happens, and we understand. You can easily reschedule or cancel tours through your dashboard with reasonable notice. We'll work with you to find a time that works better.",
      icon: Calendar
    },
    {
      question: "👥 Can I bring family or friends on tours?",
      answer: "Of course! Buying a home is a big decision, and we encourage you to bring whoever you'd like for support and additional perspectives. Just let us know how many people will be attending when you book.",
      icon: Users
    }
  ];

  const faqSections = [
    { title: "Getting Started", faqs: gettingStartedFAQs, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { title: "Touring Process", faqs: touringProcessFAQs, iconBg: "bg-green-100", iconColor: "text-green-600" },
    { title: "Pricing & Commissions", faqs: pricingCommissionFAQs, iconBg: "bg-yellow-100", iconColor: "text-yellow-600" },
    { title: "Flexibility & Choice", faqs: flexibilityChoiceFAQs, iconBg: "bg-purple-100", iconColor: "text-purple-600" },
    { title: "Practical Details", faqs: practicalDetailsFAQs, iconBg: "bg-gray-100", iconColor: "text-gray-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Everything You Need to Know About Touring, Offers, and Buying With FirstLook
            </h1>
            <p className="text-gray-600 text-xl font-light leading-relaxed">
              Get the answers you need about <span className="font-medium">FirstLook's</span> commitment-free, buyer-first home touring experience.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {faqSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="max-w-4xl mx-auto mb-16" id={section.title.toLowerCase().replace(/\s+/g, '-')}>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 ${section.iconBg} rounded-xl flex items-center justify-center`}>
                  <Home className={`h-5 w-5 ${section.iconColor}`} />
                </div>
                <h2 className="text-3xl font-light text-gray-900">{section.title}</h2>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {section.faqs.map((faq, index) => {
                  const IconComponent = faq.icon;
                  return (
                    <AccordionItem 
                      key={index} 
                      value={`${sectionIndex}-${index}`}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                    >
                      <AccordionTrigger className="text-left hover:no-underline px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 ${section.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className={`h-5 w-5 ${section.iconColor}`} />
                          </div>
                          <span className="font-medium text-gray-900 text-lg">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed px-6 pb-6 ml-14 text-lg font-light">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        ))}

        {/* Ready to Start CTA */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-12 text-white">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-light mb-6 tracking-tight">🏁 Ready to Start Touring?</h3>
            <p className="mb-8 text-gray-300 text-lg font-light leading-relaxed">
              Pick your plan, find a home, and book your first tour today. Your future home is closer than you think.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-2xl font-medium text-lg shadow-none">
                  Get Your Free Tour
                </Button>
              </Link>
              <a 
                href="mailto:support@firstlook.com"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-medium text-lg border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300"
              >
                View Pricing Plans
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
