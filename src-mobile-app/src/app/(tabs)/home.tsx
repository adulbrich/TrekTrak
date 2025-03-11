import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button, YStack, useTheme, H4, XStack, ScrollView, H3, H2, Text, View, Image
} from "tamagui";
import { SafeAreaView } from "react-native";
import { useTypedDispatch, useTypedSelector } from "../../store/store";
import { fetchTeamStatsBreakdown, selectMyTeamStats } from "../../store/teamStatsSlice";
import { selectEvents } from "../../store/eventsSlice";
import { selectMyProfile } from "../../store/profilesSlice";
import { selectMyProfileStats } from "../../store/profileStatsSlice";
import { useAuth } from "../../features/system/Auth";
import { useAssets } from "expo-asset";

export default function Home() {
  const theme = useTheme();
  const dispatch = useTypedDispatch();

  const myProfile = useTypedSelector(selectMyProfile);
  const myProfileStats = useTypedSelector(selectMyProfileStats);
  const myTeamStats = useTypedSelector(selectMyTeamStats);
  const events = useTypedSelector(selectEvents);
  const allTeamStats = useTypedSelector(state => state.teamStatsSlice.teamStats);
  
  const { user } = useAuth();
  const [header, setHeader] = useState("Welcome");
  const [assets] = useAssets([require('../../../assets/images/preview_wide.jpg')]);

  // Set Header Name
  useEffect(() => {
    if (myProfile?.Name) {
      setHeader(`Welcome, ${myProfile.Name.split(" ")[0]}`);
    } else {
      console.log("No Profile Found");
    }
  }, [myProfile]);

  // Fetch Team Stats on Mount
  useEffect(() => {
    dispatch(fetchTeamStatsBreakdown());
  }, [dispatch]);

  // Sort Teams by Score
  const sortedTeamStats = [...allTeamStats].sort((a, b) => (b.TotalScore || 0) - (a.TotalScore || 0));

  // Get Logged User's Team Rank
  const loggedUserTeam = myTeamStats.length > 0 ? myTeamStats[0].TeamID : null;
  const teamRank = sortedTeamStats.findIndex(team => team.TeamID === loggedUserTeam) + 1;

  // Map Events with Team Stats
  const eventStats = myTeamStats.map(ts => ({
    ...ts,
    Event: events.find(ev => ev.EventID === ts.EventID)
  }));

  return (
    <SafeAreaView>
      <ScrollView height="100%" padding="$3">
        <H2 style={{ textAlign: "center" }}>{header}</H2>

        <YStack justifyContent="center" alignItems="center" width="100%" flex={1} gap="$10">
          
          {eventStats.map(ts => (
            <YStack alignSelf="flex-start" marginTop="$2" width="93%" key={ts.EventID}>
              <H3 alignSelf="flex-start" marginBottom="$2" style={{ textAlign: "center" }}>
                Current Event
              </H3>
              
              <XStack borderRadius={15} backgroundColor={theme.background.get()} width="100%"
                shadowColor="black" shadowRadius={1} shadowOffset={{ width: 1, height: 1 }} shadowOpacity={0.5}>
                
                <Image
                  width={85}
                  height={85}
                  borderRadius={15}
                  source={assets ? assets[0] : require("../../../assets/images/preview_wide.jpg")}
                />
                
                <YStack marginLeft="$2" width="100%">
                  <H4 fontSize="$6" alignSelf="flex-start" margin="$1" style={{ textAlign: "center" }}>
                    {ts.Event?.Name}
                  </H4>
                  <Text color="#D73F09" alignSelf="flex-start" margin="$1" style={{ textAlign: "center" }}>
                    {ts.Event?.EndsAt
                      ? `${Math.floor((new Date(ts.Event.EndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining`
                      : "No event end date"}
                  </Text>
                </YStack>
              </XStack>

              {/* Scores Section */}
              <XStack marginTop="$5" width="100%" justifyContent="space-between">
                <YStack alignItems="center" margin="$3">
                  <H4>Your Score</H4>
                  <H3 fontSize="$8" color="#D73F09" marginTop="$3">
                    {myProfileStats?.TotalScore ?? 0}
                  </H3>
                </YStack>

                <XStack style={{ borderLeftWidth: 1, borderColor: "black", height: 100 }} />

                <YStack alignItems="center" margin="$3">
                  <H4>Team Score</H4>
                  <H3 fontSize="$8" color="#D73F09" marginTop="$3">
                    {ts.TotalScore ?? 0}
                  </H3>
                </YStack>
              </XStack>

              {/* Leaderboard */}
              <H3 margin="$4" alignSelf="center" style={{ textAlign: "center" }}>
                Leaderboard
              </H3>
              <YStack width="95%">
                {sortedTeamStats.length === 0 ? <Text>No data yet</Text> : null}
                {sortedTeamStats.slice(0, 3).map((team, idx) => (
                  <XStack marginBottom="$4" width="100%" justifyContent="space-between" key={team.TeamID}>
                    <Image width={25} height={25} borderRadius={50} alignSelf="center"
                      source={assets ? assets[0] : require("../../../assets/images/preview_wide.jpg")}
                    />
                    <Text fontWeight={800} alignSelf="center">{idx + 1}</Text>
                    <XStack width="100%">
                      <XStack marginLeft="$1" width="100%" justifyContent="space-between">
                        <Text fontWeight={600} alignSelf="center">{team.Name}</Text>
                        <Text fontSize={16} fontWeight={800}>{team.TotalScore}</Text>
                      </XStack>
                    </XStack>
                  </XStack>
                ))}
              </YStack>

              {/* User Team Placement */}
              <XStack borderColor="#D73F09" borderWidth={1} alignItems="center" alignSelf="center"
                width="110%" flex={1} borderRadius={10} backgroundColor="#FBCEB1" margin="$2"
                padding="$2" justifyContent="space-around" style={{ position: "relative", left: 10 }}>
                
                <XStack width="50%" justifyContent="space-around">
                  <Image width={25} height={25} borderRadius={50} alignSelf="center"
                    source={assets ? assets[0] : require("../../../assets/images/preview_wide.jpg")}
                  />
                  <Text fontWeight={800} alignSelf="center">{teamRank}</Text>
                  <Text alignSelf="center">
                    {myTeamStats.length > 0 ? myTeamStats[0].TeamName : "N/A"}
                  </Text>
                </XStack>
                <Text fontWeight={800} marginLeft="$12" alignSelf="center">
                  {myTeamStats.length > 0 ? myTeamStats[0].TotalScore : 0}
                </Text>
              </XStack>
            </YStack>
          ))}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
