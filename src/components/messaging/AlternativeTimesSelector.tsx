
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender_profile?: {
    first_name: string;
    last_name: string;
    user_type: string;
  };
}

interface AlternativeTimesSelelectorProps {
  showingRequestId: string;
  messages: Message[];
  onTimeSelected: (message: string) => Promise<boolean>;
}

const AlternativeTimesSelector = ({ 
  showingRequestId, 
  messages, 
  onTimeSelected 
}: AlternativeTimesSelelectorProps) => {
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [responding, setResponding] = useState(false);
  const { toast } = useToast();

  // Find the latest message with alternative times from an agent
  const alternativeMessage = messages
    .filter(msg => msg.sender_profile?.user_type === 'agent')
    .filter(msg => msg.content.includes('Alternative'))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  if (!alternativeMessage) return null;

  // Parse alternative times from the message content
  const parseAlternatives = (content: string) => {
    const alternatives = [];
    const lines = content.split('\n');
    
    let currentAlternative = null;
    for (const line of lines) {
      if (line.includes('Alternative Date 1:') || line.includes('Alternative Date 2:')) {
        if (currentAlternative) {
          alternatives.push(currentAlternative);
        }
        currentAlternative = { date: line.split(':')[1]?.trim(), time: '' };
      } else if (line.includes('Alternative Time') && currentAlternative) {
        currentAlternative.time = line.split(':')[1]?.trim();
      }
    }
    
    if (currentAlternative) {
      alternatives.push(currentAlternative);
    }
    
    return alternatives.filter(alt => alt.date && alt.time);
  };

  const alternatives = parseAlternatives(alternativeMessage.content);

  const handleSelectAlternative = async (index: number) => {
    const selected = alternatives[index];
    if (!selected) return;

    setResponding(true);
    setSelectedAlternative(`${index}`);

    const message = `I'd like to confirm the alternative time: ${selected.date} at ${selected.time}. Please proceed with this time.`;
    
    const success = await onTimeSelected(message);
    
    if (success) {
      toast({
        title: "Alternative Time Selected",
        description: "Your agent has been notified of your preferred alternative time.",
      });
    } else {
      setSelectedAlternative(null);
      toast({
        title: "Error",
        description: "Failed to send your selection. Please try again.",
        variant: "destructive"
      });
    }
    
    setResponding(false);
  };

  const handleDeclineAlternatives = async () => {
    setResponding(true);
    
    const message = "I'm not available for any of the alternative times offered. Could we explore other options or stick with my original preferred time?";
    
    const success = await onTimeSelected(message);
    
    if (success) {
      toast({
        title: "Response Sent",
        description: "Your agent has been notified that the alternatives don't work for you.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to send your response. Please try again.",
        variant: "destructive"
      });
    }
    
    setResponding(false);
  };

  if (alternatives.length === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
          <Calendar className="h-5 w-5" />
          Alternative Times Offered
        </CardTitle>
        <p className="text-sm text-blue-700">
          Your agent has offered alternative times for your showing. Please select your preference:
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Alternative Options */}
        <div className="grid gap-3">
          {alternatives.map((alternative, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedAlternative === `${index}`
                  ? 'border-green-300 bg-green-50'
                  : 'border-blue-200 bg-white hover:border-blue-300'
              }`}
              onClick={() => !responding && handleSelectAlternative(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{alternative.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{alternative.time}</span>
                  </div>
                </div>
                {selectedAlternative === `${index}` && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleDeclineAlternatives}
            disabled={responding}
            className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            None of these work for me
          </Button>
        </div>

        {selectedAlternative && (
          <div className="bg-green-100 border border-green-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Time selection sent to your agent!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Your agent will confirm this time and provide next steps.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlternativeTimesSelector;
