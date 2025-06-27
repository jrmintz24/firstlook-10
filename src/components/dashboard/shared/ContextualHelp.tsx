
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, X, ChevronRight } from "lucide-react";
import { useState } from "react";

interface HelpTip {
  id: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ContextualHelpProps {
  tips: HelpTip[];
  userType: 'buyer' | 'agent';
}

const ContextualHelp = ({ tips, userType }: ContextualHelpProps) => {
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const activeTips = tips.filter(tip => !dismissedTips.includes(tip.id));

  const dismissTip = (tipId: string) => {
    setDismissedTips(prev => [...prev, tipId]);
  };

  if (activeTips.length === 0) return null;

  return (
    <div className="space-y-3">
      {activeTips.map((tip) => (
        <Card key={tip.id} className="border-blue-200 bg-blue-50/50 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <HelpCircle className="h-4 w-4 text-blue-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-900 text-sm">{tip.title}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissTip(tip.id)}
                    className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <p className="text-blue-700 text-xs leading-relaxed mb-3">
                  {tip.description}
                </p>
                
                {tip.action && (
                  <Button
                    onClick={tip.action.onClick}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs"
                  >
                    {tip.action.label}
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContextualHelp;
