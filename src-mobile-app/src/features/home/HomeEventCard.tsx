import { AnimatePresence, Card, H3, H4, H5, Image, Text, XStack, YStack } from "tamagui";
import { Tables } from "../../lib/supabase-types";
import { useAssets } from "expo-asset";
import { LinearGradient } from 'tamagui/linear-gradient'
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../system/Auth";
import { useSelector } from "react-redux";
import { selectEventTeams } from "../../store/teamLeaderboardSlice";
import { selectMyTeams } from "../../store/teamsSlice";
import { useTypedDispatch } from "../../store/store";
import { fetchEventUsers, selectEventUsers, selectIndividualLeaderboard } from "../../store/individualLeaderboardSlice";
import { selectUserID } from "../../store/systemSlice";
import { fetchTodaysProgress, insertTodaysProgress, selectTodaysProgress, updateTodaysProgress } from "../../store/activityProgressSlice";
import eventsSlice from "../../store/eventsSlice";
import { selectDistanceData, selectStepsData } from "../../store/healthDataSlice";
import { parse } from "path";

type Props = {
  event: Tables<'Events'>
}

export default function EventCard({ event }: Props) {
  const [assets] = useAssets([
    require('../../../assets/images/preview_square.jpg'),
    require('../../../assets/images/preview_wide.jpg'),
    // Event banner (if exists) in the public event assets bucket
    supabase.storage.from('EventAssets').getPublicUrl(`Banners/${event.EventID}`).data.publicUrl
  ]);

  // Display the fallback image if the event banner is not available
  const [useFallback, setUseFallback] = useState(false);
  const dispatch = useTypedDispatch();

  const pressCallback = React.useCallback(() => {
    router.push(`/home/${event.EventID}`);
  }, [event]);

  //calculate team position
  const teamsList = useSelector(state => selectEventTeams(state, event?.EventID))
  const myTeams = useSelector(selectMyTeams);
  const myTeam = myTeams.find((team) => team.BelongsToEventID == event.EventID)


  //calculate daily progress
  let progress = 10 //temp value
  var typeUnit = "";
  let displayProgress = 0

  if (event?.Type == "Distance"){
    typeUnit = "mi";
    progress = useSelector(selectDistanceData)
    progress = Math.round(progress * 100) / 100
    progress = Math.round(progress * 100)
    displayProgress = progress / 100
    

  } else if (event?.Type == "Steps"){
    typeUnit = "steps";
    progress = useSelector(selectStepsData)
    displayProgress = progress
    
  }

  //console.log("DAILY PROGRESS: ", progress, " ", typeUnit)

  const currentDate = new Date()
  useEffect(() => {
    dispatch(fetchTodaysProgress({date: currentDate, userID: UserID ?? ""}))
  }, [dispatch]);

  const activityProgressList = useSelector(selectTodaysProgress)
  const activityProgress = activityProgressList.find((team) => team.BelongsToTeamID == myTeam?.TeamID)

  useEffect(() => {
    if (activityProgress && activityProgress != undefined){//if a record exists for today
      if (activityProgress.RawProgress == progress){//new progress matches current progress, so don't update
        //DO NOTHING
        console.log("DOING NOTHING")
  
      } else { //not equal, so update todays record
          dispatch(updateTodaysProgress({activityProgressID: activityProgress.ActivityProgressID, progress: progress}))
          dispatch(fetchTodaysProgress({date: currentDate, userID: UserID ?? ""}))
        console.log("UPDATING ACTIVITY PROGRESS")
  
      }
  
    } else {//no record exists for today, so insert a new one
      if (UserID && myTeam){
        dispatch(insertTodaysProgress({userID: UserID, teamID: myTeam?.TeamID, type: event.Type, progress: progress}))
        dispatch(fetchTodaysProgress({date: currentDate, userID: UserID ?? ""}))
      }
      console.log("INSERTING ACTIVITY PROGRESS")
    }
  }, [dispatch]);

  //new activity Progress
  const newAPList = useSelector(selectTodaysProgress)
  const newAP = newAPList.find((team) => team.BelongsToTeamID == myTeam?.TeamID)

  //calculate todays rewards
  let rewards = 0
  if (newAP){
    for (let i = 0; i < event.AchievementCount; i++){
      if (newAP.RawProgress >= Number(event.Achievements[i]) && event.Type == "Steps"){
        rewards++
      } else if ((newAP.RawProgress / 100) >= Number(event.Achievements[i])) {//if distance, we need to divide by 100
        rewards++
      }
    }
  }

  //calculate team position after updated
  teamsList.sort((a, b) => b.RewardCount - a.RewardCount)
  const myTeamPlace = teamsList.findIndex((team) => team.TeamID == myTeam?.TeamID)

  //calculate individual position
  const usersList = useSelector(state => selectEventUsers(state, event?.EventID))
  const UserID = useSelector(selectUserID)
  const myUser = usersList.find((user) => user.ProfileID == UserID)
  usersList.sort((a, b) => b.RewardCount - a.RewardCount)
  const myUserPlace = usersList.findIndex((user) => user.ProfileID == UserID)

  return (
    <AnimatePresence exitBeforeEnter>
      <YStack
        flex={1}
        justifyContent="flex-end"
        enterStyle={{ y: 15, opacity: 0 }}
        animation="slow"
      >
        <Card height={"$20"} elevation={"$0.25"} pressStyle={{ opacity: 0.8 }} marginBottom={"$4"} animation="medium" onPress={pressCallback}>
          { assets && (
            <YStack borderRadius={"$4"} overflow="hidden" fullscreen enterStyle={{ opacity: 0 }} animation={"slow"}>
              <Image
                width={'101%'}
                height={'100%'}
                marginLeft={-1}
                resizeMode="stretch"
                source={{
                  uri: useFallback ? assets[1].uri : assets[2].uri,
                  width: useFallback ? assets[1].width! : assets[2].width!,
                  height: useFallback ? assets[1].height! : assets[2].height!
                }}
                onError={() => setUseFallback(true)}
                />
            </YStack>
          )}
          <LinearGradient
            width={'100%'}
            height={'77%'}
            colors={['#00000033', 'transparent']}
            start={[0.5, 1]}
            end={[0.5, 0]}
            position="absolute"
            />
          <XStack
            position="absolute"
            justifyContent="space-between"
            alignItems="center"
            paddingVertical={"$2"}
            paddingHorizontal={"$3"}
            bottom={0}
            left={0}
            right={0}
            backgroundColor={"#EEEEEEEE"}
            borderBottomLeftRadius={"$4"}
            borderBottomRightRadius={"$4"}
          >
            <YStack>
                <H3 color="black">{event.Name}</H3>
                <H5 color="black">My Team: {myTeam?.Name}</H5>
                <H5 color="black">Daily Progress: {displayProgress} {typeUnit}    🍃 {rewards}</H5>
                <H5 color="black">Team Place: {myTeamPlace + 1}/{teamsList.length}     🍃 {myTeam?.RewardCount} {event.RewardPlural}</H5>
                <H5 color="black">Individual Place: {myUserPlace + 1}/{usersList.length}     🍃 {myUser?.RewardCount} {event.RewardPlural}</H5>
                {/* Fake Data, will be replaced later*/}
            </YStack>
            
          </XStack>
      
        </Card>
      </YStack>
    </AnimatePresence>
  );
}