import { createAsyncThunk, createSelector, createSlice, current } from '@reduxjs/toolkit';
import { useSelector } from "react-redux";
import { supabase } from '../lib/supabase';
import { RootState } from './store';
import { SBEvent, SBProfile, SBTeamsProfiles } from '../lib/models';
import { selectMyEvents } from './eventsSlice';
import teamsSlice from './teamsSlice';

export interface IndividualLeaderboardState {
    profiles: {
        ProfileID: string,
        TeamID: string,
        RewardCount: number,
        Teams: {
            BelongsToEventID: string
        },
        Profiles: {
            Name: string | null
        }
    }[]
}
  
const initialState: IndividualLeaderboardState = {
    profiles: []
}

export const fetchEventUsers = createAsyncThunk(
    'individualLeaderboard/fetchEventUsers',
    async (currentEvents: SBEvent[] | null, thunkAPI) => { 

        //get array of event IDs
        const eventIDs = currentEvents?.map(item => item.EventID)

        //get all users stats for the given event
        const { data, error } = await supabase
            .from('TeamsProfiles')
            .select(`ProfileID,
                    TeamID,
                    RewardCount,
                    Teams!inner(
                    BelongsToEventID
                    ),
                    Profiles(
                    Name
                    )`)
            .in('Teams.BelongsToEventID', eventIDs ?? [])
            

        if (error) throw error

        return data
    }
)

const individualLeaderboardSlice = createSlice({
    name: 'individualLeaderboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchEventUsers.fulfilled, (state, action) => {
            state.profiles = action.payload
        }),
        builder.addCase(fetchEventUsers.rejected, (state, action) => {
            console.error("INDIVIDUAL LEADERBOARD ERROR: ", action.error)
        })
    }

})


export default individualLeaderboardSlice.reducer
export const selectIndividualLeaderboard = (state: RootState) => state.individualLeaderboardSlice.profiles;

const getEventID = (_: any, EventID: any) => EventID;

//select all the teams from the user's event
export const selectEventUsers = createSelector(
    selectIndividualLeaderboard,
    getEventID,
    (users, eventID) => {
        console.log("Event ID:", eventID)
        return users.filter((user) => user.Teams.BelongsToEventID == eventID)
    }
)