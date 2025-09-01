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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_workout_library: {
        Row: {
          created_at: string
          duration_minutes: number | null
          exercises_json: Json
          goal: string | null
          id: string
          user_id: string
          workout_name: string
          workout_type: string | null
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          exercises_json: Json
          goal?: string | null
          id?: string
          user_id: string
          workout_name: string
          workout_type?: string | null
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          exercises_json?: Json
          goal?: string | null
          id?: string
          user_id?: string
          workout_name?: string
          workout_type?: string | null
        }
        Relationships: []
      }
      exercises: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          name: string
          notes: string | null
          reps: number | null
          rest_seconds: number | null
          sets: number
          weight: number | null
          workout_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          reps?: number | null
          rest_seconds?: number | null
          sets?: number
          weight?: number | null
          workout_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          reps?: number | null
          rest_seconds?: number | null
          sets?: number
          weight?: number | null
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          daily_water_goal: number | null
          fitness_goal: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_water_goal?: number | null
          fitness_goal?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_water_goal?: number | null
          fitness_goal?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          color: string | null
          created_at: string
          current_amount: number
          description: string | null
          id: string
          target_amount: number
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          current_amount?: number
          description?: string | null
          id?: string
          target_amount: number
          target_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          current_amount?: number
          description?: string | null
          id?: string
          target_amount?: number
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shared_accounts: {
        Row: {
          created_at: string
          id: string
          owner_user_id: string
          permission: string
          status: string
          target_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_user_id: string
          permission?: string
          status?: string
          target_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_user_id?: string
          permission?: string
          status?: string
          target_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      supplement_logs: {
        Row: {
          created_at: string
          date: string
          id: string
          supplement_id: string
          taken: boolean | null
          taken_time: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          supplement_id: string
          taken?: boolean | null
          taken_time?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          supplement_id?: string
          taken?: boolean | null
          taken_time?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplement_logs_supplement_id_fkey"
            columns: ["supplement_id"]
            isOneToOne: false
            referencedRelation: "supplements"
            referencedColumns: ["id"]
          },
        ]
      }
      supplements: {
        Row: {
          created_at: string
          dosage: string
          id: string
          intake_times: string[]
          name: string
          reminder_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage: string
          id?: string
          intake_times?: string[]
          name: string
          reminder_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          id?: string
          intake_times?: string[]
          name?: string
          reminder_enabled?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account: string | null
          amount: number
          category: string | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          merchant: string | null
          occurred_at: string
          tags: string[] | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account?: string | null
          amount: number
          category?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          merchant?: string | null
          occurred_at?: string
          tags?: string[] | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account?: string | null
          amount?: number
          category?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          merchant?: string | null
          occurred_at?: string
          tags?: string[] | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      water_logs: {
        Row: {
          created_at: string
          date: string
          glasses_consumed: number
          id: string
          logged_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          glasses_consumed?: number
          id?: string
          logged_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          glasses_consumed?: number
          id?: string
          logged_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          ai_generated: boolean | null
          created_at: string
          date: string
          duration_minutes: number | null
          id: string
          name: string
          notes: string | null
          updated_at: string
          user_id: string
          workout_type: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          created_at?: string
          date?: string
          duration_minutes?: number | null
          id?: string
          name: string
          notes?: string | null
          updated_at?: string
          user_id: string
          workout_type?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          created_at?: string
          date?: string
          duration_minutes?: number | null
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
          workout_type?: string | null
        }
        Relationships: []
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
