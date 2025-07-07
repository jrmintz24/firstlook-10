export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agent_availability: {
        Row: {
          agent_id: string
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_feedback: {
        Row: {
          agent_id: string
          buyer_id: string
          buyer_interest_level: number | null
          buyer_seriousness_rating: number | null
          created_at: string
          id: string
          notes: string | null
          recommend_buyer: boolean | null
          showing_request_id: string
        }
        Insert: {
          agent_id: string
          buyer_id: string
          buyer_interest_level?: number | null
          buyer_seriousness_rating?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          recommend_buyer?: boolean | null
          showing_request_id: string
        }
        Update: {
          agent_id?: string
          buyer_id?: string
          buyer_interest_level?: number | null
          buyer_seriousness_rating?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          recommend_buyer?: boolean | null
          showing_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_feedback_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_feedback_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_feedback_showing_request_id_fkey"
            columns: ["showing_request_id"]
            isOneToOne: false
            referencedRelation: "showing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_notifications: {
        Row: {
          agent_id: string
          buyer_id: string
          created_at: string
          id: string
          message: string
          metadata: Json | null
          notification_type: string
          read_at: string | null
          showing_request_id: string | null
        }
        Insert: {
          agent_id: string
          buyer_id: string
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          notification_type: string
          read_at?: string | null
          showing_request_id?: string | null
        }
        Update: {
          agent_id?: string
          buyer_id?: string
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          notification_type?: string
          read_at?: string | null
          showing_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_notifications_showing_request_id_fkey"
            columns: ["showing_request_id"]
            isOneToOne: false
            referencedRelation: "showing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_referrals: {
        Row: {
          agent_id: string
          buyer_id: string
          commission_rate: number | null
          created_at: string
          id: string
          referral_date: string
          referral_type: string
          showing_request_id: string | null
          status: string
        }
        Insert: {
          agent_id: string
          buyer_id: string
          commission_rate?: number | null
          created_at?: string
          id?: string
          referral_date?: string
          referral_type?: string
          showing_request_id?: string | null
          status?: string
        }
        Update: {
          agent_id?: string
          buyer_id?: string
          commission_rate?: number | null
          created_at?: string
          id?: string
          referral_date?: string
          referral_type?: string
          showing_request_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_referrals_showing_request_id_fkey"
            columns: ["showing_request_id"]
            isOneToOne: false
            referencedRelation: "showing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_specialties: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      api_sync_logs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          records_processed: number | null
          started_at: string
          status: string
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          records_processed?: number | null
          started_at?: string
          status: string
          sync_type?: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          records_processed?: number | null
          started_at?: string
          status?: string
          sync_type?: string
        }
        Relationships: []
      }
      buyer_agent_matches: {
        Row: {
          agent_id: string
          buyer_id: string
          contact_revealed_at: string | null
          created_at: string | null
          id: string
          match_source: string | null
          showing_request_id: string | null
        }
        Insert: {
          agent_id: string
          buyer_id: string
          contact_revealed_at?: string | null
          created_at?: string | null
          id?: string
          match_source?: string | null
          showing_request_id?: string | null
        }
        Update: {
          agent_id?: string
          buyer_id?: string
          contact_revealed_at?: string | null
          created_at?: string | null
          id?: string
          match_source?: string | null
          showing_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buyer_agent_matches_showing_request_id_fkey"
            columns: ["showing_request_id"]
            isOneToOne: false
            referencedRelation: "showing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      buyer_feedback: {
        Row: {
          agent_comments: string | null
          agent_id: string | null
          agent_rating: number | null
          buyer_id: string
          created_at: string
          id: string
          property_comments: string | null
          property_rating: number | null
          showing_request_id: string
        }
        Insert: {
          agent_comments?: string | null
          agent_id?: string | null
          agent_rating?: number | null
          buyer_id: string
          created_at?: string
          id?: string
          property_comments?: string | null
          property_rating?: number | null
          showing_request_id: string
        }
        Update: {
          agent_comments?: string | null
          agent_id?: string | null
          agent_rating?: number | null
          buyer_id?: string
          created_at?: string
          id?: string
          property_comments?: string | null
          property_rating?: number | null
          showing_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "buyer_feedback_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buyer_feedback_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buyer_feedback_showing_request_id_fkey"
            columns: ["showing_request_id"]
            isOneToOne: false
            referencedRelation: "showing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_bookings: {
        Row: {
          agent_id: string
          agent_notes: string | null
          buyer_id: string
          buyer_notes: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          meeting_link: string | null
          offer_intent_id: string
          scheduled_at: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          agent_notes?: string | null
          buyer_id: string
          buyer_notes?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_link?: string | null
          offer_intent_id: string
          scheduled_at: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          agent_notes?: string | null
          buyer_id?: string
          buyer_notes?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_link?: string | null
          offer_intent_id?: string
          scheduled_at?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_bookings_offer_intent_id_fkey"
            columns: ["offer_intent_id"]
            isOneToOne: false
            referencedRelation: "offer_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_questions: {
        Row: {
          agent_id: string | null
          answer: string | null
          answered_at: string | null
          buyer_id: string
          created_at: string
          id: string
          question: string
          showing_request_id: string
        }
        Insert: {
          agent_id?: string | null
          answer?: string | null
          answered_at?: string | null
          buyer_id: string
          created_at?: string
          id?: string
          question: string
          showing_request_id: string
        }
        Update: {
          agent_id?: string | null
          answer?: string | null
          answered_at?: string | null
          buyer_id?: string
          created_at?: string
          id?: string
          question?: string
          showing_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_questions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_questions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_questions_showing_request_id_fkey"
            columns: ["showing_request_id"]
            isOneToOne: false
            referencedRelation: "showing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      house_assignments: {
        Row: {
          assigned_at: string
          house_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          house_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          house_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "house_assignments_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      houses: {
        Row: {
          address: string
          available: boolean
          baths: number
          beds: number
          city: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          price: number
          sqft: number | null
          state: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address: string
          available?: boolean
          baths: number
          beds: number
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          price: number
          sqft?: number | null
          state?: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string
          available?: boolean
          baths?: number
          beds?: number
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          price?: number
          sqft?: number | null
          state?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          access_expires_at: string | null
          content: string
          conversation_type: string | null
          created_at: string
          id: string
          read_at: string | null
          receiver_id: string | null
          sender_id: string | null
          showing_request_id: string | null
          support_conversation_id: string | null
        }
        Insert: {
          access_expires_at?: string | null
          content: string
          conversation_type?: string | null
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          showing_request_id?: string | null
          support_conversation_id?: string | null
        }
        Update: {
          access_expires_at?: string | null
          content?: string
          conversation_type?: string | null
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          showing_request_id?: string | null
          support_conversation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_showing_request_id_fkey"
            columns: ["showing_request_id"]
            isOneToOne: false
            referencedRelation: "showing_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_support_conversation_id_fkey"
            columns: ["support_conversation_id"]
            isOneToOne: false
            referencedRelation: "support_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_intents: {
        Row: {
          additional_terms: Json | null
          agent_id: string
          agent_preference: string | null
          agent_summary_generated_at: string | null
          buyer_id: string
          buyer_qualification: Json | null
          consultation_duration: number | null
          consultation_notes: string | null
          consultation_requested: boolean | null
          consultation_scheduled_at: string | null
          consultation_type: string | null
          contingencies: Json | null
          contract_type: string | null
          created_at: string | null
          financing_details: Json | null
          follow_up_scheduled_at: string | null
          id: string
          market_analysis: Json | null
          offer_strategy: Json | null
          offer_type: string | null
          property_address: string
          property_details: Json | null
          questionnaire_completed_at: string | null
          showing_request_id: string | null
        }
        Insert: {
          additional_terms?: Json | null
          agent_id: string
          agent_preference?: string | null
          agent_summary_generated_at?: string | null
          buyer_id: string
          buyer_qualification?: Json | null
          consultation_duration?: number | null
          consultation_notes?: string | null
          consultation_requested?: boolean | null
          consultation_scheduled_at?: string | null
          consultation_type?: string | null
          contingencies?: Json | null
          contract_type?: string | null
          created_at?: string | null
          financing_details?: Json | null
          follow_up_scheduled_at?: string | null
          id?: string
          market_analysis?: Json | null
          offer_strategy?: Json | null
          offer_type?: string | null
          property_address: string
          property_details?: Json | null
          questionnaire_completed_at?: string | null
          showing_request_id?: string | null
        }
        Update: {
          additional_terms?: Json | null
          agent_id?: string
          agent_preference?: string | null
          agent_summary_generated_at?: string | null
          buyer_id?: string
          buyer_qualification?: Json | null
          consultation_duration?: number | null
          consultation_notes?: string | null
          consultation_requested?: boolean | null
          consultation_scheduled_at?: string | null
          consultation_type?: string | null
          contingencies?: Json | null
          contract_type?: string | null
          created_at?: string | null
          financing_details?: Json | null
          follow_up_scheduled_at?: string | null
          id?: string
          market_analysis?: Json | null
          offer_strategy?: Json | null
          offer_type?: string | null
          property_address?: string
          property_details?: Json | null
          questionnaire_completed_at?: string | null
          showing_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_intents_showing_request_id_fkey"
            columns: ["showing_request_id"]
            isOneToOne: false
            referencedRelation: "showing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_preparation_summaries: {
        Row: {
          agent_checklist: Json
          buyer_qualification_summary: Json
          contingencies_summary: Json
          contract_type: string
          created_at: string
          financing_summary: Json
          generated_at: string
          id: string
          offer_intent_id: string
          offer_strategy_summary: Json
          required_documents: Json
          required_forms: Json
          special_conditions: Json
        }
        Insert: {
          agent_checklist?: Json
          buyer_qualification_summary?: Json
          contingencies_summary?: Json
          contract_type?: string
          created_at?: string
          financing_summary?: Json
          generated_at?: string
          id?: string
          offer_intent_id: string
          offer_strategy_summary?: Json
          required_documents?: Json
          required_forms?: Json
          special_conditions?: Json
        }
        Update: {
          agent_checklist?: Json
          buyer_qualification_summary?: Json
          contingencies_summary?: Json
          contract_type?: string
          created_at?: string
          financing_summary?: Json
          generated_at?: string
          id?: string
          offer_intent_id?: string
          offer_strategy_summary?: Json
          required_documents?: Json
          required_forms?: Json
          special_conditions?: Json
        }
        Relationships: [
          {
            foreignKeyName: "offer_preparation_summaries_offer_intent_id_fkey"
            columns: ["offer_intent_id"]
            isOneToOne: false
            referencedRelation: "offer_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_questionnaire_responses: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          offer_intent_id: string
          responses: Json
          step_name: string
          step_number: number
          updated_at: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          offer_intent_id: string
          responses?: Json
          step_name: string
          step_number: number
          updated_at?: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          offer_intent_id?: string
          responses?: Json
          step_name?: string
          step_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offer_questionnaire_responses_offer_intent_id_fkey"
            columns: ["offer_intent_id"]
            isOneToOne: false
            referencedRelation: "offer_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      open_houses: {
        Row: {
          address: string
          baths: number
          beds: number
          city: string
          created_at: string
          description: string | null
          id: string
          images: Json | null
          latitude: number | null
          listing_agent_email: string | null
          listing_agent_name: string | null
          listing_agent_phone: string | null
          longitude: number | null
          lot_size: string | null
          mls_id: string | null
          open_house_date: string
          open_house_end_time: string
          open_house_start_time: string
          price: number
          property_type: string | null
          sqft: number | null
          state: string
          status: string | null
          updated_at: string
          year_built: number | null
          zip_code: string | null
        }
        Insert: {
          address: string
          baths: number
          beds: number
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          latitude?: number | null
          listing_agent_email?: string | null
          listing_agent_name?: string | null
          listing_agent_phone?: string | null
          longitude?: number | null
          lot_size?: string | null
          mls_id?: string | null
          open_house_date: string
          open_house_end_time: string
          open_house_start_time: string
          price: number
          property_type?: string | null
          sqft?: number | null
          state?: string
          status?: string | null
          updated_at?: string
          year_built?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string
          baths?: number
          beds?: number
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          latitude?: number | null
          listing_agent_email?: string | null
          listing_agent_name?: string | null
          listing_agent_phone?: string | null
          longitude?: number | null
          lot_size?: string | null
          mls_id?: string | null
          open_house_date?: string
          open_house_end_time?: string
          open_house_start_time?: string
          price?: number
          property_type?: string | null
          sqft?: number | null
          state?: string
          status?: string | null
          updated_at?: string
          year_built?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      post_showing_actions: {
        Row: {
          action_details: Json | null
          action_type: string
          buyer_id: string
          created_at: string
          id: string
          showing_request_id: string
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          buyer_id: string
          created_at?: string
          id?: string
          showing_request_id: string
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          buyer_id?: string
          created_at?: string
          id?: string
          showing_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_showing_actions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_showing_actions_showing_request_id_fkey"
            columns: ["showing_request_id"]
            isOneToOne: false
            referencedRelation: "showing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_photos: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          photo_url: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          photo_url: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          photo_url?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          agent_connected_at: string | null
          agent_connected_id: string | null
          agent_details: Json | null
          budget_max: number | null
          budget_min: number | null
          buyer_preferences: Json | null
          buying_timeline: string | null
          communication_preferences: Json | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          license_number: string | null
          onboarding_completed: boolean | null
          phone: string | null
          photo_url: string | null
          pre_approval_amount: number | null
          pre_approval_status: string | null
          profile_completion_percentage: number | null
          profile_status: string | null
          qualification_updated_at: string | null
          subscription_status: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          agent_connected_at?: string | null
          agent_connected_id?: string | null
          agent_details?: Json | null
          budget_max?: number | null
          budget_min?: number | null
          buyer_preferences?: Json | null
          buying_timeline?: string | null
          communication_preferences?: Json | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          license_number?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          photo_url?: string | null
          pre_approval_amount?: number | null
          pre_approval_status?: string | null
          profile_completion_percentage?: number | null
          profile_status?: string | null
          qualification_updated_at?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          agent_connected_at?: string | null
          agent_connected_id?: string | null
          agent_details?: Json | null
          budget_max?: number | null
          budget_min?: number | null
          buyer_preferences?: Json | null
          buying_timeline?: string | null
          communication_preferences?: Json | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          license_number?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          photo_url?: string | null
          pre_approval_amount?: number | null
          pre_approval_status?: string | null
          profile_completion_percentage?: number | null
          profile_status?: string | null
          qualification_updated_at?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_agent_connected_id_fkey"
            columns: ["agent_connected_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          baths: number
          beds: number
          city: string
          created_at: string
          description: string | null
          id: string
          images: Json | null
          latitude: number | null
          listing_agent_email: string | null
          listing_agent_name: string | null
          listing_agent_phone: string | null
          longitude: number | null
          lot_size: string | null
          mls_id: string | null
          price: number
          property_type: string | null
          sqft: number | null
          state: string
          status: string | null
          updated_at: string
          year_built: number | null
          zip_code: string | null
        }
        Insert: {
          address: string
          baths: number
          beds: number
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          latitude?: number | null
          listing_agent_email?: string | null
          listing_agent_name?: string | null
          listing_agent_phone?: string | null
          longitude?: number | null
          lot_size?: string | null
          mls_id?: string | null
          price: number
          property_type?: string | null
          sqft?: number | null
          state?: string
          status?: string | null
          updated_at?: string
          year_built?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string
          baths?: number
          beds?: number
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          latitude?: number | null
          listing_agent_email?: string | null
          listing_agent_name?: string | null
          listing_agent_phone?: string | null
          longitude?: number | null
          lot_size?: string | null
          mls_id?: string | null
          price?: number
          property_type?: string | null
          sqft?: number | null
          state?: string
          status?: string | null
          updated_at?: string
          year_built?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      property_favorites: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          notes: string | null
          property_address: string
          showing_request_id: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          notes?: string | null
          property_address: string
          showing_request_id?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          property_address?: string
          showing_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_favorites_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_favorites_showing_request_id_fkey"
            columns: ["showing_request_id"]
            isOneToOne: false
            referencedRelation: "showing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      showing_attendance: {
        Row: {
          agent_attended: boolean | null
          agent_checked_out: boolean | null
          agent_checkout_time: string | null
          buyer_attended: boolean | null
          buyer_checked_out: boolean | null
          buyer_checkout_time: string | null
          created_at: string
          id: string
          showing_request_id: string
          updated_at: string
        }
        Insert: {
          agent_attended?: boolean | null
          agent_checked_out?: boolean | null
          agent_checkout_time?: string | null
          buyer_attended?: boolean | null
          buyer_checked_out?: boolean | null
          buyer_checkout_time?: string | null
          created_at?: string
          id?: string
          showing_request_id: string
          updated_at?: string
        }
        Update: {
          agent_attended?: boolean | null
          agent_checked_out?: boolean | null
          agent_checkout_time?: string | null
          buyer_attended?: boolean | null
          buyer_checked_out?: boolean | null
          buyer_checkout_time?: string | null
          created_at?: string
          id?: string
          showing_request_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "showing_attendance_showing_request_id_fkey"
            columns: ["showing_request_id"]
            isOneToOne: false
            referencedRelation: "showing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      showing_email_notifications: {
        Row: {
          action_taken_at: string | null
          created_at: string
          email_opened_at: string | null
          email_sent_at: string
          id: string
          notification_type: string
          showing_request_id: string
        }
        Insert: {
          action_taken_at?: string | null
          created_at?: string
          email_opened_at?: string | null
          email_sent_at?: string
          id?: string
          notification_type: string
          showing_request_id: string
        }
        Update: {
          action_taken_at?: string | null
          created_at?: string
          email_opened_at?: string | null
          email_sent_at?: string
          id?: string
          notification_type?: string
          showing_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "showing_email_notifications_showing_request_id_fkey"
            columns: ["showing_request_id"]
            isOneToOne: false
            referencedRelation: "showing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      showing_requests: {
        Row: {
          assigned_agent_email: string | null
          assigned_agent_id: string | null
          assigned_agent_name: string | null
          assigned_agent_phone: string | null
          buyer_consents_to_contact: boolean | null
          created_at: string
          estimated_confirmation_date: string | null
          id: string
          internal_notes: string | null
          message: string | null
          preferred_date: string | null
          preferred_time: string | null
          property_address: string
          requested_agent_email: string | null
          requested_agent_id: string | null
          requested_agent_name: string | null
          requested_agent_phone: string | null
          status: string | null
          status_updated_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_agent_email?: string | null
          assigned_agent_id?: string | null
          assigned_agent_name?: string | null
          assigned_agent_phone?: string | null
          buyer_consents_to_contact?: boolean | null
          created_at?: string
          estimated_confirmation_date?: string | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          property_address: string
          requested_agent_email?: string | null
          requested_agent_id?: string | null
          requested_agent_name?: string | null
          requested_agent_phone?: string | null
          status?: string | null
          status_updated_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_agent_email?: string | null
          assigned_agent_id?: string | null
          assigned_agent_name?: string | null
          assigned_agent_phone?: string | null
          buyer_consents_to_contact?: boolean | null
          created_at?: string
          estimated_confirmation_date?: string | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          property_address?: string
          requested_agent_email?: string | null
          requested_agent_id?: string | null
          requested_agent_name?: string | null
          requested_agent_phone?: string | null
          status?: string | null
          status_updated_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "showing_requests_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      support_conversations: {
        Row: {
          admin_id: string | null
          buyer_id: string
          closed_at: string | null
          created_at: string
          id: string
          last_message_at: string | null
          priority: string | null
          status: string | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          admin_id?: string | null
          buyer_id: string
          closed_at?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          priority?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          admin_id?: string | null
          buyer_id?: string
          closed_at?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          priority?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tour_agreements: {
        Row: {
          agent_id: string | null
          agreement_type: string | null
          buyer_id: string | null
          created_at: string
          email_token: string | null
          id: string
          showing_request_id: string | null
          signed: boolean
          signed_at: string | null
          terms_accepted_at: string | null
          token_expires_at: string | null
        }
        Insert: {
          agent_id?: string | null
          agreement_type?: string | null
          buyer_id?: string | null
          created_at?: string
          email_token?: string | null
          id?: string
          showing_request_id?: string | null
          signed?: boolean
          signed_at?: string | null
          terms_accepted_at?: string | null
          token_expires_at?: string | null
        }
        Update: {
          agent_id?: string | null
          agreement_type?: string | null
          buyer_id?: string | null
          created_at?: string
          email_token?: string | null
          id?: string
          showing_request_id?: string | null
          signed?: boolean
          signed_at?: string | null
          terms_accepted_at?: string | null
          token_expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_agreements_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_agreements_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_agreements_showing_request_id_fkey"
            columns: ["showing_request_id"]
            isOneToOne: false
            referencedRelation: "showing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_triggers: {
        Row: {
          created_at: string
          executed_at: string | null
          id: string
          payload: Json | null
          scheduled_for: string
          showing_request_id: string
          status: string
          trigger_type: string
        }
        Insert: {
          created_at?: string
          executed_at?: string | null
          id?: string
          payload?: Json | null
          scheduled_for: string
          showing_request_id: string
          status?: string
          trigger_type: string
        }
        Update: {
          created_at?: string
          executed_at?: string | null
          id?: string
          payload?: Json | null
          scheduled_for?: string
          showing_request_id?: string
          status?: string
          trigger_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_triggers_showing_request_id_fkey"
            columns: ["showing_request_id"]
            isOneToOne: false
            referencedRelation: "showing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_agent_access_buyer_contact: {
        Args: { p_showing_request_id: string; p_agent_id: string }
        Returns: boolean
      }
      check_showing_eligibility: {
        Args: { user_uuid: string }
        Returns: Json
      }
      generate_agreement_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_type: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      mark_free_showing_used: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      process_workflow_triggers: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_free_showing_eligibility: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
