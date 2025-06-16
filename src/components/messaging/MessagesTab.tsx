
import MessagingInterface from "./MessagingInterface";

interface MessagesTabProps {
  userId: string;
  userType: 'buyer' | 'agent';
}

const MessagesTab = ({ userId, userType }: MessagesTabProps) => {
  return (
    <MessagingInterface 
      userId={userId} 
      userType={userType}
      compact={false}
    />
  );
};

export default MessagesTab;
