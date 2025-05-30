import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';
import { RootState } from './store';
import { selectMyOngoingEvents } from './eventsSlice';
import { SBTeam, SBTeamsProfiles } from '../lib/models';

export interface TeamsState {
  teams: SBTeam[]
  myTeams: SBTeam[]
}

const initialState: TeamsState = {
  teams: [],
  myTeams: []
}

export const fetchTeams = createAsyncThunk<
  SBTeam[],
  undefined,
  { rejectValue: string }
>('events/fetchTeams', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('Teams')
    .select('*')
  if (error) return rejectWithValue(error.message);
  return data ?? [];
});

export const fetchMyTeams = createAsyncThunk<
  SBTeam[],
  undefined,
  { rejectValue: string }
>('events/fetchMyTeams', async (_, { rejectWithValue, getState }) => {
  const userID = (getState() as RootState).systemSlice.userID;
  if (!userID) return rejectWithValue('User ID not found');

  const { data, error } = await supabase
    .from("TeamsProfiles")
    .select(`TeamID, 
         Teams(
            BelongsToEventID,
            CreatedAt,
            Name,
            UpdatedAt,
            RewardCount
        )`)
    .eq('ProfileID', userID);

  if (error) return rejectWithValue(error.message);

  const newData = data.map((team) => ({
    BelongsToEventID: team.Teams.BelongsToEventID,
    CreatedAt: team.Teams.CreatedAt,
    Name: team.Teams.Name,
    TeamID: team.TeamID,
    UpdatedAt: team.Teams.UpdatedAt,
    RewardCount: team.Teams.RewardCount
  }))

  return newData ?? [];
});

export const createTeam = createAsyncThunk<
  SBTeam,
  { name: string, eventID: string },
  { rejectValue: string }
>('events/createTeam', async ({ name, eventID }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('Teams')
    .insert({
      Name: name,
      BelongsToEventID: eventID,
      RewardCount: 0
    })
    .select()
    .single();
  if (error) return rejectWithValue(error.message);
  return data;
});

export const joinTeam = createAsyncThunk<
  SBTeamsProfiles,
  { profileID: string, teamID: string },
  { rejectValue: string }
>('events/joinTeam', async ({ profileID, teamID }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('TeamsProfiles')
    .insert({
      TeamID: teamID,
      ProfileID: profileID,
      RewardCount: 0
    })
    .select()
    .single();
  if (error) return rejectWithValue(error.message);
  return data;
});



const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchTeams.fulfilled, (state, action) => {
      return { ...state, teams: action.payload }
    });
    builder.addCase(fetchMyTeams.fulfilled, (state, action) => {
      return { ...state, myTeams: action.payload }
    });
  }
});

export default teamsSlice.reducer;

// Select this slice
const selectSelf = (state: RootState) => state.teamsSlice;

// Select the current user profile
export const selectTeams = createSelector(
  selectSelf,
  (state) => state.teams
);

export const selectMyTeams = createSelector(
  selectSelf,
  (state) => state.myTeams
);

export const selectMyOngoingTeams = createSelector(
  selectMyTeams,
  selectMyOngoingEvents,
  (myTeams, events) => {
    return myTeams.filter(t => events.some(e => e.EventID === t.BelongsToEventID));
  }
);
