import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, User, MessageCircle, CheckCircle, XCircle, Edit3, Video, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConsultationBooking {
  id: string;
  offer_intent_id: string;
  agent_id: string;
  buyer_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  meeting_link?: string;
  agent_notes?: string;
  buyer_notes?: string;
  created_at: string;
  updated_at: string;
  // Related data
  offer_intents?: {
    property_address: string;
    offer_type: string;
  };
  buyer_profile?: {
    first_name: string;
    last_name: string;
    phone?: string;
  };
  buyer_email?: string;
}

interface AgentConsultationManagerProps {
  agentId: string;
}

const AgentConsultationManager = ({ agentId }: AgentConsultationManagerProps) => {
  const [consultations, setConsultations] = useState<ConsultationBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationBooking | null>(null);
  const [agentNotes, setAgentNotes] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConsultations();
  }, [agentId]);

  const fetchConsultations = async () => {
    try {
      // Fetch consultations with related offer and buyer data
      const { data: consultationsData, error } = await supabase
        .from('consultation_bookings')
        .select(`
          *,
          offer_intents!inner(
            property_address,
            offer_type
          )
        `)
        .eq('agent_id', agentId)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      // Fetch buyer profiles and emails for each consultation
      const enrichedConsultations = await Promise.all(
        (consultationsData || []).map(async (consultation) => {
          // Get buyer profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, phone')
            .eq('id', consultation.buyer_id)
            .single();

          // Get buyer email from auth.users
          const { data: authUser } = await supabase.auth.admin.getUserById(consultation.buyer_id);

          return {
            ...consultation,
            buyer_profile: profile,
            buyer_email: authUser?.user?.email
          };
        })
      );

      setConsultations(enrichedConsultations);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast({
        title: "Error",
        description: "Failed to load consultations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (consultationId: string, status: string, notes?: string, link?: string) => {
    setUpdating(true);
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      if (notes !== undefined) updateData.agent_notes = notes;
      if (link !== undefined) updateData.meeting_link = link;

      const { error } = await supabase
        .from('consultation_bookings')
        .update(updateData)
        .eq('id', consultationId);

      if (error) throw error;

      await fetchConsultations();
      
      toast({
        title: "Success",
        description: `Consultation ${status} successfully.`,
      });
    } catch (error) {
      console.error('Error updating consultation:', error);
      toast({
        title: "Error",
        description: "Failed to update consultation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const rescheduleConsultation = async (consultationId: string, newDateTime: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .update({
          scheduled_at: newDateTime,
          status: 'rescheduled',
          updated_at: new Date().toISOString()
        })
        .eq('id', consultationId);

      if (error) throw error;

      await fetchConsultations();
      
      toast({
        title: "Success",
        description: "Consultation rescheduled successfully.",
      });
    } catch (error) {
      console.error('Error rescheduling consultation:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule consultation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingConsultations = consultations.filter(c => 
    c.status === 'scheduled' && new Date(c.scheduled_at) > new Date()
  );

  const pastConsultations = consultations.filter(c => 
    c.status === 'completed' || new Date(c.scheduled_at) <= new Date()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Consultation Management</h2>
        <p className="text-gray-600 mt-1">Manage your scheduled buyer consultations</p>
      </div>

      {/* Upcoming Consultations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Upcoming Consultations ({upcomingConsultations.length})
        </h3>
        
        {upcomingConsultations.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Consultations</h4>
              <p className="text-gray-600">
                Your scheduled consultations will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingConsultations.map((consultation) => {
              const { date, time } = formatDateTime(consultation.scheduled_at);
              
              return (
                <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight">
                          {consultation.offer_intents?.property_address || 'Property Consultation'}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {consultation.buyer_profile ? 
                            `${consultation.buyer_profile.first_name} ${consultation.buyer_profile.last_name}` : 
                            'Buyer Consultation'
                          }
                        </p>
                      </div>
                      <Badge className={getStatusColor(consultation.status)}>
                        {consultation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{time} ({consultation.duration_minutes} mins)</span>
                      </div>
                      {consultation.buyer_profile?.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{consultation.buyer_profile.phone}</span>
                        </div>
                      )}
                    </div>

                    {consultation.meeting_link && (
                      <div className="p-3 bg-blue-50 rounded border border-blue-200">
                        <div className="flex items-center gap-2 text-sm text-blue-700">
                          <Video className="w-4 h-4" />
                          <span>Meeting Link: {consultation.meeting_link}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedConsultation(consultation);
                              setAgentNotes(consultation.agent_notes || '');
                              setMeetingLink(consultation.meeting_link || '');
                            }}
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Manage Consultation</DialogTitle>
                          </DialogHeader>
                          
                          {selectedConsultation && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Meeting Link</label>
                                <Input
                                  value={meetingLink}
                                  onChange={(e) => setMeetingLink(e.target.value)}
                                  placeholder="https://zoom.us/j/..."
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Agent Notes</label>
                                <Textarea
                                  value={agentNotes}
                                  onChange={(e) => setAgentNotes(e.target.value)}
                                  placeholder="Add notes about this consultation..."
                                  rows={3}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium">Reschedule (Optional)</label>
                                <div className="flex gap-2">
                                  <Input
                                    type="date"
                                    value={rescheduleDate}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                  />
                                  <Input
                                    type="time"
                                    value={rescheduleTime}
                                    onChange={(e) => setRescheduleTime(e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex gap-2 pt-4">
                                <Button
                                  onClick={() => updateConsultationStatus(
                                    selectedConsultation.id, 
                                    'scheduled', 
                                    agentNotes, 
                                    meetingLink
                                  )}
                                  disabled={updating}
                                  className="flex-1"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Update
                                </Button>
                                
                                {rescheduleDate && rescheduleTime && (
                                  <Button
                                    onClick={() => rescheduleConsultation(
                                      selectedConsultation.id,
                                      `${rescheduleDate}T${rescheduleTime}:00Z`
                                    )}
                                    disabled={updating}
                                    variant="outline"
                                  >
                                    Reschedule
                                  </Button>
                                )}
                                
                                <Button
                                  onClick={() => updateConsultationStatus(selectedConsultation.id, 'cancelled')}
                                  disabled={updating}
                                  variant="destructive"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        onClick={() => updateConsultationStatus(consultation.id, 'completed')}
                        disabled={updating}
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Consultations */}
      {pastConsultations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Past Consultations ({pastConsultations.length})
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pastConsultations.map((consultation) => {
              const { date, time } = formatDateTime(consultation.scheduled_at);
              
              return (
                <Card key={consultation.id} className="opacity-75">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight">
                          {consultation.offer_intents?.property_address || 'Property Consultation'}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {consultation.buyer_profile ? 
                            `${consultation.buyer_profile.first_name} ${consultation.buyer_profile.last_name}` : 
                            'Buyer Consultation'
                          }
                        </p>
                      </div>
                      <Badge className={getStatusColor(consultation.status)}>
                        {consultation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{date} at {time}</span>
                      </div>
                      
                      {consultation.agent_notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded border">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                            <MessageCircle className="w-4 h-4" />
                            Agent Notes
                          </div>
                          <p className="text-sm text-gray-600">{consultation.agent_notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentConsultationManager;