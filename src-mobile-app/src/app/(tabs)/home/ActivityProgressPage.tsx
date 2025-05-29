import { AnimatePresence, Card, H3, H4, H5, Image, Text, useTheme, View, XStack, YStack } from "tamagui";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { useTypedDispatch, useTypedSelector } from "../../../store/store";
import { fetchEventUsers, selectEventUsers, selectIndividualLeaderboard } from "../../../store/individualLeaderboardSlice";
import { selectUserID } from "../../../store/systemSlice";
import { fetchEventProgress, selectEventProgress } from "../../../store/activityProgressSlice";
import { SBEvent } from "../../../lib/supabase-types";

export default function ActivityProgressPage() {
    const theme = useTheme();
    const eventID = useLocalSearchParams().eventID
    const event= useTypedSelector<SBEvent[]>(store => store.eventsSlice.events)
    .find(ev => ev.EventID === eventID);

    if (event == undefined) return null

    const progressList = useSelector(selectEventProgress)
    const sortedList = [...progressList].sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
    // ^ I think things selected fromt the redux store are read-only, which is why we are creating a new list

    var typeUnit = "";
    let displayList = []

    if (progressList[0].ActivityType == "Distance"){
        typeUnit = "mi";

    } else if (progressList[0].ActivityType == "Steps"){
        typeUnit = "steps";
    }

    for (let i = 0; i < sortedList.length; i++){
        let rewards = 0
        const date = new Date(sortedList[i].CreatedAt)
        const month = date.getMonth() + 1
        const day = date.getDate()
        let progress = 0

        if (event.Type == "Distance") progress = sortedList[i].RawProgress / 100
        else if (event.Type == "Steps") progress = sortedList[i].RawProgress

        for (let j = 0; j < event.AchievementCount; j++){
            if (sortedList[i].RawProgress >= Number(event.Achievements[j])){
                rewards++
            }
        }

        displayList.push({
            id: sortedList[i].ActivityProgressID,
            date: month.toString() + "/" + day.toString(),
            progress: progress,
            rewards: rewards

        })
    }
  
    return (
    <>
      <Stack.Screen
        options={{
          headerTintColor: "#000000",
          title: "Daily Progress History",
          headerShown: true,
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: theme.background.get()
          },
        }}
      />

    <Card height={"auto"} width={"100%"} paddingHorizontal={"$2.5"}elevation={"$0.25"} >
        <View paddingVertical={"$2"}>
        {progressList.length === 0 ? (
            <Text>No activity data available!</Text>
        ) : (
            displayList.map((progress, index) => (
            <View key={progress.id}>
                <XStack>
                    <Text width={"15%"}> {progress.date} </Text>
                    <Text width={"70%"}> {progress.progress} {typeUnit}</Text>
                    <Text width={"15%"}> {progress.rewards} 🍃 </Text>
                
                </XStack>
            </View>
            ))
        )}
        </View>
    </Card>
    </>
    );
  }