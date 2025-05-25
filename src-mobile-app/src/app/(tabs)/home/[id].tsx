import { Stack, useLocalSearchParams } from "expo-router";
import { H3, YStack, Image, XStack, Text, Button, useTheme, View, Card, H4, H5 } from "tamagui";
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
import { fetchEventUsers, selectEventUsers, selectIndividualLeaderboard } from "../../../store/individualLeaderboardSlice";
import { selectMyTeams } from "../../../store/teamsSlice";
import { selectTodaysProgress } from "../../../store/activityProgressSlice";


export default function HomeEventDetails() {
  const theme = useTheme();
  const dispatch = useTypedDispatch();

  const slugEventID = useLocalSearchParams().id;
  const event = useTypedSelector<SBEvent[]>(store => store.eventsSlice.events)
    .find(ev => ev.EventID === slugEventID);

  if (event == undefined) return null

  //get progress, team, and user data
  const teamsList = useSelector(state => selectEventTeams(state, event?.EventID))
  const myTeams = useSelector(selectMyTeams);
  const myTeam = myTeams.find((team) => team.BelongsToEventID == event.EventID)
  const usersList = useSelector(state => selectEventUsers(state, event?.EventID))
  const activityProgressList = useSelector(selectTodaysProgress)
  const activityProgress = activityProgressList.find((team) => team.BelongsToTeamID == myTeam?.TeamID)

  let rewards = 0
  let existsNextTier = false
  let toNextTier = 0
  if (activityProgress){
    for (let i = 0; i < event.AchievementCount; i++){
      if (activityProgress.RawProgress >= Number(event.Achievements[i])){
        rewards++
      } else if (!existsNextTier){//checks if there is another tier and calculates amount needed to reach it
        toNextTier = Number(event.Achievements[i]) - activityProgress.RawProgress
        existsNextTier = true
      }
    }
  }
  

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

          <Card height={"auto"} width={"100%"} paddingHorizontal={"$2.5"}elevation={"$0.25"}>
            <View padding={"$2"}>
              <YStack>
                <XStack>
                  <H4 textAlign="left" width={"80%"}>{activityProgress?.RawProgress} / {event.Achievements[event.AchievementCount - 1]} {typeUnit}</H4>
                  <H4 textAlign="right" width={"20%"}>{rewards} 🍃 </H4>
                </XStack>
                {existsNextTier ? (<H5>{toNextTier} {typeUnit} until next tier</H5>) : false}
                {
                  event.Achievements.map((tier, index) => (
                  <View key={tier}>
                    <XStack>
                      <Text paddingVertical={"$1.5"}>{event.Achievements[index]}   </Text>
                      {index+1 <= rewards ? <Text>✅</Text> : <Text>❌</Text>}
                    </XStack>
                    </View>
                  ))}
              </YStack>
            </View>
          </Card>

          <TeamLeaderboardCard teamList={teamsList}/>

          <IndividualLeaderboardCard usersList={usersList}/>

        </YStack>
      </ScrollView>
      
    </>
  )
}