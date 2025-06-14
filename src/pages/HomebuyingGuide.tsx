import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Download, ArrowRight, Home, Search, FileText, DollarSign, ClipboardCheck, Handshake, Scale, Key } from "lucide-react";

const HomebuyingGuide = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [progress, setProgress] = useState(0);

  const sections = [
    {
      id: "introduction",
      title: "Introduction: Why Buy Without an Agent?",
      icon: Home,
      content: {
        overview: "Buying a home without a real estate agent? For savvy Millennial homebuyers craving a modern, private, and flexible experience, going solo is not only possible – it's becoming increasingly popular.",
        keyPoints: [
          "Nearly one-third of recent homebuyers (29% in 2024) purchased without an agent",
          "Save thousands vs. the old 6% commission model that can add tens of thousands to costs", 
          "FirstLook offers professional support without pressure or high price tags",
          "Over 1,000 successful home tours facilitated with 12-minute average response time"
        ],
        content: [
          "Many buyers are tired of the old 6% commission model that can add tens of thousands of dollars to a home's cost. By taking control of the process and leveraging new tools like FirstLook, you can save big and stay in the driver's seat.",
          "FirstLook is a DC-based platform built for buyers who want all the perks of professional support without the pressure or price tag of a traditional realtor. It's about empowering you to get your dream home on your terms – and keeping more money in your pocket.",
          "In this guide, we'll walk through the homebuying journey step by step – from planning your budget to moving day – all without a buyer's agent. At each stage, you'll see how FirstLook can support or even replace what a traditional agent would do.",
          "You'll learn how to clarify your needs, search for homes, schedule tours, secure financing, handle inspections, write offers, negotiate like a pro, and close the deal – all while maintaining control and privacy.",
          "Thousands of DC buyers have already discovered this better way to buy, with FirstLook facilitating over 1,000 successful home tours and licensed DC professionals on call to assist when you need them. That means no binding contracts, no pushy sales tactics – just help when you want it, and savings when you close."
        ],
        comparison: {
          aspects: [
            {
              category: "Cost Structure",
              firstlook: "Pay only for what you need – often flat fees or à la carte services. No 3% commission on the buyer side, saving you thousands.",
              traditional: "\"Free\" to the buyer in theory, but seller pays ~3% to your agent (built into price). On a $500,000 home that's ~$15,000 in commission, ultimately costing you via a higher price."
            },
            {
              category: "Home Search",
              firstlook: "Find homes on your own schedule using online tools (Zillow, Redfin, etc.) or FirstLook's platform. You decide what to see – no middleman gatekeeping listings.",
              traditional: "Agent sets up searches (via MLS) and sends you listings they think fit. You rely on their selections and schedule."
            },
            {
              category: "Touring Properties",
              firstlook: "Book home tours instantly on your timeline. FirstLook provides on-demand, licensed local pros to unlock doors and guide you as needed – but only when you request it. Your first tour is free, with no hidden fees.",
              traditional: "Agent must coordinate showings, and you work around their schedule. You're typically tied to one agent by a contract, and their availability can limit when (and how many) homes you see."
            },
            {
              category: "Negotiation & Offers",
              firstlook: "You stay in control. FirstLook offers resources and expert help (like contract templates or on-call negotiators) only when you need it. You can negotiate directly with sellers or their agents, cutting out the \"telephone game\" for faster communication.",
              traditional: "Agent guides your offer strategy, handles contract drafting, and negotiates with the seller's agent on your behalf. Their commission incentive can subtly conflict (a higher sale price means a bigger commission)."
            },
            {
              category: "Flexibility & Control",
              firstlook: "Maximum control. You decide which homes to see and when, which professionals to consult, and how to approach offers. No pressure to rush into a purchase – FirstLook doesn't get a big commission, so their only goal is your satisfaction.",
              traditional: "Guidance-driven. Agents often steer the process – selecting homes, timing tours, suggesting offer terms. You typically sign an exclusive agreement, limiting your flexibility to try different approaches."
            },
            {
              category: "Professional Network",
              firstlook: "FirstLook connects you to vetted third parties when needed: lenders, home inspectors, real estate attorneys, title companies, etc. You get the benefit of an agent's network without committing to full agent services.",
              traditional: "Agents usually provide referrals for lenders, inspectors, attorneys, and so on – which is helpful, but you might feel obliged to use their contacts. In some cases, choices may be limited to their partners."
            }
          ]
        }
      }
    },
    {
      id: "readiness",
      title: "Step 1: Assessing Your Readiness",
      icon: CheckCircle,
      content: {
        overview: "Before you start touring homes, ensure you're financially and emotionally ready for homeownership.",
        keyPoints: [
          "Calculate your true budget including all monthly costs",
          "Check your credit score and get pre-qualified",
          "Build your emergency fund beyond the down payment",
          "Understand the local market conditions"
        ],
        content: [
          "Financial readiness goes beyond having a down payment. Calculate your debt-to-income ratio, ensure you have 3-6 months of expenses saved beyond your down payment, and factor in property taxes, insurance, and maintenance costs.",
          "Get pre-qualified (or better yet, pre-approved) for a mortgage before you start seriously looking. This gives you a realistic budget and shows sellers you're a serious buyer.",
          "Research the local market. Are you in a buyer's market or seller's market? Understanding inventory levels, average days on market, and price trends will inform your strategy.",
          "Consider your timeline. If you need to move quickly, you might benefit from more professional support. If you have flexibility, you can take your time and be more selective."
        ]
      }
    },
    {
      id: "searching",
      title: "Step 2: Searching for Homes",
      icon: Search,
      content: {
        overview: "Use modern tools to search more effectively than ever before, with access to the same data agents use.",
        keyPoints: [
          "Set up automated searches on multiple platforms",
          "Use advanced filters to narrow down options",
          "Research neighborhoods thoroughly before touring",
          "Track your favorite properties and price changes"
        ],
        content: [
          "Start with major platforms like Zillow, Redfin, and Realtor.com. Set up saved searches with specific criteria and enable notifications for new listings that match your preferences.",
          "Don't rely on just one platform. Different sites may have slight delays or different information. Cross-reference listings and always verify details.",
          "Research neighborhoods extensively. Look at school ratings, crime statistics, future development plans, and visit at different times of day to get a feel for the area.",
          "Use tools like Walk Score to understand walkability, transit options, and nearby amenities. Google Street View can help you scout areas before visiting in person."
        ]
      }
    },
    {
      id: "touring",
      title: "Step 3: Touring Homes",
      icon: Key,
      content: {
        overview: "Tour homes safely and effectively without an agent, knowing what to look for and questions to ask.",
        keyPoints: [
          "Schedule tours through platforms like FirstLook",
          "Prepare a checklist of what to evaluate",
          "Take detailed notes and photos for comparison",
          "Ask the right questions about the property"
        ],
        content: [
          "Use services like FirstLook to schedule tours without agent pressure. You can often see multiple homes in one session and take your time exploring each property.",
          "Bring a checklist covering structural elements, systems (HVAC, plumbing, electrical), storage, natural light, and neighborhood factors. Take photos and notes for later comparison.",
          "Safety first: Let someone know where you're going, meet showing agents at the property, and trust your instincts about any situation that feels uncomfortable.",
          "Ask about recent updates, known issues, why the seller is moving, and how long the property has been on the market. Even without your own agent, you can get valuable information from listing agents."
        ]
      }
    },
    {
      id: "financing",
      title: "Step 4: Securing Financing",
      icon: DollarSign,
      content: {
        overview: "Navigate the mortgage process efficiently, from pre-approval to final loan approval.",
        keyPoints: [
          "Get pre-approved before making offers",
          "Shop around for the best rates and terms",
          "Understand different loan types and requirements",
          "Stay responsive throughout the underwriting process"
        ],
        content: [
          "Pre-approval is crucial when buying without an agent. It shows sellers you're serious and helps you move quickly when you find the right home.",
          "Don't just go with the first lender. Shop around and compare rates, fees, and service quality. Even a 0.25% difference in interest rate can save thousands over the life of the loan.",
          "Understand your loan options: conventional, FHA, VA, USDA, and others. Each has different requirements for down payment, credit score, and property type.",
          "Stay organized and responsive during underwriting. Without an agent to help coordinate, you'll need to provide documents quickly and follow up on any issues."
        ]
      }
    },
    {
      id: "due-diligence",
      title: "Step 5: Due Diligence and Inspections",
      icon: ClipboardCheck,
      content: {
        overview: "Protect yourself with thorough inspections and research, even without an agent advocating for you.",
        keyPoints: [
          "Always get a professional home inspection",
          "Review all property disclosures carefully",
          "Research property history and comparable sales",
          "Understand your contingency periods and rights"
        ],
        content: [
          "Never skip the home inspection, even in a competitive market. A good inspector can save you thousands by identifying issues before you buy.",
          "Review the seller's property disclosure statement carefully. Research any red flags and don't hesitate to ask follow-up questions.",
          "Look up the property's history: previous sales, tax records, permits for renovations. Websites like PropertyShark and local government sites provide valuable information.",
          "Understand your contingency periods. You typically have a set number of days for inspections, appraisal, and financing. Mark these dates on your calendar and don't let them slip."
        ]
      }
    },
    {
      id: "making-offers",
      title: "Step 6: Making Offers and Negotiating",
      icon: FileText,
      content: {
        overview: "Write competitive offers and negotiate effectively, leveraging your position as an unrepresented buyer.",
        keyPoints: [
          "Research comparable sales to determine fair value",
          "Highlight the commission savings in your offer",
          "Use professional offer templates or services",
          "Stay flexible but know your limits"
        ],
        content: [
          "Research recent comparable sales thoroughly. Look at properties that sold in the last 3-6 months with similar size, condition, and location.",
          "Your offer has a built-in advantage: no buyer's agent commission. Make sure this benefit goes to the seller by highlighting potential savings in your offer.",
          "Use professional templates or services like FirstLook's offer support to ensure your paperwork is complete and competitive.",
          "Be prepared to negotiate. Sellers may counter on price, closing date, contingencies, or other terms. Know your priorities and limits before entering negotiations."
        ]
      }
    },
    {
      id: "closing",
      title: "Step 7: Legal Support and Closing",
      icon: Scale,
      content: {
        overview: "Navigate the closing process with confidence, working with title companies and attorneys as needed.",
        keyPoints: [
          "Choose a experienced title company or closing attorney",
          "Stay in close contact with your lender",
          "Complete your final walk-through",
          "Review all closing documents carefully"
        ],
        content: [
          "Select a title company experienced with unrepresented buyers. They'll handle the heavy lifting of coordinating documents, funds, and parties.",
          "Maintain close communication with your lender throughout the process. Respond quickly to requests for additional documentation.",
          "Don't skip the final walk-through. This is your last chance to ensure the property is as expected and any agreed-upon repairs were completed.",
          "Take your time reviewing closing documents. Ask questions about anything you don't understand - the title agent should explain everything clearly."
        ]
      }
    },
    {
      id: "moving-in",
      title: "Step 8: Moving In and Next Steps",
      icon: Home,
      content: {
        overview: "Complete your journey with a smooth move-in and enjoy the savings from buying without a traditional agent.",
        keyPoints: [
          "Plan your move well in advance",
          "Use your commission savings wisely",
          "Handle post-closing items promptly",
          "Enjoy your achievement and new home"
        ],
        content: [
          "Start planning your move as soon as you have a closing date. Book movers, transfer utilities, and handle address changes.",
          "You've potentially saved $10,000-$15,000 or more by avoiding traditional agent commissions. Consider using these savings for improvements, emergency fund, or mortgage principal.",
          "Handle any post-closing items promptly. Keep good records and follow up on any seller agreements that extend beyond closing.",
          "Take pride in what you've accomplished. You've navigated the entire homebuying process independently, proving that modern buyers can take control of their real estate transactions."
        ]
      }
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section, index) => {
        const element = section as HTMLElement;
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(index);
          setProgress(((index + 1) / sections.length) * 100);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const element = document.querySelector(`[data-section="${sections[index].id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Progress Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-900">Complete Guide to Buying a Home Without an Agent</h2>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="pt-20 pb-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            The Complete Guide to Buying a Home Without an Agent
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
            Save thousands in commission fees while maintaining complete control over your homebuying journey. 
            This comprehensive guide shows you exactly how to navigate every step of the process.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/buyer-auth">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-xl">
                Start Your Home Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 border-gray-200 rounded-xl">
              <Download className="mr-2 h-5 w-5" />
              Download Guide
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">$15,000+</div>
              <div className="text-sm text-gray-600">Average savings on a $500k home</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">8 Steps</div>
              <div className="text-sm text-gray-600">Complete process covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">100%</div>
              <div className="text-sm text-gray-600">Control over your purchase</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-4">What You'll Learn</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click any section to jump directly to that part of the guide, or scroll through the complete process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card 
                key={section.id}
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  activeSection === index 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => scrollToSection(index)}
              >
                <CardContent className="p-6 text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${activeSection === index ? 'text-indigo-600' : 'text-gray-600'}`} />
                  <h3 className="font-medium text-gray-900 text-sm leading-tight">
                    {section.title}
                  </h3>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Guide Content */}
        <div className="max-w-4xl mx-auto">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={section.id} data-section={section.id} className="mb-20">
                <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
                  <CardContent className="p-0">
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-sm opacity-80">Step {index}</div>
                          <h2 className="text-2xl font-light">{section.title}</h2>
                        </div>
                      </div>
                      <p className="text-lg opacity-90 leading-relaxed">
                        {section.content.overview}
                      </p>
                    </div>

                    {/* Section Content */}
                    <div className="p-8">
                      {/* Key Points */}
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Points:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {section.content.keyPoints.map((point, pointIndex) => (
                            <div key={pointIndex} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Content */}
                      <div className="prose prose-lg max-w-none">
                        {section.content.content.map((paragraph, paragraphIndex) => (
                          <p key={paragraphIndex} className="text-gray-700 leading-relaxed mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {/* Comparison Table for Introduction Section */}
                      {index === 0 && section.content.comparison && (
                        <div className="mt-8">
                          <h3 className="text-xl font-medium text-gray-900 mb-6">FirstLook vs. Traditional Buyer's Agent: Key Differences</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-200 rounded-lg">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border border-gray-200 p-4 text-left font-medium text-gray-900">Aspect</th>
                                  <th className="border border-gray-200 p-4 text-left font-medium text-indigo-600">FirstLook (Modern DIY Approach)</th>
                                  <th className="border border-gray-200 p-4 text-left font-medium text-gray-600">Traditional Buyer's Agent</th>
                                </tr>
                              </thead>
                              <tbody>
                                {section.content.comparison.aspects.map((aspect, aspectIndex) => (
                                  <tr key={aspectIndex} className="hover:bg-gray-50">
                                    <td className="border border-gray-200 p-4 font-medium text-gray-900 align-top">
                                      {aspect.category}
                                    </td>
                                    <td className="border border-gray-200 p-4 text-gray-700 align-top">
                                      {aspect.firstlook}
                                    </td>
                                    <td className="border border-gray-200 p-4 text-gray-700 align-top">
                                      {aspect.traditional}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Section CTA */}
                      {index === 0 && (
                        <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                          <h4 className="font-medium text-gray-900 mb-2">Ready to get started?</h4>
                          <p className="text-gray-600 mb-4">
                            FirstLook makes it easy to tour homes without agent pressure and get professional support only when you need it.
                          </p>
                          <Link to="/buyer-auth">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                              Create Free Account
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      )}

                      {index === 3 && (
                        <div className="mt-8 p-6 bg-indigo-50 rounded-2xl">
                          <h4 className="font-medium text-gray-900 mb-2">Need help touring homes?</h4>
                          <p className="text-gray-600 mb-4">
                            FirstLook provides safe, professional home tours without the pressure of traditional agents.
                          </p>
                          <Link to="/single-home-tour">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                              Schedule Your First Tour
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      )}

                      {index === 6 && (
                        <div className="mt-8 p-6 bg-green-50 rounded-2xl">
                          <h4 className="font-medium text-gray-900 mb-2">Need help with offers?</h4>
                          <p className="text-gray-600 mb-4">
                            FirstLook offers flat-fee offer writing and negotiation support to help you win the home you want.
                          </p>
                          <Link to="/subscriptions">
                            <Button className="bg-green-600 hover:bg-green-700 text-white">
                              View Offer Support
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Final CTA Section */}
        <div className="text-center py-16">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-light mb-4">Ready to Start Your Home Buying Journey?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of smart buyers who've saved money and maintained control using FirstLook's modern approach to real estate.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/buyer-auth">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg">
                    Read More Articles
                  </Button>
                </Link>
              </div>

              <div className="text-sm text-gray-400">
                No commitment required • Your first tour is free • Cancel anytime
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomebuyingGuide;
