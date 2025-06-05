export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "tour-home-without-agent",
    title: "Can I Tour a Home Without an Agent? (Yes, Here\u2019s How)",
    date: "2025-06-05",
    excerpt:
      "Learn the exact steps to schedule a private tour without signing up with a traditional real estate agent.",
    category: "Touring Homes Without an Agent",
    content: [
      "Thinking about touring a property but not ready to commit to an agent? FirstLook lets you book showings on your schedule with vetted local professionals. No contracts, no pressure. Here\u2019s how it works:",
      "1. Create a free FirstLook account and choose the home you\u2019d like to see.\n2. We match you with a licensed showing partner.\n3. Pick a time that works for you.\n4. Tour the property privately and ask all your burning questions.",
      "After your first free showing, decide whether you want additional help or walk away, no strings attached.",
    ],
  },
  {
    slug: "homebuying-without-realtor",
    title: "Homebuying Without a Realtor: A Step-by-Step Guide",
    date: "2025-06-05",
    excerpt:
      "A transparent roadmap for purchasing a home on your own terms using modern tools and on-demand support.",
    category: "First-Time Buyer Education",
    content: [
      "Buying a home without a dedicated buyer\u2019s agent is completely possible if you know the process. This guide outlines every major milestone from searching to closing. You\u2019ll learn how to line up financing, evaluate properties, make competitive offers, and bring in professional help only where you need it.",
    ],
  },
  {
    slug: "what-to-expect-firstlook-tour",
    title: "What to Expect from a FirstLook Tour",
    date: "2025-06-05",
    excerpt:
      "Get the inside scoop on what happens during your on-demand showing so you can arrive prepared and confident.",
    category: "Touring Homes Without an Agent",
    content: [
      "From the moment you request a tour to the follow-up afterwards, this article walks you through the entire experience. See how our showing partners verify access, share local insights, and give you space to explore without sales tactics. We\u2019ll also cover safety protocols and how to capture notes so you can compare homes later.",
    ],
  },
  {
    slug: "after-the-tour-options",
    title: "After the Tour: What Are My Options?",
    date: "2025-06-05",
    excerpt:
      "Not sure what to do once you\u2019ve found a home you love? We break down the choices so you stay in control.",
    category: "Transparency in Real Estate",
    content: [
      "Maybe the home is perfect, or perhaps you have more questions. Either way, you decide the next step. Continue touring, request offer-writing help for a flat fee, or connect with a full-service agent if you prefer. This post covers the pros and cons of each path so you can move forward with clarity.",
    ],
  },
  {
    slug: "commitment-free-home-shopping",
    title: "The Case for Commitment-Free Home Shopping",
    date: "2025-06-05",
    excerpt:
      "Traditional brokerage agreements can feel overwhelming. Discover why more buyers choose flexibility first.",
    category: "Modern Buying Journey",
    content: [
      "Home shopping has changed in the digital age. With so much information online, you deserve the freedom to explore properties before choosing representation. We examine the rise of on-demand touring services like FirstLook and how they empower buyers to stay in the driver\u2019s seat while still getting expert guidance when it matters most.",
    ],
  },
];
