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
import { fetchDistanceDataIOS, fetchHealthDataAndroid, fetchStepsDataIOS, initHealthDataIOS } from "../store/healthDataSlice";
import { Platform } from "expo-modules-core";

export default function Index() {
  const { session, isReady, getSession } = useAuth();
  const dispatch = useTypedDispatch();
  const UserID = useSelector(selectUserID)
  const currentEvents = useSelector(selectMyEvents)
  const currentDate = new Date()

  // We use this to key 
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (Platform.OS === 'ios'){
      console.log("USING IOS")
      initHealthDataIOS()
      dispatch(fetchStepsDataIOS())
      dispatch(fetchDistanceDataIOS())
    } else {//use android instead
      console.log("USING ANDROID")
      dispatch(fetchHealthDataAndroid())
    }
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