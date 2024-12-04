import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';
import { RootState } from './store';
import { selectUserID } from './systemSlice';
import { SBProfile } from '../lib/models';


export interface ProfilesState {
  profiles: SBProfile[]
}

const initialState: ProfilesState = {
  profiles: []
}

export const fetchProfiles = createAsyncThunk<SBProfile[], undefined, { rejectValue: string }>('events/fetchProfiles', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('Profiles')
    .select('*')
    .returns<SBProfile[] | null>();
  if (error) return rejectWithValue(error.message);
  return data ?? [];
});

const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchProfiles.fulfilled, (state, action) => {
      return { ...state, profiles: action.payload }
    })
  }
});

// Select this slice
const selectSelf = (state: RootState) => state.profilesSlice;

// Select the current user profile
export const selectMyProfile = createSelector(
  selectSelf,
  selectUserID,
  (state, userID) => state.profiles.find(profile => profile.ProfileID === userID)
);

export default profilesSlice.reducer;