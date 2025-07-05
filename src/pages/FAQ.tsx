
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
      question: "What is FirstLook?",
      answer: "FirstLook is a home touring platform built for modern buyers. We let you schedule showings on your terms—with no contracts, no pressure, and no gatekeeping. Want to bring in an agent later? Cool. Want to go solo until you're ready to make an offer? Also fine. You're in control.",
      icon: Home
    },
    {
      question: "Why was FirstLook created?",
      answer: "After a 2024 legal settlement, buyers are now responsible for signing their own buyer agency agreements and paying their agents directly. This left a lot of buyers confused—and unrepresented. FirstLook bridges that gap by: Letting you tour homes freely, Offering optional help when you're ready, Giving you access to huge commission rebates. We're here to make buying a home simpler, fairer, and a whole lot less pushy.",
      icon: Shield
    },
    {
      question: "Will I be asked to sign anything?",
      answer: "Before your first tour, you'll sign a simple, non-exclusive, non-paid tour agreement that satisfies state requirements. It's not a commitment—it's just a permission slip so your showing agent can legally walk you through the property.",
      icon: Shield
    }
  ];

  const touringProcessFAQs = [
    {
      question: "Can I really see a home without hiring an agent?",
      answer: "Yes! With FirstLook, you can book one free tour a month (on the Basic plan), and up to five a month on Premium. No contracts, no pressure. You only connect with an agent if you choose to.",
      icon: Home
    },
    {
      question: "How do I book a tour?",
      answer: "Easy: Find a home you want to see, Enter the address on FirstLook, Pick a time that works for you, A licensed pro will meet you there",
      icon: Calendar
    },
    {
      question: "Is FirstLook safe and private?",
      answer: "Absolutely. Your contact info is never shared with agents unless you explicitly choose to connect with one. All of our showing partners are licensed professionals who pass a screening and onboarding process. You'll always know who you're meeting and when. We also provide: Agent profiles and reviews, Tour confirmations with full details, A secure messaging system for any follow-up questions. Your privacy and safety are our top priorities.",
      icon: Shield
    },
    {
      question: "What happens after I tour a home?",
      answer: "Nothing—unless you want more help. You can: Keep browsing and booking tours, Upgrade your plan to unlock offer-writing tools, Ask FirstLook to help write and negotiate an offer",
      icon: Users
    }
  ];

  const pricingCommissionFAQs = [
    {
      question: "How does the commission rebate work?",
      answer: "If the seller offers a buyer agent commission (which many still do), and you buy through FirstLook: We collect the commission at closing, We keep just 10% as a service fee, You get 90% back as a rebate. Example: Seller offers 2.5% on a $500,000 home = $12,500, FirstLook keeps $1,250, You get $11,250 back at closing 💸",
      icon: DollarSign
    },
    {
      question: "Are there any hidden fees?",
      answer: "Nope. Our pricing is simple, transparent, and month-to-month. Cancel anytime. Extra tours and offer-writing help are clearly priced and optional.",
      icon: AlertCircle
    },
    {
      question: "How much does FirstLook cost?",
      answer: "We offer flexible pricing: Basic plan includes 1 free tour per month, Premium plan includes up to 5 tours per month plus offer-writing tools, Pay-per-tour options are also available. All plans are month-to-month with no long-term commitments.",
      icon: CreditCard
    }
  ];

  const flexibilityChoiceFAQs = [
    {
      question: "Do I have to use FirstLook for the whole transaction?",
      answer: "Nope. After touring, you can: Use FirstLook to help you write and manage your offer (Premium plan), Choose one of our agents to represent you and pay a discounted referral fee, Or go off-platform and work directly with your favorite agent—we'll just collect a referral fee based on how many homes they showed you",
      icon: Handshake
    },
    {
      question: "Why can't I just use Zillow?",
      answer: "You can—but here's the catch: Zillow sends your info to 3+ agents instantly, You get hit with sales calls, You're pushed to sign contracts before you're ready. FirstLook puts the buyer first. No spam. No pressure. Just tours when and how you want them.",
      icon: Shield
    },
    {
      question: "Can I work with my own agent if I change my mind?",
      answer: "Absolutely! FirstLook is designed to give you maximum flexibility. You can start touring homes with us and later decide to work with your own agent for offers and negotiations. We're not here to lock you in—we're here to give you options.",
      icon: Users
    }
  ];

  const practicalDetailsFAQs = [
    {
      question: "Do you operate in my area?",
      answer: "We're currently live in the DC metro area (including Northern Virginia and parts of Maryland). More cities launching soon! Contact us to be notified when we expand to your area.",
      icon: MapPin
    },
    {
      question: "What if I have more questions?",
      answer: "We're happy to help. Just shoot us a message or check out our support center. Our team is available to answer any questions about the platform, touring process, or home buying in general.",
      icon: HelpCircle
    },
    {
      question: "Can I reschedule or cancel a tour?",
      answer: "Yes! Life happens, and we understand. You can easily reschedule or cancel tours through your dashboard with reasonable notice. We'll work with you to find a time that works better.",
      icon: Calendar
    },
    {
      question: "Can I bring family or friends on tours?",
      answer: "Of course! Buying a home is a big decision, and we encourage you to bring whoever you'd like for support and additional perspectives. Just let us know how many people will be attending when you book.",
      icon: Users
    }
  ];

  const faqSections = [
    { title: "Getting Started", faqs: gettingStartedFAQs, color: "from-blue-500/10 to-blue-600/5" },
    { title: "Touring Process", faqs: touringProcessFAQs, color: "from-emerald-500/10 to-emerald-600/5" },
    { title: "Pricing & Commissions", faqs: pricingCommissionFAQs, color: "from-amber-500/10 to-amber-600/5" },
    { title: "Flexibility & Choice", faqs: flexibilityChoiceFAQs, color: "from-purple-500/10 to-purple-600/5" },
    { title: "Practical Details", faqs: practicalDetailsFAQs, color: "from-slate-500/10 to-slate-600/5" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30" />
        <div className="relative container mx-auto px-6 py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-extralight tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Everything You Need
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                to Know
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl font-light text-gray-600 leading-relaxed max-w-3xl mx-auto">
              About FirstLook's commitment-free, buyer-first approach to home touring and buying
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-16">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="group">
              {/* Section Header */}
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-3 tracking-tight">
                  {section.title}
                </h2>
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
              </div>
              
              {/* FAQ Items */}
              <div className="space-y-3">
                {section.faqs.map((faq, index) => {
                  const IconComponent = faq.icon;
                  return (
                    <div 
                      key={index}
                      className={`bg-gradient-to-br ${section.color} backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/5 hover:border-gray-200/40`}
                    >
                      <Accordion type="single" collapsible>
                        <AccordionItem value={`${sectionIndex}-${index}`} className="border-none">
                          <AccordionTrigger className="text-left hover:no-underline px-6 lg:px-8 py-6 group/trigger">
                            <div className="flex items-center gap-4 w-full">
                              <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/trigger:scale-105 group-hover/trigger:bg-white">
                                <IconComponent className="h-5 w-5 text-gray-700" />
                              </div>
                              <span className="font-medium text-gray-900 text-lg lg:text-xl pr-4 leading-tight">
                                {faq.question}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 lg:px-8 pb-6">
                            <div className="ml-14 text-gray-700 text-base lg:text-lg leading-relaxed font-light">
                              {faq.answer}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-3xl mx-auto mt-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
            <div className="relative p-12 lg:p-16 text-white">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Gift className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-light mb-6 tracking-tight">
                Ready to Start Touring?
              </h3>
              
              <p className="mb-10 text-gray-300 text-lg lg:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                Pick your plan, find a home, and book your first tour today. Your future home is closer than you think.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button 
                    size="lg" 
                    className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-2xl font-medium text-lg shadow-none border-0 transition-all duration-300 hover:scale-105"
                  >
                    Get Your Free Tour
                  </Button>
                </Link>
                <a 
                  href="mailto:support@firstlook.com"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-medium text-lg border border-white/20 text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  View Pricing Plans
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
