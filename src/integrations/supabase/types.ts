export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          certificate_file_key: string | null
          certificate_file_url: string | null
          certificate_name: string
          certificate_number: string | null
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          certification_body: string | null
          client_id: string
          country_or_region: string
          created_at: string | null
          created_by: string | null
          expiration_date: string | null
          external_id: string | null
          id: string
          internal_notes: string | null
          internal_responsible: string | null
          issue_date: string
          product_model: string | null
          product_name: string
          regulatory_standard: string | null
          status: Database["public"]["Enums"]["certificate_status"] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          certificate_file_key?: string | null
          certificate_file_url?: string | null
          certificate_name: string
          certificate_number?: string | null
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          certification_body?: string | null
          client_id: string
          country_or_region: string
          created_at?: string | null
          created_by?: string | null
          expiration_date?: string | null
          external_id?: string | null
          id?: string
          internal_notes?: string | null
          internal_responsible?: string | null
          issue_date: string
          product_model?: string | null
          product_name: string
          regulatory_standard?: string | null
          status?: Database["public"]["Enums"]["certificate_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          certificate_file_key?: string | null
          certificate_file_url?: string | null
          certificate_name?: string
          certificate_number?: string | null
          certificate_type?: Database["public"]["Enums"]["certificate_type"]
          certification_body?: string | null
          client_id?: string
          country_or_region?: string
          created_at?: string | null
          created_by?: string | null
          expiration_date?: string | null
          external_id?: string | null
          id?: string
          internal_notes?: string | null
          internal_responsible?: string | null
          issue_date?: string
          product_model?: string | null
          product_name?: string
          regulatory_standard?: string | null
          status?: Database["public"]["Enums"]["certificate_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          client_name: string
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          industry: string | null
          internal_code: string | null
          notes: string | null
          primary_country: string | null
          updated_at: string | null
        }
        Insert: {
          client_name: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          internal_code?: string | null
          notes?: string | null
          primary_country?: string | null
          updated_at?: string | null
        }
        Update: {
          client_name?: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          internal_code?: string | null
          notes?: string | null
          primary_country?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      congress_bill_statuses: {
        Row: {
          bill_number: string
          bill_type: string
          congress: number
          current_stage: string
          email_updated_at: string | null
          has_email_update: boolean | null
          id: string
          scraped_at: string
          stages: Json
        }
        Insert: {
          bill_number: string
          bill_type: string
          congress: number
          current_stage: string
          email_updated_at?: string | null
          has_email_update?: boolean | null
          id?: string
          scraped_at?: string
          stages: Json
        }
        Update: {
          bill_number?: string
          bill_type?: string
          congress?: number
          current_stage?: string
          email_updated_at?: string | null
          has_email_update?: boolean | null
          id?: string
          scraped_at?: string
          stages?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      certificate_status: "Valid" | "Expiring Soon" | "Expired" | "In Progress"
      certificate_type:
        | "CE"
        | "FCC"
        | "UL"
        | "UKCA"
        | "CB"
        | "EMC"
        | "RF"
        | "Safety"
        | "Eco-design"
        | "Other"
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
    Enums: {
      app_role: ["admin", "user"],
      certificate_status: ["Valid", "Expiring Soon", "Expired", "In Progress"],
      certificate_type: [
        "CE",
        "FCC",
        "UL",
        "UKCA",
        "CB",
        "EMC",
        "RF",
        "Safety",
        "Eco-design",
        "Other",
      ],
    },
  },
} as const
