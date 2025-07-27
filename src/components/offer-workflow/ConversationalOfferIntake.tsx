import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, CheckCircle, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  options?: string[];
  inputType?: 'text' | 'number' | 'select' | 'date' | 'time';
  field?: string;
  validation?: (value: string) => string | null;
}

interface OfferData {
  // Contact Info
  contactName: string;
  contactPhone: string;
  consultationType: 'video' | 'phone';
  
  // Scheduling
  selectedDate?: Date;
  selectedTime?: string;
  
  // Financial
  budgetMax?: number;
  downPaymentAmount?: number;
  preApprovalStatus: 'approved' | 'pending' | 'not_started';
  
  // Strategy
  maxOverAskingPrice?: number;
  flexibleClosingDate: 'yes' | 'no' | 'somewhat';
  inspectionDealBreakers: string;
  specificQuestions: string;
}

interface ConversationalOfferIntakeProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress: string;
  buyerId: string;
  agentId?: string;
}

const ConversationalOfferIntake = ({
  isOpen,
  onClose,
  propertyAddress,
  buyerId,
  agentId
}: ConversationalOfferIntakeProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [offerData, setOfferData] = useState<OfferData>({
    contactName: '',
    contactPhone: '',
    consultationType: 'video',
    preApprovalStatus: 'not_started',
    flexibleClosingDate: 'somewhat',
    inspectionDealBreakers: '',
    specificQuestions: ''
  });
  const [isComplete, setIsComplete] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<Array<{datetime: Date, available: boolean}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const conversationFlow = [
    {
      id: 'welcome',
      message: `Hi! I'm here to help you prepare an offer for ${propertyAddress}. Let's have a quick conversation to get everything ready for your consultation with our expert. First, what's your full name?`,
      field: 'contactName',
      inputType: 'text' as const,
      validation: (value: string) => value.length < 2 ? 'Please enter your full name' : null
    },
    {
      id: 'phone',
      message: "Perfect! Now what's the best phone number to reach you at?",
      field: 'contactPhone',
      inputType: 'text' as const,
      validation: (value: string) => !/^\(\d{3}\)\s\d{3}-\d{4}$|^\d{10}$/.test(value.replace(/\D/g, '')) ? 'Please enter a valid phone number' : null
    },
    {
      id: 'consultation-type',
      message: "Great! Would you prefer a video call or phone call for your consultation?",
      field: 'consultationType',
      inputType: 'select' as const,
      options: ['Video Call', 'Phone Call']
    },
    {
      id: 'budget',
      message: "Now let's talk about your budget. What's the maximum amount you're comfortable spending on this property? (Just enter the number, like 750000)",
      field: 'budgetMax',
      inputType: 'number' as const,
      validation: (value: string) => {
        const num = parseInt(value.replace(/[,$]/g, ''));
        return isNaN(num) || num < 50000 ? 'Please enter a realistic budget amount (minimum $50,000)' : null;
      }
    },
    {
      id: 'down-payment',
      message: "How much are you planning to put down as a down payment? (Enter amount like 150000)",
      field: 'downPaymentAmount',
      inputType: 'number' as const,
      validation: (value: string) => {
        const num = parseInt(value.replace(/[,$]/g, ''));
        return isNaN(num) || num < 1000 ? 'Please enter a valid down payment amount' : null;
      }
    },
    {
      id: 'pre-approval',
      message: "What's your current pre-approval status with a lender?",
      field: 'preApprovalStatus',
      inputType: 'select' as const,
      options: ['I\'m already pre-approved', 'Application in progress', 'Haven\'t started yet']
    },
    {
      id: 'over-asking',
      message: "If this turns into a bidding situation, what's the maximum amount over asking price you'd be willing to go? (Enter 0 if you won't go over asking price)",
      field: 'maxOverAskingPrice',
      inputType: 'number' as const,
      validation: (value: string) => {
        const num = parseInt(value.replace(/[,$]/g, ''));
        return isNaN(num) ? 'Please enter an amount (or 0 if you won\'t go over asking)' : null;
      }
    },
    {
      id: 'closing-flexibility',
      message: "Are you flexible on the closing date?",
      field: 'flexibleClosingDate',
      inputType: 'select' as const,
      options: ['Very flexible', 'Somewhat flexible', 'Need a specific date']
    },
    {
      id: 'deal-breakers',
      message: "What are some inspection issues that would be deal-breakers for you? (e.g., foundation problems, roof issues, electrical)",
      field: 'inspectionDealBreakers',
      inputType: 'text' as const,
      validation: () => null // Optional field
    },
    {
      id: 'questions',
      message: "Finally, do you have any specific questions or concerns about this property or the offer process?",
      field: 'specificQuestions',
      inputType: 'text' as const,
      validation: () => null // Optional field
    }
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Start the conversation
      addBotMessage(conversationFlow[0].message);
    }
  }, [isOpen]);

  // Generate available time slots
  useEffect(() => {
    const slots: Array<{datetime: Date, available: boolean}> = [];
    const now = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      for (let hour = 9; hour < 17; hour++) {
        for (let minute of [0, 30]) {
          const slotTime = new Date(date);
          slotTime.setHours(hour, minute, 0, 0);
          
          if (slotTime > now) {
            slots.push({
              datetime: slotTime,
              available: true
            });
          }
        }
      }
    }
    
    setAvailableSlots(slots);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (content: string, options?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      const message: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: new Date(),
        options,
        inputType: conversationFlow[currentStep]?.inputType,
        field: conversationFlow[currentStep]?.field,
        validation: conversationFlow[currentStep]?.validation
      };
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    }, 1000);
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const handleUserInput = (value: string) => {
    const currentStepData = conversationFlow[currentStep];
    if (!currentStepData) return;

    // Validate input
    if (currentStepData.validation) {
      const error = currentStepData.validation(value);
      if (error) {
        addBotMessage(`${error} Please try again.`);
        return;
      }
    }

    // Add user message
    addUserMessage(value);

    // Update offer data
    const field = currentStepData.field as keyof OfferData;
    let processedValue: any = value;

    // Process value based on field type
    if (field === 'budgetMax' || field === 'downPaymentAmount' || field === 'maxOverAskingPrice') {
      processedValue = parseInt(value.replace(/[,$]/g, ''));
    } else if (field === 'consultationType') {
      processedValue = value.toLowerCase().includes('video') ? 'video' : 'phone';
    } else if (field === 'preApprovalStatus') {
      if (value.includes('pre-approved')) processedValue = 'approved';
      else if (value.includes('progress')) processedValue = 'pending';
      else processedValue = 'not_started';
    } else if (field === 'flexibleClosingDate') {
      if (value.includes('Very')) processedValue = 'yes';
      else if (value.includes('specific')) processedValue = 'no';
      else processedValue = 'somewhat';
    }

    setOfferData(prev => ({ ...prev, [field]: processedValue }));

    // Move to next step
    const nextStep = currentStep + 1;
    if (nextStep < conversationFlow.length) {
      setCurrentStep(nextStep);
      setTimeout(() => {
        addBotMessage(conversationFlow[nextStep].message, conversationFlow[nextStep].options);
      }, 500);
    } else {
      // Conversation complete
      setTimeout(() => {
        addBotMessage("Perfect! I have all the information I need. Now let's schedule your consultation call.", ['Schedule Now']);
        setIsComplete(true);
      }, 500);
    }

    setCurrentInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      handleUserInput(currentInput.trim());
    }
  };

  const handleOptionClick = (option: string) => {
    if (isComplete && option === 'Schedule Now') {
      // Move to scheduling step
      addUserMessage(option);
      addBotMessage("Perfect! Let me show you some available times for your consultation.");
      setShowScheduling(true);
      return;
    }
    handleUserInput(option);
  };

  const handleScheduleSlot = async (slot: {datetime: Date, available: boolean}) => {
    if (!slot.available) return;

    setOfferData(prev => ({
      ...prev,
      selectedDate: slot.datetime,
      selectedTime: slot.datetime.toTimeString().slice(0, 5)
    }));

    const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });

    const formatTime = (date: Date) => date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    addUserMessage(`${formatDate(slot.datetime)} at ${formatTime(slot.datetime)}`);
    addBotMessage(`Excellent! I've scheduled your consultation for ${formatDate(slot.datetime)} at ${formatTime(slot.datetime)}. I'm now creating your consultation booking...`);

    // Create the booking
    try {
      // Create offer intent
      const { data: offerIntent, error: offerError } = await supabase
        .from('offer_intents')
        .insert({
          buyer_id: buyerId,
          agent_id: agentId || buyerId,
          property_address: propertyAddress,
          offer_type: agentId ? 'agent_assisted' : 'consultation_request',
          contract_type: propertyAddress.includes('Montgomery') ? 'gcaar' : 
                       propertyAddress.includes('DC') || propertyAddress.includes('Washington') ? 'gcaar' : 'mar'
        })
        .select()
        .single();

      if (offerError) throw offerError;

      // Create consultation booking
      const { data: booking, error: bookingError } = await supabase
        .from('consultation_bookings')
        .insert({
          buyer_id: buyerId,
          agent_id: agentId || buyerId,
          offer_intent_id: offerIntent.id,
          scheduled_at: slot.datetime.toISOString(),
          duration_minutes: 30,
          status: 'scheduled',
          buyer_notes: JSON.stringify(offerData)
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      toast({
        title: "Consultation Scheduled!",
        description: `Your expert consultation is scheduled for ${formatDate(slot.datetime)} at ${formatTime(slot.datetime)}`,
      });

      setTimeout(() => {
        addBotMessage("🎉 All set! Your consultation has been scheduled and you'll receive a confirmation email shortly. Our expert will call you at the scheduled time to discuss your offer strategy. Thanks for using FirstLook!");
        setTimeout(() => {
          onClose();
        }, 3000);
      }, 1000);

    } catch (error) {
      console.error('Error scheduling consultation:', error);
      toast({
        title: "Error",
        description: "Failed to schedule consultation. Please try again.",
        variant: "destructive"
      });
      addBotMessage("I'm sorry, there was an error scheduling your consultation. Please try selecting a different time.");
    }
  };

  const formatValue = (value: any, field: string) => {
    if (field === 'budgetMax' || field === 'downPaymentAmount' || field === 'maxOverAskingPrice') {
      return `$${value?.toLocaleString() || '0'}`;
    }
    return value?.toString() || '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-white text-blue-600">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">FirstLook Offer Assistant</h3>
                  <p className="text-xs opacity-90">Let's prepare your offer strategy</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                ×
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  
                  {/* Options */}
                  {message.options && message.type === 'bot' && !showScheduling && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleOptionClick(option)}
                          className="text-xs"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {message.type === 'user' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-green-100 text-green-600">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Scheduling UI */}
            {showScheduling && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                  <p className="text-sm mb-3">Choose a time that works for you:</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableSlots.slice(0, 10).map((slot, index) => {
                      const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      });
                      const formatTime = (date: Date) => date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      });

                      return (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleScheduleSlot(slot)}
                          className="w-full justify-start text-left hover:bg-blue-50"
                        >
                          <Calendar className="h-3 w-3 mr-2" />
                          {formatDate(slot.datetime)} at {formatTime(slot.datetime)}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {!isComplete && !isTyping && !showScheduling && (
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Type your answer..."
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit" size="sm" disabled={!currentInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}

          {/* Progress indicator */}
          <div className="px-4 py-2 bg-gray-50 border-t">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Step {Math.min(currentStep + 1, conversationFlow.length)} of {conversationFlow.length}</span>
              <div className="flex gap-1">
                {Array.from({ length: conversationFlow.length }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationalOfferIntake;