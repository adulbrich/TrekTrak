import { useSelector } from "react-redux";
import { Button, YStack, useTheme, H4, XStack, ScrollView, H3, H2, H5, Text, View, CardProps, Card , Image} from "tamagui";
import { fetchTeamStatsBreakdown, selectMyTeamStats } from "../../../store/teamStatsSlice";
import { SafeAreaView, StyleSheet} from "react-native";
import { useTypedDispatch, useTypedSelector } from "../../../store/store";
import { fetchCurrentEvents, fetchEvents, fetchMyEvents, selectEvents } from "../../../store/eventsSlice";
import React, { useEffect } from "react";
import { useLocalSearchParams, Stack } from "expo-router";
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
import PastEventCard from "../../../features/home/PastEventCard";



export default function PastEventsPage() {
  const theme = useTheme();
  const currentEvents = useSelector(selectMyEvents)
  const currentDate = new Date()
  

  return (
    <SafeAreaView>
      <ScrollView height={'100%'} padding="$3">
       <YStack flex={1} paddingHorizontal={"$2"} paddingBottom={"$8"} space>
       <Stack.Screen options={{
          headerTintColor: "#000000",
          title: "",
          headerShown: true,
          headerBackTitle: 'Home',
          headerStyle: {
            backgroundColor: theme.background.get()
          },
        }} />
        <H2>Past Events</H2>
        {currentEvents.map(ev => (currentDate < (new Date(ev.EndsAt))) ? <View key={ev.EventID}/> : <PastEventCard key={ev.EventID} event={ev} /> )}
       </YStack>
      </ScrollView>
    </SafeAreaView>
  );

}