import { CheckCircle, Search, FileText, DollarSign, ClipboardCheck, Handshake, Scale, Key, Home } from "lucide-react";

export const guideSections = [
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
    title: "Step 1: Clarify Your Needs and Finances",
    icon: CheckCircle,
    content: {
      overview: "The first step in any homebuying journey is figuring out what you want and what you can afford. Traditionally, a buyer's agent would ask you a bunch of questions to nail down your wish list and budget. But you absolutely can (and should) do this yourself – after all, you know your situation best!",
      keyPoints: [
        "Define your home requirements with must-haves vs. nice-to-haves",
        "Assess your financial readiness including down payment and closing costs",
        "Research mortgage options and local assistance programs",
        "Create a focused strategy to avoid wasting time on unsuitable properties"
      ],
      content: [
        "Define Your Home Requirements: Make a list of your must-haves and nice-to-haves. How many bedrooms and bathrooms? Do you need a home office or parking spot? Are you set on a specific neighborhood or school district? Get specific about your priorities. This will focus your search so you don't waste time touring homes that aren't a fit. It may help to rank your priorities in order (for example: location, then price, then size, etc.). Remember, without an agent filtering listings for you, it's extra important to have a clear vision of what you're looking for.",
        "Assess Your Financial Readiness: Take a hard look at your finances to understand what price range is realistic. This means reviewing your savings, income, debts, and credit score. In general, you'll want money saved for a down payment (anywhere from ~3% for some first-time buyer programs up to 20% to avoid mortgage insurance) plus about 2–5% of the home price for closing costs and reserves. Use an online home affordability calculator to ballpark what price range and monthly payment you can comfortably handle.",
        "Check Your Mortgage Options: Start researching mortgage rates and loan programs. This isn't about getting a loan just yet – it's about educating yourself on what's available. Look into different loan types (conventional, FHA, VA, etc.), current interest rates, and any first-time homebuyer assistance programs in your area. For example, DC has programs like DC Open Doors and HPAP that can help with down payments if you qualify. Knowing the basics will empower you when it's time to talk to lenders for real.",
        "By clarifying your needs and financial parameters upfront, you set the foundation for a focused, efficient home search. You're essentially acting as your own agent in this stage – defining the criteria that an agent would normally gather from you. Keep your notes handy (consider a simple spreadsheet or note-taking app) and update them as your thinking evolves.",
        "How FirstLook Helps: FirstLook provides tools and templates to help you self-assess your needs. For instance, the platform might prompt you to create a profile with your desired neighborhoods, price range, and home features. This way, when you start searching, FirstLook (or any home search site) can alert you to matching properties. While a traditional agent might quiz you in person, FirstLook lets you thoughtfully consider your priorities on your own, then refine them as you learn more. And when it comes to finances, FirstLook can refer you to trusted mortgage advisors who understand the needs of independent buyers."
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
