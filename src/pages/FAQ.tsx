
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Shield, Gift, HandShake, DollarSign, AlertCircle, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ = () => {
  const tourExperienceFAQs = [
    {
      question: "How private is my contact info?",
      answer: "Your email and phone number are never shared unless you choose to share them—no cold calls, no spam, just control. We believe your privacy should be protected throughout your home search journey.",
      icon: Shield
    },
    {
      question: "Will I need to sign a contract?",
      answer: "No contracts required. Our tours are on-demand and commitment-free. No agent sign-ups, no pressure to buy—just explore homes on your schedule whenever you're ready.",
      icon: HandShake
    },
    {
      question: "What happens after my free first tour?",
      answer: "You're in complete control. Use the same easy process to book additional tours at affordable flat rates—only when you're ready. No pressure, no follow-up calls unless you want them.",
      icon: Gift
    },
    {
      question: "Will an agent still be involved?",
      answer: "You lead, we support. Licensed DC professionals are available on-call only if you want guidance or have questions. They're there to help, not to pressure you into decisions.",
      icon: Home
    }
  ];

  const pricingPolicyFAQs = [
    {
      question: "How do your fees compare to traditional agent commissions?",
      answer: "Traditional 6% commissions? Skip them. We operate on transparent flat-rate per-tour pricing so you save thousands. Your first tour is completely free—no hidden agenda.",
      icon: DollarSign
    },
    {
      question: "Any hidden costs or subscriptions?",
      answer: "None. You only pay for the tours you book—no monthly fees, no surprise charges, no fine print. What you see is exactly what you get.",
      icon: AlertCircle
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit and debit cards, processed securely. Simple, straightforward payment when you book additional tours.",
      icon: CreditCard
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link to="/">
            <Button variant="ghost" className="mb-6 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-gray-100 text-gray-700 border-gray-200 px-4 py-2 rounded-full font-medium">
              <Shield className="h-4 w-4 mr-2" />
              Commitment-Free Home Tours
            </Badge>
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
        {/* Tour Experience Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-3xl font-light text-gray-900">Tour Experience</h2>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {tourExperienceFAQs.map((faq, index) => {
                const IconComponent = faq.icon;
                return (
                  <AccordionItem 
                    key={index} 
                    value={`tour-${index}`}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200"
                  >
                    <AccordionTrigger className="text-left hover:no-underline px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-blue-600" />
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

        {/* Pricing & Policies Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-3xl font-light text-gray-900">Pricing & Policies</h2>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {pricingPolicyFAQs.map((faq, index) => {
                const IconComponent = faq.icon;
                return (
                  <AccordionItem 
                    key={index} 
                    value={`pricing-${index}`}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200"
                  >
                    <AccordionTrigger className="text-left hover:no-underline px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-green-600" />
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
