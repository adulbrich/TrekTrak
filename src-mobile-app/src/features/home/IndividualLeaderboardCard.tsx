import { AnimatePresence, Card, H3, H4, H5, Image, Text, View, XStack, YStack } from "tamagui";
import { Tables } from "../../lib/supabase-types";
import { useAssets } from "expo-asset";
import { LinearGradient } from 'tamagui/linear-gradient'
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";

type Props = {
  usersList: {
    ProfileID: string,
    TeamID: string,
    RewardCount: number,
    Teams: {
        BelongsToEventID: string
    },
    Profiles: {
      Name: string | null
  }   
  }[]
}

export default function IndividualLeaderboardCard({ usersList }: Props) {
  let displayList = []

  usersList.sort((a, b) => b.RewardCount - a.RewardCount)

  //display at most 5 teams
  if (usersList.length > 5){
    displayList = usersList.slice(0, 5);
  } else {
    displayList = usersList;
  }

  const pressCallback = React.useCallback(() => {
    router.push({
      pathname: `/home/IndividualLeaderboardPage`,
      params: { eventID: usersList[0].Teams.BelongsToEventID}
    })
  }, [usersList]);

  return (
        <Card height={"auto"} width={"100%"} paddingHorizontal={"$2.5"}elevation={"$0.25"} pressStyle={{ opacity: 0.8 }} animation="medium" onPress={pressCallback}>
          <Card.Header padding={"$2"}>
            <H4 textAlign="center">Top Individuals</H4>
          </Card.Header>
            <View paddingBottom={"$2"}>
            {displayList.length === 0 ? (
                <Text>No leaderboard data available!</Text>
            ) : (
                displayList.map((user, index) => (
                <View key={user.ProfileID}>
                  <XStack>
                    <Text textAlign="left" width={"50%"}>{index + 1}. {user.Profiles ? user.Profiles.Name : ""}</Text>
                    <Text textAlign="right" width={"50%"}>{user.RewardCount ?? 0} 🍃 </Text>
                  </XStack>
                </View>
                ))
            )}
            </View>
        </Card>
  );
}