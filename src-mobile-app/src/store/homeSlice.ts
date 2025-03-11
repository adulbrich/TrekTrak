import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HomeState {
  teamID: string | null;
  teamName: string | null;
  loading: boolean;
}

const initialState: HomeState = {
  teamID: null,
  teamName: null,
  loading: false,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setTeamInfo: (state, action: PayloadAction<{ teamID: string; teamName: string }>) => {
      state.teamID = action.payload.teamID;
      state.teamName = action.payload.teamName;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setTeamInfo, setLoading } = homeSlice.actions;
export default homeSlice.reducer;
