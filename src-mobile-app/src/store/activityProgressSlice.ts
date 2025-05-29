import { createAsyncThunk, createSelector, createSlice, current } from '@reduxjs/toolkit';
import { useSelector } from "react-redux";
import { supabase } from '../lib/supabase';
import { RootState } from './store';
import { SBProgress } from '../lib/models';
import { selectMyEvents } from './eventsSlice';
import teamsSlice from './teamsSlice';
import { type } from 'os';
import teamLeaderboardSlice from './teamLeaderboardSlice';

export interface ActivityProgressState {
    progress: SBProgress[]
    eventProgress: SBProgress[]
}
  
  const initialState: ActivityProgressState = {
    progress: [],
    eventProgress: []
}

//gets every activityProgress record for the user for the current day
export const fetchTodaysProgress = createAsyncThunk(
    'activityProgress/fetchTodaysProgress',
    async (props: {date: Date, userID: string}, thunkAPI) => { 
        
        //to get the record for the current day
        const startOfDay = new Date(props.date.setHours(0, 0, 0, 0)).toISOString()
        const endOfDay = new Date(props.date.setHours(23, 59, 59, 999)).toISOString()
        
        const { data, error } = await supabase
            .from('ActivityProgress')
            .select('*')
            .eq('CreatedByProfileID', props.userID)
            .gte('CreatedAt', startOfDay)
            .lte('CreatedAt', endOfDay)

        if (error) throw error

        return data
    }
)

//gets all of a user's activityProgress records for a single event
export const fetchEventProgress = createAsyncThunk(
    'activityProgress/fetchEventProgress',
    async (props: {teamID: string, userID: string}, thunkAPI) => { 
        
        const { data, error } = await supabase
            .from('ActivityProgress')
            .select('*')
            .eq('CreatedByProfileID', props.userID)
            .eq('BelongsToTeamID', props.teamID)
  
        if (error) throw error

        return data
    }
)


export const insertTodaysProgress = createAsyncThunk(
    'activityProgress/insertTodaysProgress',
    async (props: {userID: string, teamID: string, type: string, progress: number}, thunkAPI) => { 
        if (!props.userID) return
        if (!props.teamID) return

        console.log("INSERTING TODAYS PROGRESS")

        let isSteps = false
        if (props.type == "Steps") isSteps = true

        const { data, error } = await supabase
            .from('ActivityProgress')
            .insert({
                ActivityType: isSteps ? "Steps" : "Distance",
                BelongsToTeamID: props.teamID,
                CreatedByProfileID: props.userID,
                RawProgress: props.progress
            })
            .select()
            .single()

        console.log("TODAYS DATA ERROR: ", error)
        console.log("TODAYS DATA: ", data)

        if (error) throw error

        return data
    }
)


export const updateTodaysProgress = createAsyncThunk(
    'activityProgress/updateTodaysProgress',
    async (props: {activityProgressID: string, progress: number}, thunkAPI) => { 
        console.log("UPDATED PROGRESS VALUE: ", props.progress)
        
        const { data, error } = await supabase
            .from('ActivityProgress')
            .update({RawProgress: props.progress})
            .eq('ActivityProgressID', props.activityProgressID)
            .select()
            .single()

        if (error) throw error

        return data
    }
)



const activityProgressSlice = createSlice({
    name: 'activityProgress',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTodaysProgress.fulfilled, (state, action) => {
            state.progress = action.payload

        }),
        builder.addCase(fetchTodaysProgress.rejected, (state, action) => {
            console.error("ACTIVITY PROGRESS ERROR: ", action.error)
        }),
        builder.addCase(fetchEventProgress.fulfilled, (state, action) => {
            state.eventProgress = action.payload

        }),
        builder.addCase(fetchEventProgress.rejected, (state, action) => {
            console.error("EVENT ACTIVITY PROGRESS ERROR: ", action.error)
        })
    }

})


export default activityProgressSlice.reducer
export const selectTodaysProgress = (state: RootState) => state.activityProgressSlice.progress;
export const selectEventProgress = (state: RootState) => state.activityProgressSlice.eventProgress;