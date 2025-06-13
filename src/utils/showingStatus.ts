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

export const getStatusInfo = (status: ShowingStatus) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        color: 'text-orange-800',
        bgColor: 'bg-orange-100',
        icon: '⏳',
        description: 'Your request has been submitted and is waiting for agent assignment.'
      };
    case 'submitted':
      return {
        label: 'Submitted',
        color: 'text-blue-800',
        bgColor: 'bg-blue-100',
        icon: '📤',
        description: 'Request submitted and under review.'
      };
    case 'under_review':
      return {
        label: 'Under Review',
        color: 'text-purple-800',
        bgColor: 'bg-purple-100',
        icon: '👀',
        description: 'Our team is reviewing your showing request.'
      };
    case 'agent_assigned':
      return {
        label: 'Agent Assigned',
        color: 'text-blue-800',
        bgColor: 'bg-blue-100',
        icon: '👤',
        description: 'An agent has been assigned to your request.'
      };
    case 'pending_admin_approval':
      return {
        label: 'Pending Approval',
        color: 'text-purple-800',
        bgColor: 'bg-purple-100',
        icon: '⏱️',
        description: 'Agent assignment is pending admin approval.'
      };
    case 'agent_confirmed':
      return {
        label: 'Agent Confirmed',
        color: 'text-green-800',
        bgColor: 'bg-green-100',
        icon: '✅',
        description: 'Your agent has confirmed the showing details and will contact you soon.'
      };
    case 'confirmed':
      return {
        label: 'Confirmed',
        color: 'text-green-800',
        bgColor: 'bg-green-100',
        icon: '✅',
        description: 'Your showing has been confirmed! Your agent will meet you at the scheduled time.'
      };
    case 'scheduled':
      return {
        label: 'Scheduled',
        color: 'text-green-800',
        bgColor: 'bg-green-100',
        icon: '📅',
        description: 'Showing is scheduled and confirmed.'
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        color: 'text-blue-800',
        bgColor: 'bg-blue-100',
        icon: '🏠',
        description: 'Your showing is currently taking place.'
      };
    case 'completed':
      return {
        label: 'Completed',
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        icon: '✓',
        description: 'Showing has been completed successfully.'
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        color: 'text-red-800',
        bgColor: 'bg-red-100',
        icon: '❌',
        description: 'This showing request has been cancelled.'
      };
    case 'no_show':
      return {
        label: 'No Show',
        color: 'text-red-800',
        bgColor: 'bg-red-100',
        icon: '⚠️',
        description: 'Showing was scheduled but attendee did not show up.'
      };
    default:
      return {
        label: 'Unknown',
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        icon: '❓',
        description: 'Status unknown.'
      };
  }
};

export const getEstimatedTimeline = (status: ShowingStatus): string => {
  switch (status) {
    case 'pending':
      return 'Agents typically respond within 2-4 hours';
    case 'submitted':
    case 'under_review':
      return 'Review typically takes 1-2 hours';
    case 'agent_assigned':
    case 'pending_admin_approval':
      return 'Approval and confirmation usually within 1-2 hours';
    case 'agent_confirmed':
      return 'Your agent will contact you soon to finalize details';
    case 'confirmed':
    case 'scheduled':
      return 'All set! See you at the showing';
    case 'in_progress':
      return 'Showing in progress';
    case 'completed':
      return 'Completed successfully';
    case 'cancelled':
    case 'no_show':
      return '';
    default:
      return '';
  }
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

export const isFinalStatus = (status: ShowingStatus): boolean => {
  return ['completed', 'cancelled'].includes(status);
};

export const isUnassignedRequest = (request: { 
  assigned_agent_name?: string | null; 
  assigned_agent_id?: string | null;
  requested_agent_name?: string | null;
  requested_agent_id?: string | null;
  status: string 
}): boolean => {
  // A request is unassigned if:
  // 1. No agent is currently assigned (both name and id are null/empty)
  // 2. No agent has requested assignment (both requested fields are null/empty)  
  // 3. It's not in agent_requested status (which means an agent has requested it)
  // 4. It's not in a final status (completed/cancelled)
  
  const hasAssignedAgent = !!(request.assigned_agent_name || request.assigned_agent_id);
  const hasRequestedAgent = !!(request.requested_agent_name || request.requested_agent_id);
  const isAgentRequestedStatus = request.status === 'agent_requested';
  const isNotFinalStatus = !isFinalStatus(request.status as ShowingStatus);
  
  // For unassigned tab: requests with no assignment and no pending agent request
  const isUnassigned = !hasAssignedAgent && !hasRequestedAgent && !isAgentRequestedStatus && isNotFinalStatus;
  
  return isUnassigned;
};
