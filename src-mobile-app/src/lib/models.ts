import { Tables } from "./supabase-types";

export type SBEvent = Tables<'Events'>;
export type SBTeamStats = Tables<'TeamStats'>;
export type SBTeamProfileStats = Tables<'TeamStatsBreakdown'>;
export type SBEventStats = Tables<'EventStats'>;
export type SBProfile = Tables<'Profiles'>;
export type SBTeam = Tables<'Teams'>;
export type SBTeamsProfiles = Tables<'TeamsProfiles'>;
export type SBProfileStats = Tables<'ProfileStats'>;
export type SBProgress = Tables<'ActivityProgress'>;

export type TeamStats = {
  TeamName: string
  TeamID: string,
  TotalScore: number
  EventID: string
  Profiles: {
    ProfileID: string,
    ProfileName: string,
    TotalScore: number
  }[]
}