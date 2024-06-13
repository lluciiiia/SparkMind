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
      answers: {
        Row: {
          correct_answers: string[] | null
          id: number
          user_answers: string[] | null
        }
        Insert: {
          correct_answers?: string[] | null
          id?: never
          user_answers?: string[] | null
        }
        Update: {
          correct_answers?: string[] | null
          id?: never
          user_answers?: string[] | null
        }
        Relationships: []
      }
      category: {
        Row: {
          exercises_id: number | null
          id: number
        }
        Insert: {
          exercises_id?: number | null
          id?: never
        }
        Update: {
          exercises_id?: number | null
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "category_exercises_id_fkey"
            columns: ["exercises_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          id: number
          question_id: number | null
        }
        Insert: {
          id?: never
          question_id?: number | null
        }
        Update: {
          id?: never
          question_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question"
            referencedColumns: ["id"]
          },
        ]
      }
      learnings: {
        Row: {
          category_id: number | null
          id: number
        }
        Insert: {
          category_id?: number | null
          id?: never
        }
        Update: {
          category_id?: number | null
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "learnings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
        ]
      }
      question: {
        Row: {
          answers_id: number | null
          id: number
          question_difficulty: string | null
        }
        Insert: {
          answers_id?: number | null
          id?: never
          question_difficulty?: string | null
        }
        Update: {
          answers_id?: number | null
          id?: never
          question_difficulty?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_answers_id_fkey"
            columns: ["answers_id"]
            isOneToOne: false
            referencedRelation: "answers"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          id: number
          learning_id: number | null
          user_email: string | null
          user_password: string | null
          user_uuid: string | null
        }
        Insert: {
          id?: never
          learning_id?: number | null
          user_email?: string | null
          user_password?: string | null
          user_uuid?: string | null
        }
        Update: {
          id?: never
          learning_id?: number | null
          user_email?: string | null
          user_password?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_learning_id_fkey"
            columns: ["learning_id"]
            isOneToOne: false
            referencedRelation: "learnings"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
