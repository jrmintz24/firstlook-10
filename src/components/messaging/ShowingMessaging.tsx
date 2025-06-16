
import MessagingInterface from "./MessagingInterface";

interface ShowingMessagingProps {
  userId: string;
  userType: 'buyer' | 'agent';
  showingRequestId: string;
  className?: string;
}

const ShowingMessaging = ({ 
  userId, 
  userType, 
  showingRequestId, 
  className 
}: ShowingMessagingProps) => {
  return (
    <MessagingInterface 
      userId={userId} 
      userType={userType}
      compact={true}
      specificShowingId={showingRequestId}
      className={className}
    />
  );
};

export default ShowingMessaging;
