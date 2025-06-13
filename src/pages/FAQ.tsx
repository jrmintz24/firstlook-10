
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
              Transparent Home Touring
            </Badge>
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-xl font-light leading-relaxed">
              Everything you need to know about <span className="font-medium">FirstLook</span> and commitment-free home touring.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="text-center border border-gray-200 shadow-sm bg-white rounded-3xl">
            <CardHeader className="pb-6">
              <div className="w-14 h-14 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Shield className="h-7 w-7 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-medium text-gray-900">No Pressure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 font-light">
                Explore homes without sales pressure or binding commitments
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border border-gray-200 shadow-sm bg-white rounded-3xl">
            <CardHeader className="pb-6">
              <div className="w-14 h-14 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Clock className="h-7 w-7 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-medium text-gray-900">On-Demand Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 font-light">
                Schedule showings when convenient for you, 7 days a week
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border border-gray-200 shadow-sm bg-white rounded-3xl">
            <CardHeader className="pb-6">
              <div className="w-14 h-14 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-green-600" />
              </div>
              <CardTitle className="text-xl font-medium text-gray-900">Transparent Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 font-light">
                First showing free, clear pricing for additional services
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-6">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-3xl shadow-sm border border-gray-200 px-8"
              >
                <AccordionTrigger className="text-left hover:no-underline py-8">
                  <span className="font-medium text-gray-900 pr-4 text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-8 text-lg font-light">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 max-w-3xl mx-auto">
          <div className="bg-gray-900 rounded-3xl p-12 text-white">
            <Home className="h-14 w-14 mx-auto mb-6 opacity-90" />
            <h3 className="text-3xl font-light mb-6 tracking-tight">Ready to Start Your Home Search?</h3>
            <p className="mb-8 text-gray-300 text-lg font-light leading-relaxed">
              Get your first private showing completely free with <span className="font-medium text-white">FirstLook</span>. No commitments, no pressure.
            </p>
            <Link to="/">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-2xl font-medium text-lg shadow-none">
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
