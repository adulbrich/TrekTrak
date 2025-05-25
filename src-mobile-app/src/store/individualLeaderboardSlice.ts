import { createAsyncThunk, createSelector, createSlice, current } from '@reduxjs/toolkit';
import { useSelector } from "react-redux";
import { supabase } from '../lib/supabase';
import { RootState } from './store';
import { SBProfile, SBTeamsProfiles } from '../lib/models';
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
    async (eventID: string | null, thunkAPI) => { 

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
            .eq('Teams.BelongsToEventID', eventID ?? "")
            

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