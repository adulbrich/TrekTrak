import { AnimatePresence, Card, H3, H4, H5, Image, Text, useTheme, View, XStack, YStack } from "tamagui";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useAssets } from "expo-asset";
import { LinearGradient } from 'tamagui/linear-gradient'
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { selectEventTeams } from "../../../store/teamLeaderboardSlice";
import { useTypedDispatch } from "../../../store/store";
import { fetchEventUsers, selectEventUsers, selectIndividualLeaderboard } from "../../../store/individualLeaderboardSlice";

export default function TeamLeaderboardPage() {
    const theme = useTheme();
    const dispatch = useTypedDispatch();
    const eventID = useLocalSearchParams().eventID
    
    //get users in event
    const usersList = useSelector(state => selectEventUsers(state, eventID))
  
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

    <Card height={"auto"} width={"100%"} paddingHorizontal={"$2.5"}elevation={"$0.25"} >
        <Card.Header padding={"$2"}>
        <H4 textAlign="center">Top Individuals</H4>
        </Card.Header>
        <View paddingBottom={"$2"}>
        {usersList.length === 0 ? (
            <Text>No leaderboard data available!</Text>
        ) : (
            usersList.map((user, index) => (
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
    </>
    );
  }