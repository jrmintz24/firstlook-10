
import { Card, CardContent } from "@/components/ui/card";
import { Quote, MapPin, DollarSign } from "lucide-react";

interface DCAnecdoteProps {
  story: string;
  buyer: string;
  neighborhood?: string;
  savings?: string;
}

export const DCAnecdote = ({ story, buyer, neighborhood, savings }: DCAnecdoteProps) => {
  return (
    <Card className="border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 rounded-2xl overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg hover:scale-110 transition-transform duration-300">
            <Quote className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <blockquote className="text-slate-700 italic mb-6 leading-relaxed text-lg font-light">
              "{story}"
            </blockquote>
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-base text-slate-800 font-semibold">
                — {buyer}
              </div>
              {neighborhood && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">{neighborhood}</span>
                </div>
              )}
              {savings && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-bold">{savings}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
