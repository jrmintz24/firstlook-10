
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scale, Home, Users, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ = () => {
  const faqs = [
    {
      question: "What is the NAR settlement and how does it affect me as a homebuyer?",
      answer: "The National Association of Realtors (NAR) settlement, finalized in 2024, fundamentally changed how real estate transactions work. Previously, seller agents would often offer compensation to buyer agents through the MLS, and buyers could view homes without signing agreements. Now, buyer agents must have written agreements before showing properties, and compensation is no longer automatically shared. This means if you want to see a home, you typically need to commit to an agent relationship first - which is where ViewFree comes in to provide that crucial first look without the commitment."
    },
    {
      question: "Why do I need to sign an agreement with an agent just to see a house?",
      answer: "The NAR settlement requires buyer agents to have written agreements before providing services, including showings. This was designed to clarify agent compensation and duties, but it creates a barrier for buyers who just want to explore properties. Traditional agents now need this commitment upfront to protect their time and ensure compensation. ViewFree solves this by offering that crucial first showing without requiring you to commit to full representation."
    },
    {
      question: "What's wrong with just going to open houses?",
      answer: "Open houses are great, but they have limitations: they're only scheduled at specific times (often weekends), many properties don't have them, and you're competing with crowds of other buyers. Plus, you can't ask detailed questions or take your time exploring. Private showings let you view properties on your schedule, ask questions freely, and really get a feel for the space - but traditionally required agent commitments that many buyers aren't ready for."
    },
    {
      question: "How is ViewFree different from just calling the listing agent?",
      answer: "Calling the listing agent creates several issues: they represent the seller's interests (not yours), they may pressure you to work with them or their recommended buyer agent, and they might not be available when you want to see the property. ViewFree provides neutral showing partners who aren't trying to sell you on representation during your first visit, and our platform makes scheduling simple and transparent."
    },
    {
      question: "Is ViewFree's first free showing really free? What's the catch?",
      answer: "Yes, your first showing is completely free with no hidden fees or obligations. Our showing partners provide this as their investment in meeting potential clients - think of it as their marketing cost. You're not obligated to use them for anything else, though we do offer additional paid services if you choose. We believe removing this barrier helps everyone: you get to explore freely, and agents meet genuinely interested buyers."
    },
    {
      question: "Who are ViewFree's showing partners and can I trust them?",
      answer: "All our showing partners are licensed real estate professionals who have been vetted by our team. We verify their licenses, check their background, and ensure they understand our no-pressure approach for first showings. They're experienced agents who believe in letting buyers explore freely before making representation decisions."
    },
    {
      question: "What happens after my free showing if I like the property?",
      answer: "You have complete control over your next steps. Options include: requesting additional paid showings of other properties ($39-69 each), hiring us for offer-writing assistance if you want to make an offer ($299-799), or connecting with a full-service buyer agent (which could be your showing partner or another agent in our network). There's no pressure - you choose what level of service you need."
    },
    {
      question: "Can I use ViewFree if I already have a buyer's agent?",
      answer: "If you've already signed an exclusive buyer agreement with an agent, you'll need to work through them for showings. However, if you're just starting your search or haven't committed to representation yet, ViewFree is perfect for exploring your options before making that decision."
    },
    {
      question: "How does ViewFree make money if the first showing is free?",
      answer: "We operate on a freemium model: the first showing attracts users, then we earn revenue from paid services like additional showings, offer-writing assistance, and referral fees when buyers choose full representation. Our showing partners invest in that first free showing as their customer acquisition cost, similar to how other service providers offer free consultations."
    },
    {
      question: "Is ViewFree available in my area?",
      answer: "We're currently launching in Washington D.C. as our pilot market. We chose D.C. because of its dynamic housing market and tech-savvy buyer population. Based on our success there, we'll expand to other major metropolitan areas. Sign up to be notified when we launch in your city!"
    },
    {
      question: "How do I prepare for my ViewFree showing?",
      answer: "Come prepared with questions about the property, neighborhood, and any concerns. Since your showing partner is focused on access rather than sales, feel free to take your time exploring. Bring a phone to take photos/notes if allowed, and don't feel pressured to make any decisions during the visit. Think of it as your chance to genuinely evaluate if this property fits your needs."
    },
    {
      question: "What if I want to make an offer on a property I saw through ViewFree?",
      answer: "Great! You have several options: use our offer-writing assistance service for a flat fee, work with the showing partner who toured you through the property, or choose any other agent you prefer. We'll provide referrals to trusted professionals, but the choice is always yours. Our goal is to give you options, not lock you into anything."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 px-4 py-2">
              <Scale className="h-4 w-4 mr-2" />
              Understanding the New Real Estate Landscape
            </Badge>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-lg">
              Everything you need to know about the NAR settlement, why ViewFree exists, and how we're making home buying better.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader>
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">NAR Settlement</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Understanding the new rules and how they impact your home search
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Home className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">ViewFree Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                How we're solving the new barriers to home exploration
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                What you can expect and control in your home buying journey
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-sm border-0 px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Home Search?</h3>
            <p className="mb-6 text-purple-100">
              Don't let the new rules slow you down. Get your first private showing completely free with ViewFree.
            </p>
            <Link to="/">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Request Your Free Showing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
