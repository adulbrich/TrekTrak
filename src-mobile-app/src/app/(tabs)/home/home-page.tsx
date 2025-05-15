import { useSelector } from "react-redux";
import { Button, YStack, useTheme, H4, XStack, ScrollView, H3, H2, H5, Text, View, CardProps, Card , Image} from "tamagui";
import { fetchTeamStatsBreakdown, selectMyTeamStats } from "../../../store/teamStatsSlice";
import { SafeAreaView, StyleSheet} from "react-native";
import { useTypedDispatch, useTypedSelector } from "../../../store/store";
import { fetchMyEvents, selectEvents } from "../../../store/eventsSlice";
import React, { useEffect } from "react";
import { useLocalSearchParams, Stack } from "expo-router";
import { useAssets } from "expo-asset";
import { SBEvent, SBTeamStats } from "../../../lib/supabase-types";
import { selectMyProfile } from "../../../store/profilesSlice";
import { selectMyProfileStats } from "../../../store/profileStatsSlice";
import { useAuth } from "../../../features/system/Auth";
import { SBEventStatus, selectMyEvents, selectFilteredEvents, setSelectedStatus } from "../../../store/eventsSlice";
import HomeEventCard from "../../../features/home/HomeEventCard";



export default function Home() {
  const currentEvents = useSelector(selectMyEvents)
  

  

  return (
    <SafeAreaView>
      <ScrollView height={'100%'} padding="$3">
       <YStack flex={1} paddingHorizontal={"$2"} paddingBottom={"$8"} space>
       <Stack.Screen options={{ title: 'Home', headerShown: false }} />
        <H2>Home</H2>
        {currentEvents.map(ev => <HomeEventCard key={ev.EventID} event={ev} /> )}
       </YStack>
      </ScrollView>
    </SafeAreaView>
  );

}