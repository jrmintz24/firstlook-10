
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, DollarSign, Search, TrendingUp } from "lucide-react";

interface QuickActionsProps {
  onRequestShowing: () => void;
  onMakeOffer: () => void;
}

const QuickActions = ({ onRequestShowing, onMakeOffer }: QuickActionsProps) => {
  const actions = [
    {
      icon: Home,
      title: "Request Showing",
      description: "Schedule a tour of your dream home",
      color: "bg-blue-600 hover:bg-blue-700",
      iconColor: "text-blue-600",
      onClick: onRequestShowing
    },
    {
      icon: DollarSign,
      title: "Make an Offer",
      description: "Submit an offer on a toured property",
      color: "bg-green-600 hover:bg-green-700",
      iconColor: "text-green-600",
      onClick: onMakeOffer
    },
    {
      icon: Search,
      title: "Browse Properties",
      description: "Explore available homes in your area",
      color: "bg-purple-600 hover:bg-purple-700",
      iconColor: "text-purple-600",
      onClick: () => console.log("Browse properties")
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <div key={index} className="group">
              <Button
                onClick={action.onClick}
                className={`w-full h-auto p-6 ${action.color} text-white flex flex-col items-center gap-3 transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg`}
              >
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-xs opacity-90 mt-1">{action.description}</div>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
