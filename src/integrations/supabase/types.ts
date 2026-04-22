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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_usage_logs: {
        Row: {
          client_id: string | null
          created_at: string
          estimated_cost: number | null
          function_name: string
          id: string
          input_tokens: number | null
          metadata: Json | null
          model_used: string | null
          organization_id: string | null
          output_tokens: number | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          estimated_cost?: number | null
          function_name: string
          id?: string
          input_tokens?: number | null
          metadata?: Json | null
          model_used?: string | null
          organization_id?: string | null
          output_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          estimated_cost?: number | null
          function_name?: string
          id?: string
          input_tokens?: number | null
          metadata?: Json | null
          model_used?: string | null
          organization_id?: string | null
          output_tokens?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_usage_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          affected_areas: string[] | null
          ai_analysis: Json | null
          ai_summary: string | null
          area_de_interes: string[] | null
          autores: string[] | null
          client_id: string | null
          codigo: string | null
          comentario: string | null
          comision: string | null
          created_at: string
          deadline: string | null
          entity: string | null
          es_cambio_estado: boolean | null
          estado_actual: string | null
          estado_anterior: string | null
          expert_commentary: string | null
          external_id: string | null
          fecha_presentacion: string | null
          fecha_publicacion: string | null
          fecha_sesion: string | null
          fechas_identificadas: Json | null
          fuente: string | null
          id: string
          impacto: number | null
          impacto_categoria: string | null
          ingested_at: string | null
          legislation_id: string | null
          legislation_summary: string | null
          legislation_title: string
          legislation_type: string | null
          organization_id: string | null
          proponente: string | null
          published_at: string | null
          racional: string[] | null
          reference_number: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          risk_level: string | null
          seguimiento: Json | null
          seguimiento_hash: string | null
          source_url: string | null
          status: string
          sumilla: string | null
          updated_at: string
          urgencia: number | null
          urgencia_categoria: string | null
          urgency_level: string | null
          url: string | null
          version: number | null
        }
        Insert: {
          affected_areas?: string[] | null
          ai_analysis?: Json | null
          ai_summary?: string | null
          area_de_interes?: string[] | null
          autores?: string[] | null
          client_id?: string | null
          codigo?: string | null
          comentario?: string | null
          comision?: string | null
          created_at?: string
          deadline?: string | null
          entity?: string | null
          es_cambio_estado?: boolean | null
          estado_actual?: string | null
          estado_anterior?: string | null
          expert_commentary?: string | null
          external_id?: string | null
          fecha_presentacion?: string | null
          fecha_publicacion?: string | null
          fecha_sesion?: string | null
          fechas_identificadas?: Json | null
          fuente?: string | null
          id?: string
          impacto?: number | null
          impacto_categoria?: string | null
          ingested_at?: string | null
          legislation_id?: string | null
          legislation_summary?: string | null
          legislation_title: string
          legislation_type?: string | null
          organization_id?: string | null
          proponente?: string | null
          published_at?: string | null
          racional?: string[] | null
          reference_number?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level?: string | null
          seguimiento?: Json | null
          seguimiento_hash?: string | null
          source_url?: string | null
          status?: string
          sumilla?: string | null
          updated_at?: string
          urgencia?: number | null
          urgencia_categoria?: string | null
          urgency_level?: string | null
          url?: string | null
          version?: number | null
        }
        Update: {
          affected_areas?: string[] | null
          ai_analysis?: Json | null
          ai_summary?: string | null
          area_de_interes?: string[] | null
          autores?: string[] | null
          client_id?: string | null
          codigo?: string | null
          comentario?: string | null
          comision?: string | null
          created_at?: string
          deadline?: string | null
          entity?: string | null
          es_cambio_estado?: boolean | null
          estado_actual?: string | null
          estado_anterior?: string | null
          expert_commentary?: string | null
          external_id?: string | null
          fecha_presentacion?: string | null
          fecha_publicacion?: string | null
          fecha_sesion?: string | null
          fechas_identificadas?: Json | null
          fuente?: string | null
          id?: string
          impacto?: number | null
          impacto_categoria?: string | null
          ingested_at?: string | null
          legislation_id?: string | null
          legislation_summary?: string | null
          legislation_title?: string
          legislation_type?: string | null
          organization_id?: string | null
          proponente?: string | null
          published_at?: string | null
          racional?: string[] | null
          reference_number?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level?: string | null
          seguimiento?: Json | null
          seguimiento_hash?: string | null
          source_url?: string | null
          status?: string
          sumilla?: string | null
          updated_at?: string
          urgencia?: number | null
          urgencia_categoria?: string | null
          urgency_level?: string | null
          url?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_session_links: {
        Row: {
          bill_id: string
          created_at: string | null
          id: string
          session_id: string
          user_id: string
        }
        Insert: {
          bill_id: string
          created_at?: string | null
          id?: string
          session_id: string
          user_id: string
        }
        Update: {
          bill_id?: string
          created_at?: string | null
          id?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_session_links_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "peru_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
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
      client_users: {
        Row: {
          area: string | null
          client_id: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          profile_id: string | null
          title: string | null
          whatsapp_enabled: boolean | null
        }
        Insert: {
          area?: string | null
          client_id: string
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          profile_id?: string | null
          title?: string | null
          whatsapp_enabled?: boolean | null
        }
        Update: {
          area?: string | null
          client_id?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          profile_id?: string | null
          title?: string | null
          whatsapp_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "client_users_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_users_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          additional_entities: string[] | null
          affected_areas: Json | null
          business_model_description: string | null
          client_name: string
          company_type: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          cross_border_countries: string[] | null
          customer_segments: string[] | null
          daily_report_schedule: string | null
          delivery_channels: Json | null
          detail_level: string | null
          distribution_channels: string[] | null
          email_recipients: Json | null
          exclusions: string[] | null
          high_impact_definition: string | null
          high_urgency_definition: string | null
          id: string
          include_analytics: boolean | null
          include_expert_commentary: boolean | null
          industry: string | null
          instrument_types: string[] | null
          internal_code: string | null
          is_cross_border: boolean | null
          is_regulated: boolean | null
          keywords: string[] | null
          law_branches: string[] | null
          legal_name: string | null
          locations: Json | null
          monitoring_objective: string | null
          notes: string | null
          organization_id: string | null
          pdf_naming_convention: string | null
          primary_contact_id: string | null
          primary_country: string | null
          primary_sector: string | null
          products_services: Json | null
          report_default_filters: Json | null
          secondary_sectors: string[] | null
          send_only_if_alerts: boolean | null
          short_description: string | null
          source_acknowledgement: boolean | null
          stakeholders_affected: string[] | null
          status: string | null
          supervising_authorities: string[] | null
          timezone: string | null
          trade_name: string | null
          updated_at: string | null
          website: string | null
          weekly_report_schedule: Json | null
          whatsapp_consent: boolean | null
          whatsapp_recipients: Json | null
        }
        Insert: {
          additional_entities?: string[] | null
          affected_areas?: Json | null
          business_model_description?: string | null
          client_name: string
          company_type?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          cross_border_countries?: string[] | null
          customer_segments?: string[] | null
          daily_report_schedule?: string | null
          delivery_channels?: Json | null
          detail_level?: string | null
          distribution_channels?: string[] | null
          email_recipients?: Json | null
          exclusions?: string[] | null
          high_impact_definition?: string | null
          high_urgency_definition?: string | null
          id?: string
          include_analytics?: boolean | null
          include_expert_commentary?: boolean | null
          industry?: string | null
          instrument_types?: string[] | null
          internal_code?: string | null
          is_cross_border?: boolean | null
          is_regulated?: boolean | null
          keywords?: string[] | null
          law_branches?: string[] | null
          legal_name?: string | null
          locations?: Json | null
          monitoring_objective?: string | null
          notes?: string | null
          organization_id?: string | null
          pdf_naming_convention?: string | null
          primary_contact_id?: string | null
          primary_country?: string | null
          primary_sector?: string | null
          products_services?: Json | null
          report_default_filters?: Json | null
          secondary_sectors?: string[] | null
          send_only_if_alerts?: boolean | null
          short_description?: string | null
          source_acknowledgement?: boolean | null
          stakeholders_affected?: string[] | null
          status?: string | null
          supervising_authorities?: string[] | null
          timezone?: string | null
          trade_name?: string | null
          updated_at?: string | null
          website?: string | null
          weekly_report_schedule?: Json | null
          whatsapp_consent?: boolean | null
          whatsapp_recipients?: Json | null
        }
        Update: {
          additional_entities?: string[] | null
          affected_areas?: Json | null
          business_model_description?: string | null
          client_name?: string
          company_type?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          cross_border_countries?: string[] | null
          customer_segments?: string[] | null
          daily_report_schedule?: string | null
          delivery_channels?: Json | null
          detail_level?: string | null
          distribution_channels?: string[] | null
          email_recipients?: Json | null
          exclusions?: string[] | null
          high_impact_definition?: string | null
          high_urgency_definition?: string | null
          id?: string
          include_analytics?: boolean | null
          include_expert_commentary?: boolean | null
          industry?: string | null
          instrument_types?: string[] | null
          internal_code?: string | null
          is_cross_border?: boolean | null
          is_regulated?: boolean | null
          keywords?: string[] | null
          law_branches?: string[] | null
          legal_name?: string | null
          locations?: Json | null
          monitoring_objective?: string | null
          notes?: string | null
          organization_id?: string | null
          pdf_naming_convention?: string | null
          primary_contact_id?: string | null
          primary_country?: string | null
          primary_sector?: string | null
          products_services?: Json | null
          report_default_filters?: Json | null
          secondary_sectors?: string[] | null
          send_only_if_alerts?: boolean | null
          short_description?: string | null
          source_acknowledgement?: boolean | null
          stakeholders_affected?: string[] | null
          status?: string | null
          supervising_authorities?: string[] | null
          timezone?: string | null
          trade_name?: string | null
          updated_at?: string | null
          website?: string | null
          weekly_report_schedule?: Json | null
          whatsapp_consent?: boolean | null
          whatsapp_recipients?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      organizations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          max_clients: number | null
          max_users: number | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          max_clients?: number | null
          max_users?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          max_clients?: number | null
          max_users?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      peru_sessions: {
        Row: {
          agenda_url: string | null
          commission_name: string
          created_at: string | null
          documents_url: string | null
          external_session_id: string
          id: string
          jurisdiction: string | null
          scheduled_at: string | null
          scheduled_date_text: string | null
          session_title: string | null
          source: string | null
          source_file_name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agenda_url?: string | null
          commission_name: string
          created_at?: string | null
          documents_url?: string | null
          external_session_id: string
          id?: string
          jurisdiction?: string | null
          scheduled_at?: string | null
          scheduled_date_text?: string | null
          session_title?: string | null
          source?: string | null
          source_file_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agenda_url?: string | null
          commission_name?: string
          created_at?: string | null
          documents_url?: string | null
          external_session_id?: string
          id?: string
          jurisdiction?: string | null
          scheduled_at?: string | null
          scheduled_date_text?: string | null
          session_title?: string | null
          source?: string | null
          source_file_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["app_role"]
          client_id: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          last_daily_popup_shown: string | null
          last_login_at: string | null
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["app_role"]
          client_id?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          last_daily_popup_shown?: string | null
          last_login_at?: string | null
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["app_role"]
          client_id?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          last_daily_popup_shown?: string | null
          last_login_at?: string | null
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          alert_ids: string[] | null
          client_id: string
          created_at: string
          created_by: string | null
          detail_level: string | null
          id: string
          include_analytics: boolean | null
          organization_id: string | null
          pdf_url: string | null
          period_end: string | null
          period_start: string | null
          report_type: string | null
          sent_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          alert_ids?: string[] | null
          client_id: string
          created_at?: string
          created_by?: string | null
          detail_level?: string | null
          id?: string
          include_analytics?: boolean | null
          organization_id?: string | null
          pdf_url?: string | null
          period_end?: string | null
          period_start?: string | null
          report_type?: string | null
          sent_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          alert_ids?: string[] | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          detail_level?: string | null
          id?: string
          include_analytics?: boolean | null
          organization_id?: string | null
          pdf_url?: string | null
          period_end?: string | null
          period_start?: string | null
          report_type?: string | null
          sent_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sesiones: {
        Row: {
          agenda_markdown: string | null
          agenda_scraped_at: string | null
          agenda_url: string | null
          analysis_completed_at: string | null
          analysis_cost_usd: number | null
          analysis_error: string | null
          analysis_model: string | null
          analysis_requested_at: string | null
          analysis_requested_by: string | null
          analysis_started_at: string | null
          analysis_status: string
          area_de_interes: string[] | null
          client_id: string
          comentario: string | null
          commission_name: string
          commission_normalized: string
          created_at: string
          es_de_interes: boolean
          external_id: string
          id: string
          impacto: number | null
          impacto_categoria: string | null
          organization_id: string
          puntos_clave: Json | null
          racional: string[] | null
          recomendaciones: string[] | null
          resumen_ejecutivo: string | null
          scheduled_at: string | null
          scheduled_date_text: string | null
          session_title: string | null
          transcript_duration_s: number | null
          transcript_excerpt: string | null
          updated_at: string
          urgencia: number | null
          urgencia_categoria: string | null
          video_resolved_at: string | null
          video_url: string | null
        }
        Insert: {
          agenda_markdown?: string | null
          agenda_scraped_at?: string | null
          agenda_url?: string | null
          analysis_completed_at?: string | null
          analysis_cost_usd?: number | null
          analysis_error?: string | null
          analysis_model?: string | null
          analysis_requested_at?: string | null
          analysis_requested_by?: string | null
          analysis_started_at?: string | null
          analysis_status?: string
          area_de_interes?: string[] | null
          client_id: string
          comentario?: string | null
          commission_name: string
          commission_normalized: string
          created_at?: string
          es_de_interes?: boolean
          external_id: string
          id?: string
          impacto?: number | null
          impacto_categoria?: string | null
          organization_id: string
          puntos_clave?: Json | null
          racional?: string[] | null
          recomendaciones?: string[] | null
          resumen_ejecutivo?: string | null
          scheduled_at?: string | null
          scheduled_date_text?: string | null
          session_title?: string | null
          transcript_duration_s?: number | null
          transcript_excerpt?: string | null
          updated_at?: string
          urgencia?: number | null
          urgencia_categoria?: string | null
          video_resolved_at?: string | null
          video_url?: string | null
        }
        Update: {
          agenda_markdown?: string | null
          agenda_scraped_at?: string | null
          agenda_url?: string | null
          analysis_completed_at?: string | null
          analysis_cost_usd?: number | null
          analysis_error?: string | null
          analysis_model?: string | null
          analysis_requested_at?: string | null
          analysis_requested_by?: string | null
          analysis_started_at?: string | null
          analysis_status?: string
          area_de_interes?: string[] | null
          client_id?: string
          comentario?: string | null
          commission_name?: string
          commission_normalized?: string
          created_at?: string
          es_de_interes?: boolean
          external_id?: string
          id?: string
          impacto?: number | null
          impacto_categoria?: string | null
          organization_id?: string
          puntos_clave?: Json | null
          racional?: string[] | null
          recomendaciones?: string[] | null
          resumen_ejecutivo?: string | null
          scheduled_at?: string | null
          scheduled_date_text?: string | null
          session_title?: string | null
          transcript_duration_s?: number | null
          transcript_excerpt?: string | null
          updated_at?: string
          urgencia?: number | null
          urgencia_categoria?: string | null
          video_resolved_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      session_editorial_state: {
        Row: {
          chatbot_state: string
          created_at: string
          editorial_state: string
          id: string
          is_archived: boolean
          is_follow_up: boolean
          is_pinned: boolean
          legal_review: Json | null
          session_id: string
          transcription_state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          chatbot_state?: string
          created_at?: string
          editorial_state?: string
          id?: string
          is_archived?: boolean
          is_follow_up?: boolean
          is_pinned?: boolean
          legal_review?: Json | null
          session_id: string
          transcription_state?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          chatbot_state?: string
          created_at?: string
          editorial_state?: string
          id?: string
          is_archived?: boolean
          is_follow_up?: boolean
          is_pinned?: boolean
          legal_review?: Json | null
          session_id?: string
          transcription_state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_recordings: {
        Row: {
          analysis_result: Json | null
          analysis_status: string | null
          analyzed_at: string | null
          channel_id: string | null
          channel_name: string | null
          created_at: string | null
          expected_title: string | null
          id: string
          last_error: string | null
          provider: string | null
          resolution_confidence: string | null
          resolution_method: string | null
          resolved_at: string | null
          session_id: string
          transcription_status: string | null
          transcription_text: string | null
          video_id: string | null
          video_url: string | null
        }
        Insert: {
          analysis_result?: Json | null
          analysis_status?: string | null
          analyzed_at?: string | null
          channel_id?: string | null
          channel_name?: string | null
          created_at?: string | null
          expected_title?: string | null
          id?: string
          last_error?: string | null
          provider?: string | null
          resolution_confidence?: string | null
          resolution_method?: string | null
          resolved_at?: string | null
          session_id: string
          transcription_status?: string | null
          transcription_text?: string | null
          video_id?: string | null
          video_url?: string | null
        }
        Update: {
          analysis_result?: Json | null
          analysis_status?: string | null
          analyzed_at?: string | null
          channel_id?: string | null
          channel_name?: string | null
          created_at?: string | null
          expected_title?: string | null
          id?: string
          last_error?: string | null
          provider?: string | null
          resolution_confidence?: string | null
          resolution_method?: string | null
          resolved_at?: string | null
          session_id?: string
          transcription_status?: string | null
          transcription_text?: string | null
          video_id?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_recordings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "peru_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_watch: {
        Row: {
          created_at: string | null
          id: string
          session_id: string
          user_id: string
          watch_status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_id: string
          user_id: string
          watch_status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          session_id?: string
          user_id?: string
          watch_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_watch_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "peru_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      stt_usage: {
        Row: {
          google_minutes_used: number | null
          id: string
          last_updated: string | null
          month: string
          whisper_minutes_used: number | null
        }
        Insert: {
          google_minutes_used?: number | null
          id?: string
          last_updated?: string | null
          month: string
          whisper_minutes_used?: number | null
        }
        Update: {
          google_minutes_used?: number | null
          id?: string
          last_updated?: string | null
          month?: string
          whisper_minutes_used?: number | null
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
      watched_commissions: {
        Row: {
          commission_name: string
          created_at: string | null
          id: string
          jurisdiction: string | null
          user_id: string
        }
        Insert: {
          commission_name: string
          created_at?: string | null
          id?: string
          jurisdiction?: string | null
          user_id: string
        }
        Update: {
          commission_name?: string
          created_at?: string | null
          id?: string
          jurisdiction?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      ai_usage_monthly: {
        Row: {
          call_count: number | null
          client_id: string | null
          function_name: string | null
          month: string | null
          organization_id: string | null
          total_cost: number | null
          total_input_tokens: number | null
          total_output_tokens: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_usage_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
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
