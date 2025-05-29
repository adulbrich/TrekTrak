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
import { fetchEventProgress, selectTodaysProgress } from "../../../store/activityProgressSlice";
import DailyProgressCard from "../../../features/home/DailyProgressCard";
import { selectUserID } from "../../../store/systemSlice";


export default function HomeEventDetails() {
  const theme = useTheme();
  const dispatch = useTypedDispatch();
  const UserID = useSelector(selectUserID)

  const slugEventID = useLocalSearchParams().id;
  const event = useTypedSelector<SBEvent[]>(store => store.eventsSlice.events)
    .find(ev => ev.EventID === slugEventID);

  if (event == undefined) return null

  //get team and user data
  const teamsList = useSelector(state => selectEventTeams(state, event?.EventID))
  const myTeams = useSelector(selectMyTeams);
  const myTeam = myTeams.find((team) => team.BelongsToEventID == event.EventID)
  const usersList = useSelector(state => selectEventUsers(state, event?.EventID))

  if (myTeam == undefined) return null

  useEffect(() => {
    dispatch(fetchEventProgress({teamID: myTeam.TeamID, userID: UserID ?? ""}))
  }, [dispatch]);


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

            </YStack>
            </View>
          </Card>

          <DailyProgressCard teamID={myTeam.TeamID} event={event} />

          <TeamLeaderboardCard teamList={teamsList}/>

          <IndividualLeaderboardCard usersList={usersList}/>

        </YStack>
      </ScrollView>
      
    </>
  )
}