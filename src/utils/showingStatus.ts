import { CalendarDays, Hourglass, CheckCircle, AlertTriangle } from 'lucide-react';

export type ShowingStatusCategory = 'pending' | 'active' | 'completed' | 'cancelled';

export type ShowingStatus = 
  | 'pending' 
  | 'submitted' 
  | 'under_review' 
  | 'agent_assigned' 
  | 'agent_confirmed'
  | 'awaiting_agreement'
  | 'confirmed' 
  | 'scheduled' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled'
  | 'no_show';

interface StatusInfo {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
  category: ShowingStatusCategory;
}

export const getStatusInfo = (status: ShowingStatus): StatusInfo => {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        icon: '🕒',
        description: 'Your request is pending review. We\'re finding the best agent for you.',
        category: 'pending'
      };
    case 'submitted':
      return {
        label: 'Submitted',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        icon: '📝',
        description: 'Your request has been submitted and is awaiting review.',
        category: 'pending'
      };
    case 'under_review':
      return {
        label: 'Under Review',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
        icon: '🔍',
        description: 'Your request is being reviewed by our team.',
        category: 'pending'
      };
    case 'agent_assigned':
      return {
        label: 'Agent Assigned',
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-100',
        icon: '🤝',
        description: 'An agent has been assigned to your request and will contact you soon.',
        category: 'pending'
      };
    case 'agent_confirmed':
      return {
        label: 'Agent Confirmed',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        icon: '✅',
        description: 'Your request has been confirmed by the agent. Awaiting your confirmation.',
        category: 'active'
      };
    case 'awaiting_agreement':
      return {
        label: 'Agreement Required',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100',
        icon: '📋',
        description: 'Agent has confirmed your tour. Please sign the tour agreement to finalize your appointment.',
        category: 'pending'
      };
    case 'confirmed':
      return {
        label: 'Confirmed',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        icon: '✅',
        description: 'Your request has been confirmed and scheduled.',
        category: 'active'
      };
    case 'scheduled':
      return {
        label: 'Scheduled',
        color: 'text-teal-700',
        bgColor: 'bg-teal-100',
        icon: '📅',
        description: 'Your showing has been scheduled. Get ready to tour!',
        category: 'active'
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
        icon: '🚀',
        description: 'Your showing is currently in progress.',
        category: 'active'
      };
    case 'completed':
      return {
        label: 'Completed',
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
        icon: '🏁',
        description: 'Your showing has been completed.',
        category: 'completed'
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        icon: '❌',
        description: 'Your showing has been cancelled.',
        category: 'cancelled'
      };
      case 'no_show':
        return {
          label: 'No Show',
          color: 'text-orange-700',
          bgColor: 'bg-orange-100',
          icon: '⚠️',
          description: 'Buyer did not show up for the showing.',
          category: 'cancelled'
        };
    default:
      return {
        label: 'Unknown',
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
        icon: '❓',
        description: 'Unknown status.',
        category: 'pending'
      };
  }
};

export const getStatusIcon = (status: ShowingStatus) => {
  switch (status) {
    case "pending":
    case "submitted":
    case "under_review":
    case "agent_assigned":
      return CalendarDays;
    case "confirmed":
    case "agent_confirmed":
    case "scheduled":
      return CheckCircle;
    case "in_progress":
      return Hourglass;
    case "cancelled":
    case "no_show":
      return AlertTriangle;
    default:
      return CalendarDays;
  }
};

export const getEstimatedTimeline = (status: ShowingStatus): string => {
  switch (status) {
    case 'pending':
      return 'We are currently processing your request. Please allow 24-48 hours for confirmation.';
    case 'submitted':
      return 'Your request is awaiting review. We will update you shortly.';
    case 'under_review':
      return 'Our team is reviewing your request to find the best agent match.';
    case 'agent_assigned':
      return 'An agent has been assigned and will be in touch to schedule your tour.';
    case 'agent_confirmed':
      return 'Please confirm the scheduled time with your agent.';
    case 'awaiting_agreement':
      return 'Please sign the agreement within 7 days to secure your tour slot';
    case 'confirmed':
      return 'Your tour is confirmed! Check your email for details.';
    case 'scheduled':
      return 'Get ready for your tour! Your agent will meet you at the property.';
    case 'in_progress':
      return 'Enjoy your tour! Provide feedback afterward to help us improve.';
    case 'completed':
      return 'Thank you for touring with us! We hope you found your dream home.';
    case 'cancelled':
      return 'Your tour has been cancelled. Contact us if you have any questions.';
    case 'no_show':
      return 'The showing was marked as a no-show. Please reschedule if you\'re still interested.';
    default:
      return 'Status timeline unavailable.';
  }
};
