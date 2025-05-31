
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, Building2, TreePine, Star, Home, Users } from "lucide-react";

const NeighborhoodsSection = () => {
  const dcNeighborhoods = [
    { name: "Capitol Hill", icon: Landmark, description: "Historic charm near the Capitol", avgPrice: "$850K" },
    { name: "Dupont Circle", icon: Building2, description: "Vibrant nightlife and dining", avgPrice: "$720K" },
    { name: "Georgetown", icon: TreePine, description: "Upscale waterfront living", avgPrice: "$1.2M" },
    { name: "Adams Morgan", icon: Star, description: "Diverse cultural hub", avgPrice: "$650K" },
    { name: "Logan Circle", icon: Home, description: "Victorian architecture & trendy spots", avgPrice: "$780K" },
    { name: "Shaw", icon: Users, description: "Emerging neighborhood with character", avgPrice: "$600K" }
  ];

  return (
    <div className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect DC Neighborhood
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From historic Capitol Hill to trendy Shaw, explore every corner of the nation's capital with local experts who know each neighborhood inside and out.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {dcNeighborhoods.map((neighborhood, index) => {
            const IconComponent = neighborhood.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{neighborhood.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">{neighborhood.avgPrice}</div>
                  <div className="text-sm text-gray-500">Average Home Price</div>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 text-lg">
                    {neighborhood.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodsSection;
