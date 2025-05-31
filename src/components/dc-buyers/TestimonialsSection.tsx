
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      neighborhood: "Capitol Hill",
      quote: "FirstLook made house hunting so much easier. I saw 8 homes in one weekend without any pressure to sign with an agent. Found my dream rowhouse!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      neighborhood: "Dupont Circle",
      quote: "The flexibility was amazing. I could schedule showings around my work schedule, and the showing partner knew everything about the neighborhood.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      neighborhood: "Georgetown",
      quote: "No pushy sales tactics, just great service. The showing partner answered all my questions and never made me feel rushed to make a decision.",
      rating: 5
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            What DC Homebuyers Are Saying
          </h2>
          <p className="text-xl text-gray-600">
            Real stories from real people who found their dream homes with FirstLook.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-blue-300 mb-4" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg mb-6 italic">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-blue-600">{testimonial.neighborhood} Homeowner</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
