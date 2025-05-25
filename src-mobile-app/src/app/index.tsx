import { Text } from "tamagui";
import { Redirect, useRootNavigationState } from "expo-router";
import { useAuth } from "../features/system/Auth";
import { useTypedDispatch } from "../store/store";
import { useEffect } from "react";
import { fetchProfiles } from "../store/profilesSlice";
import { fetchTeamStats, fetchTeamStatsBreakdown } from "../store/teamStatsSlice";
import { fetchProfileStats } from "../store/profileStatsSlice";
import { fetchEvents, fetchCurrentEvents, selectMyEvents } from "../store/eventsSlice";
import { fetchProfile } from '../store/profileSlice';
import { syncMyActivity } from "../store/progressSlice";
import { selectUserID } from "../store/systemSlice";
import { useSelector } from 'react-redux';
import { fetchMyTeams } from "../store/teamsSlice";
import { fetchTeamLeaderboard } from "../store/teamLeaderboardSlice";
import { fetchEventUsers } from "../store/individualLeaderboardSlice";
import { fetchTodaysProgress } from "../store/activityProgressSlice";

export default function Index() {
  const { session, isReady, getSession } = useAuth();
  const dispatch = useTypedDispatch();
  const UserID = useSelector(selectUserID)
  const currentEvents = useSelector(selectMyEvents)
  const currentDate = new Date()

  // We use this to key 
  const navigationState = useRootNavigationState();

  useEffect(() => {
    //dispatch(fetchProfiles());
    dispatch(fetchProfile(UserID))
    dispatch(fetchProfileStats());
    dispatch(fetchTeamStatsBreakdown());
    dispatch(fetchEvents());
    dispatch(fetchCurrentEvents(UserID));
    dispatch(fetchTeamLeaderboard(currentEvents));
    dispatch(fetchEventUsers(currentEvents));
    dispatch(fetchTodaysProgress({date: currentDate, userID: UserID ?? ""}))
    dispatch(fetchMyTeams());
    dispatch(fetchTeamStats());
    dispatch(syncMyActivity());
  }, [dispatch]);

  if (!isReady) {
    getSession();
    return <Text>Loading</Text>;
  }

  if (!navigationState?.key) {
    // Temporary fix for router not being ready.
    return null;
  }
  
  if (!session)
    return <Redirect href={'/(auth)/sign-in'} />;
  else
    return <Redirect href={'/(tabs)/home/home-page'} />;
}