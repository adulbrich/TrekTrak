import { createAsyncThunk, createSelector, createSlice, current } from '@reduxjs/toolkit';
import { useSelector } from "react-redux";
import { supabase } from '../lib/supabase';
import { RootState } from './store';
import { SBEvent, SBTeam } from '../lib/models';
import { selectMyEvents } from './eventsSlice';
import teamsSlice from './teamsSlice';

export interface TeamLeaderboardState {
    teams: SBTeam[]
}
  
  const initialState: TeamLeaderboardState = {
    teams: []
}

export const fetchTeamLeaderboard = createAsyncThunk(
    'teamLeaderboard/fetchTeamleaderboard',
    async (currentEvents: SBEvent[] | null, thunkAPI) => { 

        //get array of event IDs
        const eventIDs = currentEvents?.map(item => item.EventID)

        //get all teams associated with any of the events the user is participating in
        const { data, error } = await supabase
            .from('Teams')
            .select('*')
            .in('BelongsToEventID', eventIDs ?? [])

        if (error) throw error
        console.log("ALL TEAMS: ", data)

        return data
    }
)

const teamLeaderboardSlice = createSlice({
    name: 'teamLeaderboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTeamLeaderboard.fulfilled, (state, action) => {
            state.teams = action.payload
            console.log("EVENT TEAMS: ", state.teams)

        }),
        builder.addCase(fetchTeamLeaderboard.rejected, (state, action) => {
            console.error("TEAM LEADERBOARD ERROR: ", action.error)
        })
    }

})

export default teamLeaderboardSlice.reducer
const selectSelf = (state: RootState) => state.teamLeaderboardSlice;
export const selectTeamLeaderboard = (state: RootState) => state.teamLeaderboardSlice.teams
const getEventID = (_: any, EventID: any) => EventID;

//select all the teams from the user's event
export const selectEventTeams = createSelector(
    selectTeamLeaderboard,
    getEventID,
    (teams, eventID) => {
        console.log("Event ID:", eventID)
        return teams.filter((team) => team.BelongsToEventID == eventID)
    }
)