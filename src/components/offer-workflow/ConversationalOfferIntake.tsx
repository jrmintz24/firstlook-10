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
      message: `Hey there! 👋 So excited to help you snag ${propertyAddress}! Let's get you prepped for your consultation with our real estate expert. First things first - what's your name?`,
      field: 'contactName',
      inputType: 'text' as const,
      validation: (value: string) => value.length < 2 ? 'Come on, give me your real name! 😊' : null
    },
    {
      id: 'phone',
      message: "Nice to meet you! What's the best number to reach you at? (Don't worry, we're not gonna spam you 😉)",
      field: 'contactPhone',
      inputType: 'text' as const,
      validation: (value: string) => !/^\(\d{3}\)\s\d{3}-\d{4}$|^\d{10}$/.test(value.replace(/\D/g, '')) ? 'Hmm, that doesn\'t look like a real phone number 🤔' : null
    },
    {
      id: 'consultation-type',
      message: "Perfect! How do you want to chat with our expert? Video calls are pretty cool these days! 📹",
      field: 'consultationType',
      inputType: 'select' as const,
      options: ['Video Call 📹', 'Phone Call 📞']
    },
    {
      id: 'budget',
      message: "Alright, let's talk money! 💰 What's your max budget for this place? (Just throw me a number like 750000 - no commas needed!)",
      field: 'budgetMax',
      inputType: 'number' as const,
      validation: (value: string) => {
        const num = parseInt(value.replace(/[,$]/g, ''));
        return isNaN(num) || num < 50000 ? 'That seems a bit low for a house 🏠 Try a realistic number!' : null;
      }
    },
    {
      id: 'down-payment',
      message: "Sweet! Now how much cash are you bringing to the party for your down payment? 💸",
      field: 'downPaymentAmount',
      inputType: 'number' as const,
      validation: (value: string) => {
        const num = parseInt(value.replace(/[,$]/g, ''));
        return isNaN(num) || num < 1000 ? 'Need a real number here! Even $1000 counts 😊' : null;
      }
    },
    {
      id: 'pre-approval',
      message: "How's your lending situation looking? Are you all set with pre-approval? 📋",
      field: 'preApprovalStatus',
      inputType: 'select' as const,
      options: ['✅ Already pre-approved!', '⏳ Working on it...', '😅 Haven\'t started yet']
    },
    {
      id: 'over-asking',
      message: "Real talk - if this becomes a bidding war 🥊, how much over asking price would you go? (Put 0 if you're sticking to list price)",
      field: 'maxOverAskingPrice',
      inputType: 'number' as const,
      validation: (value: string) => {
        const num = parseInt(value.replace(/[,$]/g, ''));
        return isNaN(num) ? 'Just need a number! Even 0 is cool if you won\'t go over 😎' : null;
      }
    },
    {
      id: 'closing-flexibility',
      message: "How chill are you about the closing date? Some flexibility can make your offer more attractive! 📅",
      field: 'flexibleClosingDate',
      inputType: 'select' as const,
      options: ['🤸 Super flexible!', '😌 Somewhat flexible', '📍 Need a specific date']
    },
    {
      id: 'deal-breakers',
      message: "What would totally kill the deal for you during inspection? Think big scary stuff like foundation issues, roof problems, etc. (Or just say 'nothing major' if you're not sure!)",
      field: 'inspectionDealBreakers',
      inputType: 'text' as const,
      validation: () => null // Optional field
    },
    {
      id: 'questions',
      message: "Last thing! Got any burning questions about this house or the whole offer thing? Now's your chance! 🔥 (Or just say 'nope' if you're good!)",
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
      else if (value.includes('Working')) processedValue = 'pending';
      else processedValue = 'not_started';
    } else if (field === 'flexibleClosingDate') {
      if (value.includes('Super')) processedValue = 'yes';
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
        addBotMessage("Yesss! 🎉 I've got everything I need to make you look like a total boss to our expert! Ready to lock in that consultation? Let's gooo! 🚀", ['🗓️ Schedule Now']);
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
    if (isComplete && option.includes('Schedule Now')) {
      // Move to scheduling step
      addUserMessage(option);
      addBotMessage("Amazing! Here are some perfect times for your consultation. Pick what works best! ⏰");
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
        addBotMessage("BOOM! 💥 You're all set! Check your email for the deets and get ready to make an offer that'll blow their minds! Our expert is gonna help you absolutely crush this! 🏆✨");
        setTimeout(() => {
          onClose();
        }, 4000);
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
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md mx-auto h-[90vh] flex flex-col bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-6 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">✨ Offer Assistant</h3>
                <p className="text-xs opacity-90">Let's get this bread! 🏠💰</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
            >
              <span className="text-lg">×</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white/50 to-purple-50/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[75%] ${message.type === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`rounded-2xl px-4 py-3 shadow-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto'
                      : 'bg-white text-gray-800 border border-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                  
                {/* Options */}
                {message.options && message.type === 'bot' && !showScheduling && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
                </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
              </div>
            ))}

            {/* Scheduling UI */}
            {showScheduling && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl p-4 max-w-[75%] shadow-lg border border-gray-100">
                  <p className="text-sm mb-3 text-gray-800">Pick your perfect time! 📅</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableSlots.slice(0, 8).map((slot, index) => {
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
                        <button
                          key={index}
                          onClick={() => handleScheduleSlot(slot)}
                          className="w-full p-3 text-left bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 transform hover:scale-[1.02] shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-800">
                              {formatDate(slot.datetime)} at {formatTime(slot.datetime)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

        {/* Input */}
        {!isComplete && !isTyping && !showScheduling && (
          <div className="p-6 bg-white/80 backdrop-blur-lg border-t border-white/20">
            <form onSubmit={handleSubmit} className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                disabled={!currentInput.trim()}
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}

        {/* Progress indicator */}
        <div className="px-6 py-4 bg-white/60 backdrop-blur-lg border-t border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">
              Step {Math.min(currentStep + 1, conversationFlow.length)} of {conversationFlow.length}
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: conversationFlow.length }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationalOfferIntake;