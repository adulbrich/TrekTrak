import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';
import { RootState } from './store';
import { SBEvent } from '../lib/models';

export enum SBEventStatus {
  UPCOMING,
  ONGOING,
  PAST
}

function filterSBEventsByStatus(events: SBEvent[], status: SBEventStatus): SBEvent[] {
  const currentTime = new Date().getTime();

  return events.filter(ev => {
    const eventStarts = new Date(ev.StartsAt).getTime();
    const eventEnds = new Date(ev.EndsAt).getTime();

    switch (status) {
      case SBEventStatus.UPCOMING:
        return currentTime < eventStarts;
      case SBEventStatus.ONGOING:
        return currentTime < eventEnds && currentTime > eventStarts;
      case SBEventStatus.PAST:
        return currentTime > eventEnds;
    }
  });
}

export interface EventsState {
  activeEvent: SBEvent | null
  events: SBEvent[]
  selectedStatus: SBEventStatus

  // Events that we can submit results for
  myEvents: SBEvent[]
}

const initialState: EventsState = {
  activeEvent: null,
  events: [],
  myEvents: [],
  selectedStatus: SBEventStatus.ONGOING
}

export const fetchEvents = createAsyncThunk<SBEvent[], undefined, { rejectValue: string }>('events/fetchEvents', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('Events')
    .select('*')
    .returns<SBEvent[] | null>();
  if (error) return rejectWithValue(error.message);
  return data ?? [];
});

// Fetches events that are current and that the user is participating in
export const fetchMyEvents = createAsyncThunk<SBEvent[], undefined, { rejectValue: string }>(
  'events/fetchMyEvents',
  async (_, { rejectWithValue, getState }) => {
    console.log('fetchMyEvents()');
    // Extract user ID from system slice
    const userID: any = (getState() as RootState).systemSlice.userID;
    if (!userID) return rejectWithValue('User ID not found');

    // Find relevent events
    const { data, error } = await supabase
      .from('Profiles')
      .select(`
        *,
        Teams(
          *,
          Events(*)
        )
      `)
      .eq('ProfileID', userID)
      .maybeSingle();

    if (error) return rejectWithValue(error.message);
    return data?.Teams.flatMap(t => t.Events ?? []) ?? [];
  }
);

export const fetchCurrentEvents = createAsyncThunk(
  'events/fetchCurrentEvents',
  async (userID: string | null, thunkAPI) => { 
      console.log("Fetching Events for User: ", userID)
      
      //first get all the team IDs the user is associated with
      const { data: teamIDs, error: teamsProfilesError } = await supabase
        .from('TeamsProfiles')
        .select('TeamID')
        .eq('ProfileID', userID ?? "")

      if (teamsProfilesError) {
        console.error('Error fetching team IDs:', teamsProfilesError)
        return []
      }   

      const teamIDsArray = teamIDs.map(item => item.TeamID);

      //next, get all associated events that match with the team IDs
      const { data: eventIDs, error: teamsError} = await supabase
        .from('Teams')
        .select('BelongsToEventID')
        .in('TeamID', teamIDsArray)

        if (teamsError) {
          console.error('Error fetching event IDs:', teamsError)
          return []
        } 

        const eventIDsArray = eventIDs.map(item => item.BelongsToEventID);

        //now that we have the event IDs of the events the user is participating in, get the event info for all of them
      const { data: events, error: eventsError } = await supabase
        .from('Events')
        .select('*')
        .in('EventID', eventIDsArray)

        if (eventsError) {
          console.error('Error fetching events', eventsError)
          return []
        } 

      return events
  }
)

// Create the events slice
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setActiveEvent: (state, action) => {
      state.activeEvent = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      return { ...state, events: action.payload }
    });

    builder.addCase(fetchCurrentEvents.fulfilled, (state, action) => {
      return { ...state, myEvents: action.payload }
    });

    // builder.addCase(fetchCurrentEvents.fulfilled, (state, action) => {
    //   state.myEvents = action.payload
    // })
  }
});

// Actions and reducers
export const { setActiveEvent, setSelectedStatus } = eventsSlice.actions;
export default eventsSlice.reducer;

// Select this slice
const selectSelf = (state: RootState) => state.eventsSlice;

export const selectActiveEvent = createSelector(
  selectSelf,
  (state) => state.activeEvent
);

// Selectors
export const selectFilteredEvents = createSelector(
  selectSelf,
  (state) => {
    return filterSBEventsByStatus(state.events, state.selectedStatus);
  }
);

export const selectEvents = createSelector(
  selectSelf,
  (state) => state.events
);


export const selectMyEvents = (state: RootState) => state.eventsSlice.myEvents;


// Select the current user profile
export const selectMyOngoingEvents = createSelector(
  selectSelf,
  (state) => state.myEvents.filter(
    e => new Date(e.StartsAt).getTime() < new Date().getTime() &&
         new Date(e.EndsAt).getTime()   > new Date().getTime()
  )
);