
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, User, Search, X, Home } from "lucide-react";

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  assigned_agent_name?: string | null;
  assigned_agent_phone?: string | null;
  assigned_agent_email?: string | null;
  assigned_agent_id?: string | null;
  created_at: string;
}

interface PropertySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertySelect: (showing: ShowingRequest) => void;
  completedShowings: ShowingRequest[];
}

const PropertySelectionModal = ({ 
  isOpen, 
  onClose, 
  onPropertySelect, 
  completedShowings 
}: PropertySelectionModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredShowings = completedShowings.filter(showing =>
    showing.property_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (showing.assigned_agent_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handlePropertySelect = (showing: ShowingRequest) => {
    onPropertySelect(showing);
    onClose();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] bg-white border-0 shadow-2xl p-0 flex flex-col">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-8 pt-8 pb-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-light text-gray-900">
                    Make an Offer
                  </DialogTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Select a property from your completed tours
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties or agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-0"
              />
            </div>
          </DialogHeader>

          {/* Scrollable content */}
          <div className="px-8 flex-1 overflow-y-auto max-h-[calc(80vh-240px)]">
            {filteredShowings.length === 0 ? (
              <div className="text-center py-12">
                {completedShowings.length === 0 ? (
                  <div className="text-gray-500">
                    <Home className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Tours</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      You need to complete at least one tour before you can make an offer.
                    </p>
                    <Button onClick={onClose} variant="outline">
                      Schedule Your First Tour
                    </Button>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
                    <p className="text-sm text-gray-600">
                      Try adjusting your search terms.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
                {filteredShowings.map((showing) => (
                  <Card 
                    key={showing.id} 
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-green-300"
                    onClick={() => handlePropertySelect(showing)}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Property Address */}
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                              {showing.property_address}
                            </h3>
                          </div>
                        </div>

                        {/* Tour Details */}
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Toured on {formatDate(showing.preferred_date)}
                            {showing.preferred_time && ` at ${showing.preferred_time}`}
                          </span>
                        </div>

                        {/* Agent Info */}
                        {showing.assigned_agent_name && (
                          <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Agent: {showing.assigned_agent_name}
                            </span>
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="flex justify-between items-center">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Tour Completed
                          </Badge>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePropertySelect(showing);
                            }}
                          >
                            Select Property
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {filteredShowings.length} {filteredShowings.length === 1 ? 'property' : 'properties'} available
              </div>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertySelectionModal;
