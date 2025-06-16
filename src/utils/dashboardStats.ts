
import { Calendar, MessageCircle, CheckCircle } from "lucide-react";

export const generateBuyerStats = (
  pendingRequests: any[],
  activeShowings: any[],
  completedShowings: any[],
  unreadCount: number
) => {
  return [
    {
      value: pendingRequests.length + activeShowings.length,
      label: "Active Tours",
      subtitle: pendingRequests.length > 0 ? "Awaiting confirmation" : activeShowings.length > 0 ? "Ready to tour" : "No active tours",
      icon: Calendar,
      iconColor: "text-blue-500",
      status: pendingRequests.length > 0 ? 'urgent' as const : 'normal' as const,
      actionable: true,
      targetTab: "active"
    },
    {
      value: unreadCount > 0 ? unreadCount : "0",
      label: "Messages",
      subtitle: unreadCount > 0 ? "Needs attention" : "All caught up",
      icon: MessageCircle,
      iconColor: "text-purple-500",
      status: unreadCount > 0 ? 'urgent' as const : 'normal' as const,
      actionable: true,
      targetTab: "messages"
    },
    {
      value: completedShowings.filter(s => s.status === 'completed').length,
      label: "Completed",
      subtitle: "Properties viewed",
      icon: CheckCircle,
      iconColor: "text-green-500",
      status: 'success' as const,
      actionable: true,
      targetTab: "history"
    }
  ];
};
