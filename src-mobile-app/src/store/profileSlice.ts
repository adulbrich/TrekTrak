import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';
import { RootState } from './store';
import { selectUserID } from './systemSlice';
import { SBProfile } from '../lib/models';


export interface ProfileState {
    CreatedAt: string,
    Name: string | null,
    ProfileID: string,
    UpdatedAt: string
}
  
const initialState: ProfileState = {
    CreatedAt: "",
    Name: "",
    ProfileID: "",
    UpdatedAt: ""
}

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (userID: string | null, thunkAPI) => { 
        console.log("Fetching Profile for User: ", userID)
        try {
            const { data, error } = await supabase
                .from('Profiles')
                .select()
                .eq('ProfileID', userID ?? "")
                .limit(1)
                .single()

            if (error) throw error;
            return data
    
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProfile.fulfilled, (state, action) => {
            state.CreatedAt = action.payload.CreatedAt,
            state.Name = action.payload?.Name ?? null,
            state.ProfileID = action.payload.ProfileID
            state.UpdatedAt = action.payload.UpdatedAt

        }),
        builder.addCase(fetchProfile.rejected, (state, action) => {
            console.log("STATE: ", action.payload)

        })
    }

})


export default profileSlice.reducer
const selectSelf = (state: RootState) => state.profileSlice;
export const selectProfile = selectSelf
