
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface DCAnecdoteProps {
  story: string;
  buyer: string;
  neighborhood?: string;
  savings?: string;
}

export const DCAnecdote = ({ story, buyer, neighborhood, savings }: DCAnecdoteProps) => {
  return (
    <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 rounded-2xl overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg hover:scale-110 transition-transform duration-300">
            <Quote className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-gray-700 italic mb-4 leading-relaxed text-lg font-light">"{story}"</p>
            <div className="text-base text-gray-600">
              <span className="font-semibold">— {buyer}</span>
              {neighborhood && <span className="text-gray-500 font-medium">, {neighborhood}</span>}
              {savings && (
                <div className="mt-3 text-green-600 font-semibold text-lg">
                  Saved: {savings}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
