import { Stack, useLocalSearchParams } from "expo-router";
import { H3, YStack, Image, XStack, Text, Button, useTheme, View } from "tamagui";
import { Text as RN_Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTypedDispatch, useTypedSelector } from "../../../store/store";
import { SBEvent, SBTeamStats } from "../../../lib/supabase-types";
import { useAssets } from "expo-asset";
import { getDateString } from "../../../lib/helpers";
//import { useAuth } from "../../../lib/supabase";
import React, { useEffect, useState } from "react";
import { setActiveEvent } from "../../../store/eventsSlice";
import { blue } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { widths } from "@tamagui/config";
import { FlatList } from "react-native";
import TeamLeaderboardCard from "../../../features/home/TeamLeaderboardCard";
import IndividualLeaderboardCard from "../../../features/home/IndividualLeaderboardCard";
import { useAuth } from "../../../features/system/Auth";
import { supabase } from "../../../lib/supabase";
import { useSelector } from "react-redux";
import { selectEventTeams } from "../../../store/teamLeaderboardSlice";


export default function HomeEventDetails() {
  const theme = useTheme();
  const dispatch = useTypedDispatch();

  const slugEventID = useLocalSearchParams().id;
  const event = useTypedSelector<SBEvent[]>(store => store.eventsSlice.events)
    .find(ev => ev.EventID === slugEventID);

    //get teams in event
   const teamsList = useSelector(state => selectEventTeams(state, event?.EventID))
   console.log("Teams: ", teamsList)

  

  var typeUnit = "";
  if (event?.Type == "Distance"){
    typeUnit = "mi";
  } else if (event?.Type == "Steps"){
    typeUnit = "steps";
  }


  const [assets] = useAssets([

    require('../../../../assets/images/preview_square.jpg'),
    require('../../../../assets/images/preview_wide.jpg'),
    require('../../../../assets/icons/down-chevron.png')

  ]);


  if (!event || !assets) return null;

  return (
    <>
      <Stack.Screen
        options={{
          headerTintColor: "#000000",
          title: event.Name,
          headerShown: true,
          headerBackTitle: 'Home',
          headerStyle: {
            backgroundColor: theme.background.get()
          },
        }}
      />

      <ScrollView
      style={{ flex: 20}}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={true}

      >
        <YStack flex={1} justifyContent="flex-start" alignItems="flex-start" padding="$4" gap={'$4'}>

          {/* Event image */}
          <YStack borderRadius={"$4"} overflow="hidden" width={'100%'} height={'$10'}>
            <Image
              width={'100%'}
              height={'100%'}
              resizeMode="stretch"
              source={{ uri: assets[1].uri, width: assets[1].width!, height: assets[1].height! }}
              />
          </YStack>

          {/* Event box for dates, description*/}
          <YStack 
            width={'100%'} 
            padding="$4" 
            paddingTop="$3"
            borderWidth={1} 
            borderRadius={"$4"}
            borderColor="#898A8D"
            >

            {/* Event Name */}
            <YStack>
              <Text color="black" fontSize="$9" fontWeight="bold" paddingVertical="$1">
                {event.Name}
              </Text>

              <Text color='black' fontSize="$5" paddingVertical="$1">
                { getDateString(event.StartsAt) } - { getDateString(event.EndsAt) }
              </Text>

              <Text color='black' fontSize="$5" paddingVertical="$1">
                Competition Type: { event.Type }
              </Text>

              <YStack marginVertical="$2.5" alignItems="center">
                <YStack width={'100%'} 
                  padding="$3" 
                  //borderWidth={1} 
                  borderRadius="$4"
                  borderRightWidth={1}
                  borderLeftWidth={1}
                  borderColor="#ccc" 
                  backgroundColor="#f8f8f8"
                  maxHeight="$20"
                  shadowRadius=""
                  shadowColor="black"
                >
                  <Text color="black" fontSize="$5">{event.Description}</Text>
                </YStack>
              </YStack>

            </YStack>

          </YStack>

          <Text>Team Leaderboard</Text>
          <TeamLeaderboardCard teamList={teamsList}/>

          <Text>Individual Leaderboard</Text>
          <IndividualLeaderboardCard />
          

        </YStack>
      </ScrollView>
      
    </>
  )
}