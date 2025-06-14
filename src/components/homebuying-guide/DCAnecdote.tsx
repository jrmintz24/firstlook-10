
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
    <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 mb-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Quote className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-gray-700 italic mb-3 leading-relaxed">"{story}"</p>
            <div className="text-sm text-gray-600">
              <span className="font-medium">— {buyer}</span>
              {neighborhood && <span className="text-gray-500">, {neighborhood}</span>}
              {savings && (
                <div className="mt-2 text-green-600 font-medium">
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
