import { useSelector } from "react-redux";
import { Button, YStack, useTheme, H4, XStack, ScrollView, H3, H2, H5, Text, View, CardProps, Card , Image} from "tamagui";
import { fetchTeamStatsBreakdown, selectMyTeamStats } from "../../../store/teamStatsSlice";
import { SafeAreaView, StyleSheet} from "react-native";
import { useTypedDispatch, useTypedSelector } from "../../../store/store";
import { fetchCurrentEvents, fetchEvents, fetchMyEvents, selectEvents } from "../../../store/eventsSlice";
import React, { useEffect } from "react";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useAssets } from "expo-asset";
import { SBEvent, SBTeamStats } from "../../../lib/supabase-types";
import { selectMyProfile } from "../../../store/profilesSlice";
import { selectMyProfileStats } from "../../../store/profileStatsSlice";
import { useAuth } from "../../../features/system/Auth";
import { SBEventStatus, selectMyEvents, selectFilteredEvents, setSelectedStatus } from "../../../store/eventsSlice";
import HomeEventCard from "../../../features/home/HomeEventCard";
import { selectUserID } from "../../../store/systemSlice";
import { fetchProfile } from "../../../store/profileSlice";
import { fetchTeamLeaderboard } from "../../../store/teamLeaderboardSlice";
import { fetchEventUsers } from "../../../store/individualLeaderboardSlice";
import { fetchTodaysProgress } from "../../../store/activityProgressSlice";
import { fetchMyTeams } from "../../../store/teamsSlice";



export default function Home() {
  const dispatch = useTypedDispatch();
  const UserID = useSelector(selectUserID)
  const currentEvents = useSelector(selectMyEvents)
  const currentDate = new Date()

  useEffect(() => {
    dispatch(fetchProfile(UserID))
    dispatch(fetchEvents());
    dispatch(fetchCurrentEvents(UserID));
    dispatch(fetchTeamLeaderboard(currentEvents));
    dispatch(fetchEventUsers(currentEvents));
    dispatch(fetchTodaysProgress({date: currentDate, userID: UserID ?? ""}))
    dispatch(fetchMyTeams());
  }, [dispatch])
  
  const pressCallback = React.useCallback(() => {
    router.push({
      pathname: `/home/past-events`
    })
  }, []);

  return (
    <SafeAreaView>
      <ScrollView height={'100%'} padding="$3">
       <YStack flex={1} paddingHorizontal={"$2"} paddingBottom={"$8"} space>
       <Stack.Screen options={{ title: 'Home', headerShown: false }} />
        <XStack alignItems="center">
          <H2 width={"60%"}>Home</H2>
          <H5 width={"40%"} textAlign={"right"} paddingRight={"$1"} onPress={pressCallback}>Past Events</H5>
        </XStack>
        
        {currentEvents.map(ev => (currentDate > (new Date(ev.EndsAt))) ? <View key={ev.EventID}/> : <HomeEventCard key={ev.EventID} event={ev} /> )}
       </YStack>
      </ScrollView>
    </SafeAreaView>
  );

}