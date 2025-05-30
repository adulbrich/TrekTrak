import { AnimatePresence, Card, H3, H4, H5, Image, Text, View, XStack, YStack } from "tamagui";
import { Tables } from "../../lib/supabase-types";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useAssets } from "expo-asset";
import { LinearGradient } from 'tamagui/linear-gradient'
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../system/Auth";
import { SBTeam} from "../../lib/supabase-types";
import { MoveRight } from "@tamagui/lucide-icons";

type Props = {
    teamList: SBTeam[]
}

export default function TeamLeaderboardCard({ teamList }: Props) {
  let displayList = []

  teamList.sort((a, b) => b.RewardCount - a.RewardCount)

  //display at most 5 teams
  if (teamList.length > 5){
    displayList = teamList.slice(0, 5);
  } else {
    displayList = teamList;
  }
  

  const pressCallback = React.useCallback(() => {
    router.push({
      pathname: `/home/TeamLeaderboardPage`,
      params: { eventID: teamList[0].BelongsToEventID}
    })
  }, [teamList]);

  return (
        <Card height={"auto"} width={"100%"} paddingHorizontal={"$2.5"}elevation={"$0.25"} pressStyle={{ opacity: 0.8 }} animation="medium" onPress={pressCallback}>
          <Card.Header padding={"$2"}>
            <H4 textAlign="center">Top Teams</H4>
          </Card.Header>
            <View paddingBottom={"$2"}>
            {displayList.length === 0 ? (
                <Text>No leaderboard data available!</Text>
            ) : (
                displayList.map((team, index) => (
                <View key={team.TeamID}>
                  <XStack>
                    <Text textAlign="left" width={"50%"}>{index + 1}. {team.Name}</Text>
                    <Text textAlign="right" width={"50%"}>{team.RewardCount ?? 0} 🍃 </Text>
                  </XStack>
                </View>
                ))
            )}
            </View>
        </Card>
  );
}

