
export type ShowingStatus =
  | 'submitted'
  | 'under_review'
  | 'agent_requested'
  | 'agent_assigned'
  | 'pending_admin_approval'
  | 'confirmed'
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'pending'; // legacy status

export const SHOWING_STATUS_VALUES: readonly ShowingStatus[] = [
  'pending',
  'submitted',
  'under_review',
  'agent_requested',
  'agent_assigned',
  'pending_admin_approval',
  'confirmed',
  'scheduled',
  'completed',
  'cancelled'
];

export const isValidShowingStatus = (value: string): value is ShowingStatus =>
  SHOWING_STATUS_VALUES.includes(value as ShowingStatus);

export interface StatusInfo {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  isActive: boolean;
}

export const getStatusInfo = (status: ShowingStatus): StatusInfo => {
  const statusMap: Record<ShowingStatus, StatusInfo> = {
    submitted: {
      label: 'Submitted',
      description: 'Your request has been received and is being reviewed',
      color: 'text-blue-800',
      bgColor: 'bg-blue-100',
      icon: '📝',
      isActive: false
    },
    under_review: {
      label: 'Under Review',
      description: 'Our team is reviewing your request and finding the best showing partner',
      color: 'text-orange-800',
      bgColor: 'bg-orange-100',
      icon: '🔍',
      isActive: false
    },
    agent_requested: {
      label: 'Agent Requested',
      description: 'A licensed agent has requested to handle this showing',
      color: 'text-indigo-800',
      bgColor: 'bg-indigo-100',
      icon: '🙋',
      isActive: false
    },
    agent_assigned: {
      label: 'Agent Assigned',
      description: 'A licensed showing partner has been assigned to your request',
      color: 'text-purple-800',
      bgColor: 'bg-purple-100',
      icon: '👤',
      isActive: false
    },
    pending_admin_approval: {
      label: 'Pending Admin Approval',
      description: 'The agent has accepted, awaiting final approval from admin.',
      color: 'text-yellow-800',
      bgColor: 'bg-yellow-100',
      icon: '⏳',
      isActive: false
    },
    confirmed: {
      label: 'Confirmed',
      description: 'Your showing has been confirmed and scheduled',
      color: 'text-green-800',
      bgColor: 'bg-green-100',
      icon: '✅',
      isActive: true
    },
    scheduled: {
      label: 'Scheduled',
      description: 'Your showing is coming up soon',
      color: 'text-green-800',
      bgColor: 'bg-green-100',
      icon: '📅',
      isActive: true
    },
    completed: {
      label: 'Completed',
      description: 'Your showing has been completed',
      color: 'text-gray-800',
      bgColor: 'bg-gray-100',
      icon: '🏁',
      isActive: false
    },
    cancelled: {
      label: 'Cancelled',
      description: 'This showing has been cancelled',
      color: 'text-red-800',
      bgColor: 'bg-red-100',
      icon: '❌',
      isActive: false
    },
    pending: {
      label: 'Awaiting Review',
      description: 'Request received and awaiting agent assignment',
      color: 'text-yellow-800',
      bgColor: 'bg-yellow-100',
      icon: '⏳',
      isActive: false
    }
  };

  return statusMap[status] || statusMap.pending;
};

export const getEstimatedTimeline = (status: ShowingStatus): string => {
  const timelineMap: Record<ShowingStatus, string> = {
    submitted: 'We typically respond within 2-4 hours',
    under_review: 'Agent assignment usually takes 4-8 hours',
    agent_requested: 'Admin reviewing agent request',
    agent_assigned: 'Your agent will contact you within 2 hours',
    pending_admin_approval: 'Awaiting final admin approval',
    confirmed: 'All set! See you at the showing',
    scheduled: 'All set! See you at the showing',
    completed: 'Thank you for using FirstLook!',
    cancelled: 'You can submit a new request anytime',
    pending: 'We typically assign agents within 2-4 hours'
  };

  return timelineMap[status] || timelineMap.pending;
};

export const isActiveShowing = (status: ShowingStatus): boolean => {
  return ['confirmed', 'scheduled'].includes(status);
};

export const isPendingRequest = (status: ShowingStatus): boolean => {
  return ['submitted', 'under_review', 'pending'].includes(status);
};

export const canBeAssigned = (status: ShowingStatus): boolean => {
  return ['submitted', 'under_review', 'pending'].includes(status);
};

export const canRequestAssignment = (status: ShowingStatus): boolean => {
  return ['submitted', 'under_review', 'pending'].includes(status);
};

export const isAgentRequested = (status: ShowingStatus): boolean => {
  return status === 'agent_requested';
};
