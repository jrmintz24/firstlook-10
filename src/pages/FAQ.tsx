
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Shield, Gift, Handshake, DollarSign, AlertCircle, CreditCard, Calendar, Users, MapPin, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ = () => {
  const generalFAQs = [
    {
      question: "What is FirstLook and how does it work?",
      answer: "FirstLook lets you tour homes on your schedule—no agent commitment, no pressure, no sharing your personal info. You browse, book, and tour independently, with support available only when you ask for it.",
      icon: Home
    }
  ];

  const privacyControlFAQs = [
    {
      question: "Will agents or sellers get my contact info?",
      answer: "Never—unless you explicitly decide to share it. You're in control every step of the way. No cold calls, no spam, ever.",
      icon: Shield
    },
    {
      question: "Can I tour homes without being assigned an agent?",
      answer: "Absolutely. FirstLook was built to put buyers in charge, with zero agent assignment or pressure until you're ready.",
      icon: Handshake
    },
    {
      question: "If I want to work with an agent, can I?",
      answer: "Yes! If and when you want agent help, you can connect with a vetted, DC-licensed pro—on your terms.",
      icon: Users
    }
  ];

  const touringExperienceFAQs = [
    {
      question: "How do I schedule a tour?",
      answer: "Simply select a property, pick your preferred time, and book instantly—no phone tag, no back-and-forth, just confirmation in minutes.",
      icon: Calendar
    },
    {
      question: "Who shows the home during my tour?",
      answer: "A verified, DC-licensed local pro will greet you and give access. They're there to help if you need, but will always respect your space and privacy.",
      icon: Home
    },
    {
      question: "Can I bring friends or family on a tour?",
      answer: "Of course—bring whoever you like. We want you to feel comfortable and empowered in your decision-making.",
      icon: Users
    },
    {
      question: "What happens after my first (free) tour?",
      answer: "You can continue booking tours at transparent, flat rates. Still no contracts or commitments.",
      icon: Gift
    }
  ];

  const costValueFAQs = [
    {
      question: "How much does FirstLook cost?",
      answer: "Your first tour is free. After that, simply pay per tour—no subscriptions, no hidden fees, and absolutely no 6% commissions.",
      icon: DollarSign
    },
    {
      question: "How do you save me money compared to traditional agents?",
      answer: "By removing the 6% commission structure and letting you pay only for the tours and services you actually use, FirstLook puts thousands back in your pocket.",
      icon: Gift
    },
    {
      question: "Are there any hidden fees or upcharges?",
      answer: "No. Our pricing is upfront, all-inclusive, and you'll never be surprised by extra costs.",
      icon: AlertCircle
    }
  ];

  const differentiatorsFAQs = [
    {
      question: "How is FirstLook different from traditional real estate services?",
      answer: "Privacy-first: You never get spammed or cold-called. No commitment: No contracts, no agent sign-up, ever. On-demand: Book tours instantly, on your schedule. Flat, transparent pricing: No commissions. Local support, only if you want it: Agents are on-call, not in your face.",
      icon: Shield
    },
    {
      question: "What if I want to make an offer on a home?",
      answer: "When you're ready, we offer expert offer-writing support for a flat fee, or you can bring in your own agent—your choice, no pressure.",
      icon: Handshake
    },
    {
      question: "Can I use FirstLook and still work with my own agent?",
      answer: "Yes! You're never locked in. Use FirstLook to tour homes, then bring in your own agent at any stage if you wish.",
      icon: Users
    }
  ];

  const safetySupportFAQs = [
    {
      question: "Is my information safe with FirstLook?",
      answer: "Absolutely. All data is encrypted, and we only collect what's needed to facilitate your tours—never for marketing or sales.",
      icon: Shield
    },
    {
      question: "What if I need help during a tour?",
      answer: "Local pros are always available for questions or support, but never pushy. You can also reach us directly via chat or support.",
      icon: HelpCircle
    }
  ];

  const practicalFAQs = [
    {
      question: "What if I want to keep seeing homes before making a decision?",
      answer: "No problem. Book as many tours as you like, whenever you like. There's no limit and never any pressure to buy.",
      icon: Calendar
    },
    {
      question: "Do you serve areas outside DC?",
      answer: "We're currently focused on Washington, DC, but let us know if you want to see FirstLook in your city!",
      icon: MapPin
    },
    {
      question: "Can sellers list their homes on FirstLook?",
      answer: "Yes—contact us for details on our transparent, commission-free listing process.",
      icon: Home
    },
    {
      question: "What happens if I need to reschedule or cancel a tour?",
      answer: "You can reschedule or cancel any tour with a simple click—no penalties or headaches.",
      icon: Calendar
    }
  ];

  const faqSections = [
    { title: "General", faqs: generalFAQs, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { title: "Privacy & Control", faqs: privacyControlFAQs, iconBg: "bg-green-100", iconColor: "text-green-600" },
    { title: "Touring & Experience", faqs: touringExperienceFAQs, iconBg: "bg-purple-100", iconColor: "text-purple-600" },
    { title: "Cost & Value", faqs: costValueFAQs, iconBg: "bg-yellow-100", iconColor: "text-yellow-600" },
    { title: "Differentiators", faqs: differentiatorsFAQs, iconBg: "bg-red-100", iconColor: "text-red-600" },
    { title: "Safety & Support", faqs: safetySupportFAQs, iconBg: "bg-indigo-100", iconColor: "text-indigo-600" },
    { title: "Other Practical Questions", faqs: practicalFAQs, iconBg: "bg-gray-100", iconColor: "text-gray-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-xl font-light leading-relaxed">
              Get the answers you need about <span className="font-medium">FirstLook's</span> privacy-first, commitment-free home touring experience.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {faqSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="max-w-4xl mx-auto mb-16">
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
                      className="bg-white rounded-2xl shadow-sm border border-gray-200"
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

        {/* Call to Action */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="bg-gray-900 rounded-3xl p-12 text-white">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-light mb-6 tracking-tight">Still have questions?</h3>
            <p className="mb-8 text-gray-300 text-lg font-light leading-relaxed">
              Get personalized answers and start your commitment-free home search today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-2xl font-medium text-lg shadow-none">
                  Start Your Free Tour
                </Button>
              </Link>
              <a 
                href="mailto:support@firstlook.com"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-medium text-lg border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
