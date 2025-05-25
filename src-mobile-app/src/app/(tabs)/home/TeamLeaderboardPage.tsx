import { AnimatePresence, Card, H3, H4, H5, Image, Text, useTheme, View, XStack, YStack } from "tamagui";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useAssets } from "expo-asset";
import { LinearGradient } from 'tamagui/linear-gradient'
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { selectEventTeams } from "../../../store/teamLeaderboardSlice";

export default function TeamLeaderboardPage() {
  const theme = useTheme();
    const eventID = useLocalSearchParams().eventID
    
    //get teams in event
    const teamsList = useSelector(state => selectEventTeams(state, eventID))
    teamsList.sort((a, b) => b.RewardCount - a.RewardCount)
  
    return (
    <>
      <Stack.Screen
        options={{
          headerTintColor: "#000000",
          title: "",
          headerShown: true,
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: theme.background.get()
          },
        }}
      />

        <Card height={"auto"} width={"100%"} paddingHorizontal={"$2.5"}elevation={"$0.25"}>
        <Card.Header padding={"$2"}>
          <H4 textAlign="center">Top Teams</H4>
        </Card.Header>
          <View paddingBottom={"$2"}>
          {teamsList.length === 0 ? (
              <Text>No leaderboard data available!</Text>
          ) : (
              teamsList.map((team, index) => (
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
    </>
    );
  }