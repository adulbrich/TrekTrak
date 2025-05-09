export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ActivityProgress: {
        Row: {
          ActivityProgressID: string
          ActivityType: Database["public"]["Enums"]["activitytypes"]
          BelongsToTeamID: string
          CreatedAt: string
          CreatedByProfileID: string
          RawProgress: number | null
          UpdatedAt: string
        }
        Insert: {
          ActivityProgressID?: string
          ActivityType: Database["public"]["Enums"]["activitytypes"]
          BelongsToTeamID: string
          CreatedAt?: string
          CreatedByProfileID: string
          RawProgress?: number | null
          UpdatedAt?: string
        }
        Update: {
          ActivityProgressID?: string
          ActivityType?: Database["public"]["Enums"]["activitytypes"]
          BelongsToTeamID?: string
          CreatedAt?: string
          CreatedByProfileID?: string
          RawProgress?: number | null
          UpdatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ActivityProgress_BelongsToTeamID_fkey"
            columns: ["BelongsToTeamID"]
            isOneToOne: false
            referencedRelation: "ActivityProgressLog"
            referencedColumns: ["TeamID"]
          },
          {
            foreignKeyName: "ActivityProgress_BelongsToTeamID_fkey"
            columns: ["BelongsToTeamID"]
            isOneToOne: false
            referencedRelation: "Teams"
            referencedColumns: ["TeamID"]
          },
          {
            foreignKeyName: "ActivityProgress_BelongsToTeamID_fkey"
            columns: ["BelongsToTeamID"]
            isOneToOne: false
            referencedRelation: "TeamStats"
            referencedColumns: ["TeamID"]
          },
          {
            foreignKeyName: "ActivityProgress_BelongsToTeamID_fkey"
            columns: ["BelongsToTeamID"]
            isOneToOne: false
            referencedRelation: "TeamStatsBreakdown"
            referencedColumns: ["TeamID"]
          },
          {
            foreignKeyName: "ActivityProgress_CreatedByProfileID_fkey"
            columns: ["CreatedByProfileID"]
            isOneToOne: false
            referencedRelation: "ActivityProgressLog"
            referencedColumns: ["ProfileID"]
          },
          {
            foreignKeyName: "ActivityProgress_CreatedByProfileID_fkey"
            columns: ["CreatedByProfileID"]
            isOneToOne: false
            referencedRelation: "Profiles"
            referencedColumns: ["ProfileID"]
          },
          {
            foreignKeyName: "ActivityProgress_CreatedByProfileID_fkey"
            columns: ["CreatedByProfileID"]
            isOneToOne: false
            referencedRelation: "ProfileStats"
            referencedColumns: ["ProfileID"]
          },
          {
            foreignKeyName: "ActivityProgress_CreatedByProfileID_fkey"
            columns: ["CreatedByProfileID"]
            isOneToOne: false
            referencedRelation: "TeamStatsBreakdown"
            referencedColumns: ["ProfileID"]
          }
        ]
      }
      Events: {
        Row: {
          CreatedAt: string
          CreatedByUserID: string
          Description: string | null
          EndsAt: string
          EventID: string
          Name: string
          StartsAt: string
          Type: Database["public"]["Enums"]["ActivityTypes"]
          UpdatedAt: string
          RewardSingular: string
          RewardPlural: string
          Achievements: string[]
          AchievementCount: number
        }
        Insert: {
          CreatedAt?: string
          CreatedByUserID: string
          Description?: string | null
          EndsAt: string
          EventID?: string
          Name: string
          StartsAt: string
          Type: Database["public"]["Enums"]["ActivityTypes"]
          UpdatedAt?: string
          RewardSingular: string
          RewardPlural: string
          Achievements: string[]
          AchievementCount: number
        }
        Update: {
          CreatedAt?: string
          CreatedByUserID?: string
          Description?: string | null
          EndsAt?: string
          EventID?: string
          Name?: string
          StartsAt?: string
          Type?: Database["public"]["Enums"]["ActivityTypes"]
          UpdatedAt?: string
          RewardSingular: string
          RewardPlural: string
          Achievements: string[]
          AchievementCount: number
        }
        Relationships: [
          {
            foreignKeyName: "Events_CreatedByUserID_fkey"
            columns: ["CreatedByUserID"]
            isOneToOne: false
            referencedRelation: "ActivityProgressLog"
            referencedColumns: ["ProfileID"]
          },
          {
            foreignKeyName: "Events_CreatedByUserID_fkey"
            columns: ["CreatedByUserID"]
            isOneToOne: false
            referencedRelation: "Profiles"
            referencedColumns: ["ProfileID"]
          },
          {
            foreignKeyName: "Events_CreatedByUserID_fkey"
            columns: ["CreatedByUserID"]
            isOneToOne: false
            referencedRelation: "ProfileStats"
            referencedColumns: ["ProfileID"]
          },
          {
            foreignKeyName: "Events_CreatedByUserID_fkey"
            columns: ["CreatedByUserID"]
            isOneToOne: false
            referencedRelation: "TeamStatsBreakdown"
            referencedColumns: ["ProfileID"]
          }
        ]
      }
      Profiles: {
        Row: {
          CreatedAt: string
          Name: string | null
          ProfileID: string
          UpdatedAt: string
        }
        Insert: {
          CreatedAt?: string
          Name?: string | null
          ProfileID: string
          UpdatedAt?: string
        }
        Update: {
          CreatedAt?: string
          Name?: string | null
          ProfileID?: string
          UpdatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Profiles_ProfileID_fkey"
            columns: ["ProfileID"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      Teams: {
        Row: {
          BelongsToEventID: string
          CreatedAt: string
          Name: string
          TeamID: string
          UpdatedAt: string
          RewardCount: number
        }
        Insert: {
          BelongsToEventID: string
          CreatedAt?: string
          Name: string
          TeamID?: string
          UpdatedAt?: string
          RewardCount: number
        }
        Update: {
          BelongsToEventID?: string
          CreatedAt?: string
          Name?: string
          TeamID?: string
          UpdatedAt?: string
          RewardCount: number
        }
        Relationships: [
          {
            foreignKeyName: "Team_BelongsToEventID_fkey"
            columns: ["BelongsToEventID"]
            isOneToOne: false
            referencedRelation: "ActivityProgressLog"
            referencedColumns: ["EventID"]
          },
          {
            foreignKeyName: "Team_BelongsToEventID_fkey"
            columns: ["BelongsToEventID"]
            isOneToOne: false
            referencedRelation: "Events"
            referencedColumns: ["EventID"]
          },
          {
            foreignKeyName: "Team_BelongsToEventID_fkey"
            columns: ["BelongsToEventID"]
            isOneToOne: false
            referencedRelation: "EventStats"
            referencedColumns: ["EventID"]
          }
        ]
      }
      TeamsProfiles: {
        Row: {
          ProfileID: string
          TeamID: string
        }
        Insert: {
          ProfileID: string
          TeamID: string
        }
        Update: {
          ProfileID?: string
          TeamID?: string
        }
        Relationships: [
          {
            foreignKeyName: "TeamsProfiles_ProfileID_fkey"
            columns: ["ProfileID"]
            isOneToOne: false
            referencedRelation: "ActivityProgressLog"
            referencedColumns: ["ProfileID"]
          },
          {
            foreignKeyName: "TeamsProfiles_ProfileID_fkey"
            columns: ["ProfileID"]
            isOneToOne: false
            referencedRelation: "Profiles"
            referencedColumns: ["ProfileID"]
          },
          {
            foreignKeyName: "TeamsProfiles_ProfileID_fkey"
            columns: ["ProfileID"]
            isOneToOne: false
            referencedRelation: "ProfileStats"
            referencedColumns: ["ProfileID"]
          },
          {
            foreignKeyName: "TeamsProfiles_ProfileID_fkey"
            columns: ["ProfileID"]
            isOneToOne: false
            referencedRelation: "TeamStatsBreakdown"
            referencedColumns: ["ProfileID"]
          },
          {
            foreignKeyName: "TeamsProfiles_TeamID_fkey"
            columns: ["TeamID"]
            isOneToOne: false
            referencedRelation: "ActivityProgressLog"
            referencedColumns: ["TeamID"]
          },
          {
            foreignKeyName: "TeamsProfiles_TeamID_fkey"
            columns: ["TeamID"]
            isOneToOne: false
            referencedRelation: "Teams"
            referencedColumns: ["TeamID"]
          },
          {
            foreignKeyName: "TeamsProfiles_TeamID_fkey"
            columns: ["TeamID"]
            isOneToOne: false
            referencedRelation: "TeamStats"
            referencedColumns: ["TeamID"]
          },
          {
            foreignKeyName: "TeamsProfiles_TeamID_fkey"
            columns: ["TeamID"]
            isOneToOne: false
            referencedRelation: "TeamStatsBreakdown"
            referencedColumns: ["TeamID"]
          }
        ]
      }
    }
    Views: {
      ActivityProgressLog: {
        Row: {
          EventEndsAt: string | null
          EventID: string | null
          EventName: string | null
          EventStartsAt: string | null
          LatestActivityDate: string | null
          ProfileID: string | null
          ProfileName: string | null
          TeamID: string | null
          TeamName: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Profiles_ProfileID_fkey"
            columns: ["ProfileID"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      EventStats: {
        Row: {
          EventID: string | null
          Name: string | null
          TotalScore: number | null
        }
        Insert: {
          EventID?: string | null
          Name?: string | null
          TotalScore?: never
        }
        Update: {
          EventID?: string | null
          Name?: string | null
          TotalScore?: never
        }
        Relationships: []
      }
      ProfileStats: {
        Row: {
          Name: string | null
          ProfileID: string | null
          TotalScore: number | null
        }
        Insert: {
          Name?: string | null
          ProfileID?: string | null
          TotalScore?: never
        }
        Update: {
          Name?: string | null
          ProfileID?: string | null
          TotalScore?: never
        }
        Relationships: [
          {
            foreignKeyName: "Profiles_ProfileID_fkey"
            columns: ["ProfileID"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      TeamStats: {
        Row: {
          BelongsToEventID: string | null
          Name: string | null
          TeamID: string | null
          TotalScore: number | null
        }
        Insert: {
          BelongsToEventID?: string | null
          Name?: string | null
          TeamID?: string | null
          TotalScore?: never
        }
        Update: {
          BelongsToEventID?: string | null
          Name?: string | null
          TeamID?: string | null
          TotalScore?: never
        }
        Relationships: [
          {
            foreignKeyName: "Team_BelongsToEventID_fkey"
            columns: ["BelongsToEventID"]
            isOneToOne: false
            referencedRelation: "Events"
            referencedColumns: ["EventID"]
          },
          {
            foreignKeyName: "Team_BelongsToEventID_fkey"
            columns: ["BelongsToEventID"]
            isOneToOne: false
            referencedRelation: "ActivityProgressLog"
            referencedColumns: ["EventID"]
          },
          {
            foreignKeyName: "Team_BelongsToEventID_fkey"
            columns: ["BelongsToEventID"]
            isOneToOne: false
            referencedRelation: "EventStats"
            referencedColumns: ["EventID"]
          }
        ]
      }
      TeamStatsBreakdown: {
        Row: {
          EventID: string | null
          ProfileID: string | null
          ProfileName: string | null
          TeamID: string | null
          TeamName: string | null
          TotalScore: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Profiles_ProfileID_fkey"
            columns: ["ProfileID"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Team_BelongsToEventID_fkey"
            columns: ["EventID"]
            isOneToOne: false
            referencedRelation: "Events"
            referencedColumns: ["EventID"]
          },
          {
            foreignKeyName: "Team_BelongsToEventID_fkey"
            columns: ["EventID"]
            isOneToOne: false
            referencedRelation: "ActivityProgressLog"
            referencedColumns: ["EventID"]
          },
          {
            foreignKeyName: "Team_BelongsToEventID_fkey"
            columns: ["EventID"]
            isOneToOne: false
            referencedRelation: "EventStats"
            referencedColumns: ["EventID"]
          }
        ]
      }
    }
    Functions: {
      getActiveUsersBetweenDates: {
        Args: {
          start_date_param: string
          end_date_param: string
        }
        Returns: {
          active_date: string
          user_count: number
        }[]
      }
      getusersupdatedprogresscountforevent: {
        Args: {
          eventid: string
          datetoupdate: string
        }
        Returns: number
      }
      test1: {
        Args: {
          start_date_param: string
          end_date_param: string
        }
        Returns: {
          active_date: string
          user_count: number
        }[]
      }
    }
    Enums: {
      activitytypes: "Steps" | "Distance"
      ActivityTypes: "Steps" | "Distance"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never


export type SBEvent = Tables<'Events'>;
export type SBTeamStats = Tables<'TeamStats'>;
export type SBTeam = Tables<'Teams'>;
