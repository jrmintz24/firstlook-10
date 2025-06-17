
export interface Message {
  id: string;
  showing_request_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  access_expires_at?: string | null;
  read_at?: string | null;
}

export interface MessageWithShowing extends Message {
  showing_request?: {
    property_address: string;
    status: string;
  };
  sender_profile?: {
    first_name: string;
    last_name: string;
    user_type: string;
  };
}
