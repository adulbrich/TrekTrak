import { AnimatePresence, Card, H3, H4, H5, Image, Text, View, XStack, YStack } from "tamagui";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { fetchEventProgress, fetchTodaysProgress, selectTodaysProgress } from "../../store/activityProgressSlice";
import { SBEvent } from "../../lib/models";
import { useTypedDispatch } from "../../store/store";
import { selectUserID } from "../../store/systemSlice";

type Props = {
    teamID: string,
    event: SBEvent
}

export default function DailyProgressCard({ teamID, event }: Props) {
    const dispatch = useTypedDispatch();
    const currentDate = new Date()
    const UserID = useSelector(selectUserID)

    useEffect(() => {
      dispatch(fetchTodaysProgress({date: currentDate, userID: UserID ?? ""}))
    }, [dispatch]);

    const activityProgressList = useSelector(selectTodaysProgress)
    const activityProgress = activityProgressList.find((team) => team.BelongsToTeamID == teamID)

    let rewards = 0
    let existsNextTier = false
    let toNextTier = 0
    let percentComplete = 0
    let displayProgress = 0

    if (activityProgress && event.Type == "Steps"){
        for (let i = 0; i < event.AchievementCount; i++){
        if (activityProgress.RawProgress >= Number(event.Achievements[i])){
            rewards++
        } else if (!existsNextTier){//checks if there is another tier and calculates amount needed to reach it
            toNextTier = Number(event.Achievements[i]) - activityProgress.RawProgress
            existsNextTier = true
        }
        }

        //calculate progress bar progress
        //calculate progress bar percents
        percentComplete = (activityProgress.RawProgress / Number(event.Achievements[event.AchievementCount - 1])) * 100
        if (percentComplete > 100) percentComplete = 100
        displayProgress = activityProgress.RawProgress

    } else if (activityProgress){//calculate distance
        for (let i = 0; i < event.AchievementCount; i++){
        if (activityProgress.RawProgress / 100 >= Number(event.Achievements[i])){
            rewards++
        } else if (!existsNextTier){//checks if there is another tier and calculates amount needed to reach it
            toNextTier = Number(event.Achievements[i]) - (activityProgress.RawProgress / 100)
            existsNextTier = true
        }
        }

        percentComplete = ((activityProgress.RawProgress / 100) / Number(event.Achievements[event.AchievementCount - 1])) * 100
        if (percentComplete > 100) percentComplete = 100
        displayProgress = activityProgress.RawProgress / 100
    }

    var typeUnit = "";
    if (event?.Type == "Distance"){
        typeUnit = "mi";
    } else if (event?.Type == "Steps"){
        typeUnit = "steps";
    }
  

  const pressCallback = React.useCallback(() => {
    router.push({
      pathname: `/home/ActivityProgressPage`,
      params: { eventID: event.EventID}
    })
  }, [teamID]);

  return (
    <Card height={"auto"} width={"100%"} paddingHorizontal={"$2.5"}elevation={"$0.25"} pressStyle={{ opacity: 0.8 }} animation="medium" onPress={pressCallback}>
    <View padding={"$2"}>
      <YStack>
        <XStack>
          <H4 textAlign="left" width={"80%"}>{displayProgress} / {event.Achievements[event.AchievementCount - 1]} {typeUnit}</H4>
          <H4 textAlign="right" width={"20%"}>{rewards} 🍃 </H4>
        </XStack>
        <XStack paddingVertical={"$1"}>
          <View width={`${percentComplete}%`} height={"$0.5"} backgroundColor={"#81c746"} marginRight={"$-1"}></View>
          <View width={`${100 - percentComplete}%`} height={"$0.5"} marginLeft={"$-1"}></View>
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
  );
}

