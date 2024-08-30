export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          stripe_customer_id: string | null;
        };
        Insert: {
          id: string;
          stripe_customer_id?: string | null;
        };
        Update: {
          id?: string;
          stripe_customer_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'customers_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      googleauthtokens: {
        Row: {
          access_token: string | null;
          expires_at: string | null;
          refresh_token: string | null;
          user_uuid: string;
        };
        Insert: {
          access_token?: string | null;
          expires_at?: string | null;
          refresh_token?: string | null;
          user_uuid: string;
        };
        Update: {
          access_token?: string | null;
          expires_at?: string | null;
          refresh_token?: string | null;
          user_uuid?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'googleauthtokens_user_uuid_fkey';
            columns: ['user_uuid'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      mylearnings: {
        Row: {
          date: string | null;
          id: string;
          input: string | null;
          title: string | null;
          uuid: string;
        };
        Insert: {
          date?: string | null;
          id?: string;
          input?: string | null;
          title?: string | null;
          uuid?: string;
        };
        Update: {
          date?: string | null;
          id?: string;
          input?: string | null;
          title?: string | null;
          uuid?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'mylearnings_uuid_fkey';
            columns: ['uuid'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      notes: {
        Row: {
          content: string | null;
          created_at: string;
          id: string;
          learning_id: string;
          title: string | null;
          updated_at: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          id?: string;
          learning_id?: string;
          title?: string | null;
          updated_at?: string;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          id?: string;
          learning_id?: string;
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notes_learning_id_fkey';
            columns: ['learning_id'];
            isOneToOne: false;
            referencedRelation: 'mylearnings';
            referencedColumns: ['id'];
          },
        ];
      };
      outputs: {
        Row: {
          created_at: string;
          further_info: string | null;
          id: string;
          learning_id: string;
          questions: string | null;
          rec_questions: string[] | null;
          summary: string | null;
          todo_task: Json | null;
          youtube: string | null;
        };
        Insert: {
          created_at?: string;
          further_info?: string | null;
          id?: string;
          learning_id?: string;
          questions?: string | null;
          rec_questions?: string[] | null;
          summary?: string | null;
          todo_task?: Json | null;
          youtube?: string | null;
        };
        Update: {
          created_at?: string;
          further_info?: string | null;
          id?: string;
          learning_id?: string;
          questions?: string | null;
          rec_questions?: string[] | null;
          summary?: string | null;
          todo_task?: Json | null;
          youtube?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'outputs_learning_id_fkey';
            columns: ['learning_id'];
            isOneToOne: true;
            referencedRelation: 'mylearnings';
            referencedColumns: ['id'];
          },
        ];
      };
      prices: {
        Row: {
          active: boolean | null;
          currency: string | null;
          description: string | null;
          id: string;
          interval: Database['public']['Enums']['pricing_plan_interval'] | null;
          interval_count: number | null;
          metadata: Json | null;
          product_id: string | null;
          trial_period_days: number | null;
          type: Database['public']['Enums']['pricing_type'] | null;
          unit_amount: number | null;
        };
        Insert: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id: string;
          interval?: Database['public']['Enums']['pricing_plan_interval'] | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database['public']['Enums']['pricing_type'] | null;
          unit_amount?: number | null;
        };
        Update: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          interval?: Database['public']['Enums']['pricing_plan_interval'] | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database['public']['Enums']['pricing_type'] | null;
          unit_amount?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'prices_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          active: boolean | null;
          description: string | null;
          id: string;
          image: string | null;
          metadata: Json | null;
          name: string | null;
        };
        Insert: {
          active?: boolean | null;
          description?: string | null;
          id: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Update: {
          active?: boolean | null;
          description?: string | null;
          id?: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Relationships: [];
      };
      scraper_input: {
        Row: {
          created_at: string;
          input_id: string;
          text: string | null;
          updated_at: string;
          url: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          input_id?: string;
          text?: string | null;
          updated_at?: string;
          url?: string | null;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          input_id?: string;
          text?: string | null;
          updated_at?: string;
          url?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'scraper_input_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      scraper_output: {
        Row: {
          created_at: string;
          output_id: string;
          prompt_name: string;
          text_output: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          output_id: string;
          prompt_name?: string;
          text_output?: string | null;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          output_id?: string;
          prompt_name?: string;
          text_output?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'scraper_output_output_id_fkey';
            columns: ['output_id'];
            isOneToOne: true;
            referencedRelation: 'scraper_input';
            referencedColumns: ['input_id'];
          },
        ];
      };
      subscriptions: {
        Row: {
          cancel_at: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          created: string;
          current_period_end: string;
          current_period_start: string;
          ended_at: string | null;
          id: string;
          metadata: Json | null;
          price_id: string | null;
          quantity: number | null;
          status: Database['public']['Enums']['subscription_status'] | null;
          trial_end: string | null;
          trial_start: string | null;
          user_id: string;
        };
        Insert: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database['public']['Enums']['subscription_status'] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id: string;
        };
        Update: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id?: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database['public']['Enums']['subscription_status'] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_price_id_fkey';
            columns: ['price_id'];
            isOneToOne: false;
            referencedRelation: 'prices';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'subscriptions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      transcriptdata: {
        Row: {
          basic_questions: string[] | null;
          id: number;
          keywords: string[] | null;
          transcript: string | null;
          uuid: string;
          videoid: string;
        };
        Insert: {
          basic_questions?: string[] | null;
          id?: number;
          keywords?: string[] | null;
          transcript?: string | null;
          uuid?: string;
          videoid?: string;
        };
        Update: {
          basic_questions?: string[] | null;
          id?: number;
          keywords?: string[] | null;
          transcript?: string | null;
          uuid?: string;
          videoid?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transcriptdata_uuid_fkey';
            columns: ['uuid'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          billing_address: Json | null;
          full_name: string | null;
          id: string;
          payment_method: Json | null;
        };
        Insert: {
          avatar_url?: string | null;
          billing_address?: Json | null;
          full_name?: string | null;
          id: string;
          payment_method?: Json | null;
        };
        Update: {
          avatar_url?: string | null;
          billing_address?: Json | null;
          full_name?: string | null;
          id?: string;
          payment_method?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      pricing_plan_interval: 'day' | 'week' | 'month' | 'year';
      pricing_type: 'one_time' | 'recurring';
      subscription_status:
        | 'trialing'
        | 'active'
        | 'canceled'
        | 'incomplete'
        | 'incomplete_expired'
        | 'past_due'
        | 'unpaid'
        | 'paused';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
