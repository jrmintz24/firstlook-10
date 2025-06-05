export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          license_number: string | null
          phone: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          license_number?: string | null
          phone?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          license_number?: string | null
          phone?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
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
      showing_requests: {
        Row: {
          assigned_agent_email: string | null
          assigned_agent_id: string | null
          assigned_agent_name: string | null
          assigned_agent_phone: string | null
          created_at: string
          estimated_confirmation_date: string | null
          id: string
          internal_notes: string | null
          message: string | null
          preferred_date: string | null
          preferred_time: string | null
          property_address: string
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
          created_at?: string
          estimated_confirmation_date?: string | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          property_address: string
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
          created_at?: string
          estimated_confirmation_date?: string | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          property_address?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
