import { CheckCircle, Search, FileText, DollarSign, ClipboardCheck, Handshake, Scale, Key, Home } from "lucide-react";

export const guideSections = [
  {
    id: "introduction",
    title: "Why Buy Without an Agent?",
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
    title: "Clarify Your Needs and Finances",
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
    title: "Searching for Homes (Without an Agent)",
    icon: Search,
    content: {
      overview: "House-hunting is the fun part! In the old days, agents had exclusive access to the best home listings through the MLS (Multiple Listing Service). Today, however, the internet has leveled the playing field – almost all listings are available online to consumers in real time.",
      keyPoints: [
        "Leverage online platforms like Zillow, Redfin, and Realtor.com with automated alerts",
        "Use FirstLook's curated search tools tied to local MLS data",
        "Explore neighborhoods in person and virtually to become your own expert",
        "Keep organized comparison sheets and track your favorite properties"
      ],
      content: [
        "Leverage Online Listing Platforms: Start with popular sites and apps like Zillow, Redfin, Trulia, or Realtor.com to browse homes in your target area. You can filter by price, size, location, features, etc. and even set up email alerts for new listings that meet your criteria. Many Millennial buyers actually find the home they end up purchasing through their own online searches, not their agent. Create a dedicated email for home search inquiries – it keeps your main inbox uncluttered and ensures you don't miss alerts. Keep an eye out for new listings daily; in a hot market, good homes can go under contract fast.",
        "Use FirstLook's Home Search Tools: If you're in DC, FirstLook's platform may offer a curated search experience tied into the local MLS data. FirstLook can aggregate listings and provide additional context, like neighborhood stats or commute times, to help you evaluate options. At the very least, FirstLook will allow you to save favorite properties and seamlessly request a tour with one click. Essentially, it combines the browsing power of the big sites with the convenience of an on-demand tour scheduler.",
        "Explore Neighborhoods in Person (and Virtually): Without an agent chauffeuring you to showings, you'll want to become your own neighborhood expert. Drive or walk through areas you're interested in – this gives you a feel for the community that photos can't. Note things like nearby shops, traffic levels, and general upkeep of the area. You can also use Google Street View to virtually \"walk\" the neighborhood. Some buyers even reach out on local forums or social media (e.g. neighborhood Facebook groups or Nextdoor) to ask residents about the area. Remember, an agent often can't tell you subjective things like \"Is this a family-friendly block?\" due to fair housing laws, but as an independent buyer you can do that legwork yourself.",
        "Keep a Comparison Sheet: It's easy to get listing overload when you're searching solo. Consider keeping a simple spreadsheet or notebook to track the homes you like. List addresses, key pros/cons, and questions that arise (e.g., \"House on 14th St – great kitchen, but what's the parking situation?\"). This helps you stay organized. An agent would normally help remind you of a property's details, but your notes can do the same. FirstLook might also keep a history of homes you've viewed or toured on your account, which is handy for reference.",
        "One thing to be aware of: off-market listings and coming soons. Traditional agents sometimes know about homes not yet publicly listed. While you might miss a few of those by not having an agent's insider scoop, many \"coming soon\" homes still find their way to Zillow or local real estate Facebook groups. If you're worried about missing out, you can network a bit – attend open houses (talk to the listing agents), join local real estate meetup groups, or have FirstLook notify you of any exclusive listings they know about. But realistically, the vast majority of buyers find their home through public listings.",
        "How FirstLook Supports Your Search: FirstLook is all about a transparent home search. The platform doesn't push certain listings on you to meet a quota or commission target. Instead, you can use it to bookmark homes you love and get honest, data-driven insights. For example, FirstLook might show you how long a property has been on the market or if there were recent price drops. Also, FirstLook can flag which homes might offer better deals if there's no buyer's agent commission involved. Some sellers may be open to discounting the price if you come without an agent, since it saves them paying the buyer's agent – FirstLook can help identify those opportunities."
      ]
    }
  },
  {
    id: "touring",
    title: "Touring Homes",
    icon: Key,
    content: {
      overview: "Seeing homes in person is where the process really gets exciting – and it's an area where FirstLook truly shines. Traditionally, a buyer's agent schedules tours, holds your hand through each house, and offers opinions. Without an agent, you'll be arranging visits yourself, but that doesn't mean you have to go it completely alone.",
      keyPoints: [
        "Schedule tours directly with listing agents or use FirstLook's instant booking",
        "Attend open houses for low-pressure exploration without appointments",
        "Maintain proper touring etiquette and safety practices",
        "Enjoy privacy and freedom to discuss openly without agent pressure"
      ],
      content: [
        "Scheduling Tours Directly: If you find a house you want to see, you have a couple of options. One is to contact the listing agent or seller directly (if it's a For-Sale-By-Owner) to request a showing. Listing agents' info is usually on the listing page. Let them know you're a serious buyer not working with a buyer's agent. They'll typically be happy to set up a time (after all, you potentially save them from having to pay out half the commission). The other option – and a super convenient one – is to use FirstLook's instant tour booking. FirstLook allows you to pick a date and time online for a home viewing, and they dispatch one of their licensed DC pros to meet you there and facilitate the tour. It's like scheduling an Uber, but for house tours!",
        "FirstLook offers a modern, on-demand touring experience: no binding contracts, same-day scheduling, and licensed local professionals to assist – giving you the freedom to see homes on your terms. This means you don't have to play phone tag with a listing agent or worry about saying the wrong thing – FirstLook handles the coordination for you.",
        "Attending Open Houses: Don't forget the classic open house. These are typically held on weekends for listed properties. You can walk in without any appointment. Just sign in and feel free to explore. If an agent asks you if you're represented, simply say you're browsing on your own (or you can mention you're working with FirstLook – they'll understand that as you being an independent buyer). Open houses are a great, low-pressure way to see multiple homes in a day. Bring a friend along if you want a second opinion or just moral support. One perk of not having your own agent at an open house is you can blend in and listen to other buyers' reactions and questions, which can be insightful.",
        "Touring Etiquette and Safety: When touring without an agent, you're essentially your own agent in the field. Be respectful of the properties – arrive on time, take off shoes if asked, don't go snooping in off-limits areas like locked closets or drawers. Feel free to take photos or videos (with permission if the owner is present) so you can review them later. It's a good idea to prepare a checklist for each tour: note your impressions of the layout, condition, neighborhood vibe, etc., and jot down any questions. Always keep safety in mind too: it's rare, but if you're meeting a stranger for a FSBO showing, let someone know where you'll be. With FirstLook, you'll have a vetted professional with you, adding a layer of comfort and security.",
        "Privacy and Freedom: One thing many FirstLook users love is the privacy and freedom of touring without feeling like someone is trying to \"sell\" them. You can discuss openly with your partner or friend on the tour about what you like or don't like, without worrying about swaying an agent's strategy. Some buyers feel more at ease examining the nitty-gritty (like opening cabinets, testing the water pressure) when they're not being closely watched by their own agent. The key is, it's your choice. FirstLook's role is simply to grant you access and answer questions – no hard sales pitch.",
        "How FirstLook Makes Touring Easy: This is one of FirstLook's hallmark features – instant tour bookings and on-demand agents. Unlike a traditional agent who might say \"I'm only free on Friday at 3 PM to show you houses,\" FirstLook has a network of local agents ready to go when you are. Want to see a new listing today at lunch? Just hop on the app/website, select a time, and chances are you'll get a confirmed tour often within minutes. The first tour is free, and thereafter you pay a modest flat fee per tour (which is often credited back to you if you end up purchasing with FirstLook's help). This approach means you can tour more homes, more conveniently – a huge plus in competitive markets where timing is everything."
      ]
    }
  },
  {
    id: "financing",
    title: "Securing Financing",
    icon: DollarSign,
    content: {
      overview: "Financing is a crucial piece of the puzzle – and one where you'll want your ducks in a row early. Traditionally, a realtor would often insist you get pre-approved for a mortgage before they start showing you too many houses. This is wise advice, and it applies whether or not you have an agent. In a competitive market, having a mortgage pre-approval letter ready to go is almost mandatory when making an offer.",
      keyPoints: [
        "Shop around with multiple lenders to find the best rates and terms",
        "Get pre-approved before making offers to show sellers you're serious",
        "Understand different loan programs that fit your situation",
        "Stay within your comfort zone, not just your maximum approval amount"
      ],
      content: [
        "Shop for a Mortgage Lender: Start by researching and comparing a few lenders – these can be banks, credit unions, or online mortgage companies. You want a lender that offers competitive rates and good service (responsiveness is key when you're trying to close a deal fast). You can begin with your own bank to see what they offer, but don't stop there. Use online rate comparison tools or reach out to lenders that frequently work with first-time buyers. Many buyers without agents still manage to get quotes from multiple lenders – a smart move that could save you thousands in interest. Remember, you are not obligated to go with the first lender who pre-approves you; you're shopping around for the best deal.",
        "Get Pre-Approved: A pre-approval means a lender has checked your credit, income, and basic finances and is willing to lend you up to a certain amount (pending the home appraisal and other verification later). This comes in the form of a letter. To get one, you'll need to submit an application (often you can do this online in 15-20 minutes) and provide documents like pay stubs, W-2s, bank statements, etc. Within a day or two (sometimes even a few hours), the lender can issue a pre-approval letter stating you are pre-approved for up to $X amount. Get the pre-approval before you start making offers – sellers and their agents will take you far more seriously if you can say \"I'm pre-approved for my financing\" right off the bat. And don't worry, getting pre-approved doesn't lock you into that lender or loan; you can still negotiate or switch lenders later if needed.",
        "Know Your Loan Programs: When talking to lenders, inquire about what loan programs fit your situation. For example, if you have excellent credit and a 20% down payment, a conventional loan is likely best. If you have a smaller down payment, maybe an FHA loan could work (common for first-time buyers, requiring as little as 3.5% down). If you're a veteran or active military, VA loans offer zero down. DC and many states also have first-time buyer programs that a knowledgeable lender can help you access (like down payment assistance or special interest rates). Without an agent's guidance, you'll rely on the lender to walk you through these options – don't hesitate to ask questions. Good lenders are used to working directly with buyers and will happily explain the pros/cons of each loan type.",
        "Consider Your Budget vs. Approval: Just because you get pre-approved for, say, $600,000 doesn't mean you should spend that much. Revisit your own budget (from Step 1) and make sure the monthly payment at that price won't cramp your lifestyle. It's easy to get carried away when a bank green-lights a high amount, but you don't want to be \"house poor.\" One advantage of flying solo: there's no agent trying to push you to your max just to increase their commission. Stick to what you are comfortable with. You can tell your lender a lower number to put on the pre-approval letter if you prefer your offers to be for less (e.g., you might be approved up to $600k, but looking to buy around $500k – you can request the letter say $500k to not tip your hand on higher affordability).",
        "Prepare for Earnest Money and Down Payment: Part of financing prep is ensuring you have liquid funds ready for the earnest money deposit and down payment. When you make an offer, you'll typically need 1-3% of the price as a good-faith deposit (which later counts toward your down payment). Make sure that money is accessible (in a checking account, not tied up in long-term investments that take time to withdraw). Also avoid making any big changes that could upset your finances: don't open new credit lines, don't make large unexplained deposits, and don't switch jobs right before or during the home purchase process. Lenders will re-verify your info before closing, and any of those could jeopardize your loan approval.",
        "FirstLook's Role in Financing: While FirstLook isn't a lender, they do provide guidance to keep you on track. The platform will remind you to get pre-approved early, and can even connect you with partner lenders who are familiar with assisting buyers without traditional agents. These lenders know you might need a bit more direct communication (since there's no agent acting as a go-between) and they're prepared to give you that concierge service. FirstLook might also offer tools like a mortgage calculator or a checklist of documents you'll need for pre-approval, streamlining the process for you. In essence, FirstLook ensures that when you find \"the one\" – that perfect house – you're financially ready to pounce, with financing in place and no delays."
      ]
    }
  },
  {
    id: "due-diligence",
    title: "Due Diligence and Inspections",
    icon: ClipboardCheck,
    content: {
      overview: "Once you have an accepted offer, the real work begins behind the scenes. This phase – often called due diligence or the inspection period – is where you ensure the home is in good condition and that you're fully comfortable with proceeding. Normally, a buyer's agent would help coordinate inspections, negotiate repairs, and keep track of deadlines. Without an agent, you'll need to be proactive in these areas, but it's entirely manageable with a bit of organization.",
      keyPoints: [
        "Hire a licensed home inspector and attend the inspection",
        "Review all seller disclosures and HOA documents carefully",
        "Understand appraisal process and other contingencies",
        "Track all deadlines to protect your contingency rights"
      ],
      content: [
        "Hire a Home Inspector: A thorough home inspection is a must, especially if you're buying without an agent's experienced eye on the property. As soon as your offer is accepted (often you'll have a set number of days in the contract to complete inspections – commonly 5-10 business days), hire a licensed home inspector to go through the house top to bottom. You can find a reputable inspector by reading online reviews, asking friends for recommendations, or using FirstLook's network of vetted inspectors. The cost is typically around $300-$600 depending on the size of the home – worth every penny for peace of mind. Plan to attend the inspection if you can. It's like a crash course in your future home: the inspector will point out issues (big and small), maintenance tips, and more. Take notes and ask questions. If the inspector flags any major issues (e.g., roof leaks, old electrical wiring, foundation cracks), you may need to get a specialist to evaluate or give estimates.",
        "Review Seller Disclosures and Documents: In parallel with the inspection, you should receive any disclosure documents from the seller. These can include things like a disclosure of known problems, past repairs, termite reports, or if it's a condo/HOA, a package of HOA documents and bylaws. Read these carefully! Without an agent to summarize them, you'll need to digest the info yourself. Look for red flags like mention of previous flooding, foundation repairs, or big upcoming HOA fee increases. If something is confusing (easy to happen, especially with HOA documents), consider consulting an attorney for clarity or asking the seller's agent directly for explanation. FirstLook can assist by highlighting key sections of these documents or suggesting questions to ask. Don't be shy about requesting clarification – you have a right to know what you're buying.",
        "Appraisal and Other Contingencies: If you're using a mortgage, the lender will schedule an appraisal to verify the home's value. This isn't something you do; it happens in the background. But you should know it's happening. Occasionally, the appraisal might come in lower than your purchase price – at which point you'd have to negotiate with the seller or bring extra cash. Many contracts have an appraisal contingency, allowing you to back out or renegotiate if that occurs. If you waived it, then you'd have to cover any shortfall. Since you likely don't have an agent advising you on such contingencies, hopefully you included an appraisal contingency (or at least knew the risk). Apart from appraisal, think of any other checks you want: for example, a radon test (common in some areas), a sewer line scope, or checking for lead paint in older homes. You can hire specialists for these if your general inspector doesn't cover them. It's up to you to decide what's needed based on the home's age and condition.",
        "Negotiate Repairs or Credits (if needed): Once inspections are done, you might find some issues that you feel the seller should address. Common examples: a leaking water heater, a termite infestation, or an HVAC system at end-of-life. Without a buyer's agent, you will directly communicate with the seller (or usually the seller's agent) to request repairs or a price reduction/credit. Keep your requests reasonable and focused on the big-ticket safety or functionality items – not cosmetic issues. For instance, asking to fix a structural problem is fair; asking for a $200 paint credit for scuffed walls might not go over well. Write up a clear list of what you want and why. FirstLook can provide a template for a repair request addendum and even advise on what's customary to ask for. Remember, the seller's agent knows you're unrepresented and might try to influence you, but remain firm on items that truly matter. If negotiating repairs feels daunting, this could be a good time to consult a real estate attorney or hire an on-demand agent for a flat fee to help craft the request – you'll still save money versus a full commission, and you'll have backup.",
        "Track Your Deadlines: In a typical contract, there are deadlines for inspection, appraisal, financing approval, etc. Without an agent's transaction coordinator reminding you, it's your responsibility to calendar these. If your inspection contingency expires on, say, the 10th day and you haven't formally requested repairs or given notice to cancel, you could lose that leverage. So mark the dates and act in advance. It helps to have all your key dates in one place (use your phone calendar with alerts, for example).",
        "FirstLook's Guidance During Due Diligence: FirstLook won't leave you hanging once you're under contract. The platform or your assigned support rep (if you opt for offer/closing assistance) will send you reminders of critical deadlines – \"Inspection contingency expires in 3 days, have you completed inspections?\" – that sort of nudge can be invaluable. They also maintain a roster of qualified home inspectors and specialists. Many FirstLook users tap into this network, essentially replacing the agent's referral role. Moreover, FirstLook can connect you with a real estate attorney at this stage if you don't already have one. Attorneys can be especially helpful in reviewing legal documents or drafting repair requests. In DC, having an attorney isn't required to buy a home, but it can be comforting to know you have a legal expert to call if anything gets complicated. FirstLook's goal here is to ensure you don't miss anything that a professional pair of eyes would catch – helping you be thorough and protected, without paying a percentage-of-sale commission for the privilege."
      ]
    }
  },
  {
    id: "making-offers",
    title: "Making Offers and Negotiating",
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
    title: "Legal Support and Closing",
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
    title: "Moving In and Next Steps",
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
