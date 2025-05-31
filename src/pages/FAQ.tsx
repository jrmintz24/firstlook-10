
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Users, AlertCircle, Shield, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ = () => {
  const faqs = [
    {
      question: "How is FirstLook different from traditional real estate agents?",
      answer: "FirstLook provides transparent, commitment-free home showings. Unlike traditional agents who often require buyer agreements upfront, we let you explore homes without pressure or long-term commitments. Your first showing is completely free, and you can decide if and when you want to work with an agent for next steps."
    },
    {
      question: "What does 'free first showing' actually mean? Are there hidden costs?",
      answer: "Your first property tour is completely free - no fees, no contracts, no obligations. If you want additional showings, our transparent flat-rate pricing starts at $50 per showing. No hidden fees, ever. You'll know exactly what you're paying before you book."
    },
    {
      question: "How quickly can I schedule a showing?",
      answer: "We typically match you with a showing partner within 24 hours. Once matched, you can usually schedule your showing within 2-3 days, depending on property availability and your schedule preferences. Our partners work 7 days a week to accommodate your needs."
    },
    {
      question: "Are FirstLook's showing partners actually licensed real estate professionals?",
      answer: "Yes! All our showing partners are licensed real estate agents, fully insured, and verified through our screening process. We check credentials, references, and ensure they meet our standards for professionalism and local market knowledge."
    },
    {
      question: "What happens after my free showing?",
      answer: "After your tour, you have complete control. You can: book additional showings, ask your showing partner to help with offers or negotiations, connect with other qualified agents, or simply walk away with no obligations. The choice is entirely yours."
    },
    {
      question: "What if I want to make an offer on a home I tour?",
      answer: "Great! Your showing partner can help facilitate the offer process. At that point, you can choose to work with them as your buyer's agent (with transparent pricing) or we can connect you with other qualified professionals. You're never locked into anything."
    },
    {
      question: "Can I tour multiple properties in different neighborhoods?",
      answer: "Absolutely! Each property tour is independent. You can explore homes across different neighborhoods and markets. We'll match you with partners who have expertise in each specific area you're interested in."
    },
    {
      question: "How much does FirstLook cost after the free showing?",
      answer: "We offer transparent, per-showing rates starting at $50, or package deals for multiple showings. We also provide offer-writing assistance for a flat fee if you decide to make an offer. No hidden charges - you'll know exactly what you're paying before you commit to anything."
    },
    {
      question: "Can I use FirstLook if I already have a buyer's agent?",
      answer: "If you've already signed an exclusive buyer agreement with an agent, you'll need to work through them for showings. However, if you're just starting your search or haven't committed to representation yet, FirstLook is perfect for exploring your options before making that decision."
    },
    {
      question: "Is FirstLook available in my area?",
      answer: "We're currently operating in Washington D.C. and expanding to other major metropolitan areas. Sign up to be notified when we launch in your city! We're prioritizing markets based on demand and where we can provide the best service."
    },
    {
      question: "Why do I need FirstLook instead of just going to open houses?",
      answer: "Open houses are great, but they have limitations: they're only scheduled at specific times, many properties don't have them, and you're competing with crowds. Private showings let you view properties on your schedule, ask detailed questions, and really get a feel for the space without pressure."
    },
    {
      question: "How do I prepare for my FirstLook showing?",
      answer: "Come prepared with questions about the property, neighborhood, and any concerns. Since your showing partner is focused on access rather than sales pressure, feel free to take your time exploring. Bring your phone for photos/notes if allowed, and don't feel pressured to make any decisions during the visit."
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
              <Shield className="h-4 w-4 mr-2" />
              Transparent Home Touring
            </Badge>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-lg">
              Everything you need to know about FirstLook and commitment-free home touring.
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
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">No Pressure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Explore homes without sales pressure or binding commitments
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">On-Demand Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Schedule showings when convenient for you, 7 days a week
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Transparent Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                First showing free, clear pricing for additional services
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
            <Home className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Home Search?</h3>
            <p className="mb-6 text-purple-100">
              Get your first private showing completely free with FirstLook. No commitments, no pressure.
            </p>
            <Link to="/">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Get Your Free Showing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
