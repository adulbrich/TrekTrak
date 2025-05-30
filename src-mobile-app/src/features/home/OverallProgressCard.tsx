import { AnimatePresence, Card, H3, H4, H5, Image, Text, View, XStack, YStack } from "tamagui";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { fetchEventProgress, fetchTodaysProgress, selectEventProgress, selectTodaysProgress } from "../../store/activityProgressSlice";
import { SBEvent } from "../../lib/models";
import { useTypedDispatch } from "../../store/store";
import { selectUserID } from "../../store/systemSlice";
import { selectEventUsers } from "../../store/individualLeaderboardSlice";

type Props = {
    teamID: string,
    event: SBEvent
}

export default function OverallProgressCard({ teamID, event }: Props) {
    if (event == undefined) return null

    const dispatch = useTypedDispatch();
    const UserID = useSelector(selectUserID)

    if (!UserID) return null

    useEffect(() => {
        dispatch(fetchEventProgress({teamID: teamID, userID: UserID}))
    }, [dispatch]);

    const usersList = useSelector(state => selectEventUsers(state, event.EventID))
    const myUser = usersList.find((user) => user.ProfileID == UserID)
    const progressList = useSelector(selectEventProgress)

    let total = 0
    for (let i = 0; i < progressList.length; i++){
        total += progressList[i].RawProgress
    }

    
    var typeUnit = "";
    if (event.Type == "Distance"){
        typeUnit = "mi";
        total = total / 100
    } else if (event.Type == "Steps"){
        typeUnit = "steps";
    }

    console.log("TOTAL: ", total)
  

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
            <H4 color={"black"}> Total {event.Type}: {total} {typeUnit} </H4>
            <H5 color={"black"}> {event.RewardPlural} Earned: {myUser?.RewardCount ?? 0} 🍃 </H5>
        </YStack>
        </View>
  </Card>
  );
}

