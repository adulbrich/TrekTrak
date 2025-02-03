import { createDraftSafeSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface SystemState {
  userID: string | null
}

const initialState: SystemState = {
  userID: null
}

//Testing profile info: userID is properly added here
const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setUserID: (state, action) => {
      state.userID = action.payload;
    }
  }
});

const selectSelf = (state: RootState) => state.systemSlice;
export const selectUserID = createDraftSafeSelector(selectSelf, (state) => state.userID);

export const { setUserID } = systemSlice.actions;
export default systemSlice.reducer;