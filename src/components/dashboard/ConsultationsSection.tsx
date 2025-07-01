
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Video, Phone } from "lucide-react";
import ConsultationCard from "./ConsultationCard";
import EmptyStateCard from "./EmptyStateCard";

interface Consultation {
  id: string;
  propertyAddress: string;
  scheduledAt: string;
  consultationType: 'phone' | 'video';
  agentName?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface ConsultationsSectionProps {
  consultations: Consultation[];
  onJoinCall?: (consultationId: string) => void;
  onReschedule?: (consultationId: string) => void;
}

const ConsultationsSection = ({
  consultations,
  onJoinCall,
  onReschedule
}: ConsultationsSectionProps) => {
  const upcomingConsultations = consultations.filter(c => 
    c.status === 'scheduled' && new Date(c.scheduledAt) >= new Date()
  );

  const pastConsultations = consultations.filter(c => 
    c.status === 'completed' || c.status === 'cancelled' || 
    (c.status === 'scheduled' && new Date(c.scheduledAt) < new Date())
  );

  if (consultations.length === 0) {
    return (
      <EmptyStateCard
        title="No Consultations Yet"
        description="Agent consultations will appear here after you schedule them through property offers."
        buttonText=""
        onButtonClick={() => {}}
        icon={Calendar}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Consultations */}
      {upcomingConsultations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              Upcoming Consultations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingConsultations.map((consultation) => (
              <ConsultationCard
                key={consultation.id}
                {...consultation}
                onJoinCall={() => onJoinCall?.(consultation.id)}
                onReschedule={() => onReschedule?.(consultation.id)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Past Consultations */}
      {pastConsultations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-600">
              <Calendar className="h-5 w-5 text-gray-500" />
              Past Consultations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pastConsultations.map((consultation) => (
              <ConsultationCard
                key={consultation.id}
                {...consultation}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsultationsSection;
