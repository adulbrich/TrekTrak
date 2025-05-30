import { Stack, useLocalSearchParams } from "expo-router";
import { H3, YStack, Image, XStack, Text, Button, useTheme, View, Card, H4, H5 } from "tamagui";
import { Text as RN_Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTypedDispatch, useTypedSelector } from "../../../store/store";
import { SBEvent, SBTeamStats } from "../../../lib/supabase-types";
import { useAssets } from "expo-asset";
import { getDateString } from "../../../lib/helpers";
import React, { useEffect, useState } from "react";
import TeamLeaderboardCard from "../../../features/home/TeamLeaderboardCard";
import IndividualLeaderboardCard from "../../../features/home/IndividualLeaderboardCard";
import { useSelector } from "react-redux";
import { selectEventTeams } from "../../../store/teamLeaderboardSlice";
import { fetchEventUsers, selectEventUsers, selectIndividualLeaderboard } from "../../../store/individualLeaderboardSlice";
import { selectMyTeams } from "../../../store/teamsSlice";
import { fetchEventProgress, selectTodaysProgress } from "../../../store/activityProgressSlice";
import { selectUserID } from "../../../store/systemSlice";
import OverallProgressCard from "../../../features/home/OverallProgressCard";
import DailyProgressCard from "../../../features/home/DailyProgressCard";


export default function PastEventPage() {
  const theme = useTheme();
  const dispatch = useTypedDispatch();
  const UserID = useSelector(selectUserID)

  const eventID = useLocalSearchParams().eventID
  const event = useTypedSelector<SBEvent[]>(store => store.eventsSlice.events)
    .find(ev => ev.EventID === eventID)


  if (event == undefined) return null

  console.log("EVENT: ", event)

  //get team and user data
  const teamsList = useSelector(state => selectEventTeams(state, eventID))
  const myTeams = useSelector(selectMyTeams);
  const myTeam = myTeams.find((team) => team.BelongsToEventID == eventID)
  const usersList = useSelector(state => selectEventUsers(state, eventID))

  teamsList.sort((a, b) => b.RewardCount - a.RewardCount)
  usersList.sort((a, b) => b.RewardCount - a.RewardCount)

  if (myTeam == undefined) return null


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
          headerBackTitle: 'Back',
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
          <Card height={"auto"} width={"100%"} paddingHorizontal={"$2.5"}elevation={"$0.25"}>
            <View padding={"$2"}>
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
                <View width={'100%'} 
                  padding="$3" 
                  //borderWidth={1} 
                  borderRadius="$4"
                  backgroundColor="#f0f0f0"
                  maxHeight="$20"
                >
                  <Text color="black" fontSize="$5">{event.Description}</Text>
                </View>
              </YStack>

              <YStack paddingVertical={"$2"}>
                <XStack><H5 width={"70%"}> 🏆 Team: {teamsList[0].Name} </H5><H5 width={"20%"} textAlign={"right"}>{ teamsList[0].RewardCount} 🍃 </H5></XStack>
                <XStack><H5 width={"70%"}> 🏆 Individual: {usersList[0].Profiles.Name} </H5><H5 width={"20%"} textAlign={"right"}>{ usersList[0].RewardCount} 🍃 </H5></XStack>
              </YStack>

            </YStack>
            </View>
          </Card>
          
          <OverallProgressCard teamID={myTeam.TeamID} event={event} />

          <TeamLeaderboardCard teamList={teamsList}/>

          <IndividualLeaderboardCard usersList={usersList}/>

        </YStack>
      </ScrollView>
      
    </>
  )
}