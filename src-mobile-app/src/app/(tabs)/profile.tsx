import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { H3, H4, H5, XStack, YStack, Button, Input, Text } from "tamagui";
import { useTypedSelector } from "../../store/store";
import { selectMyProfileStats } from "../../store/profileStatsSlice";
import { selectProfile } from "../../store/profileSlice";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../features/system/Auth";
import { useSelector } from 'react-redux';
// import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const Profile = () => {
  // const navigation = useNavigation();
  const router = useRouter();
  const auth = useAuth();
  const myProfileStats = useTypedSelector(selectMyProfileStats);
  const myProfile = useSelector(selectProfile);
  const [header, setHeader] = useState("Good evening.");
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(myProfile?.Name?.split(" ")[0] || "");

  useEffect(() => {
    if (myProfile?.Name) {
      setHeader(`Good evening, ${myProfile.Name.split(" ")[0]}.`);
      setUsername(myProfile.Name);
    } else {
      console.log("No Profile Found")
    }
  }, [myProfile]);

  const changeName = async () => {
    if (!myProfile) return;
    await supabase.from("Profiles").update({ Name: username }).eq("ProfileID", myProfile.ProfileID);
  };

  const onSave = useCallback(() => {
    changeName();
    setHeader(`Good evening, ${username.split(" ")[0]}.`);
    setIsEditing(false);
  }, [username]);

  const signOut = useCallback(() => {
    auth.signOut();
  }, [auth]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <YStack justifyContent="center" alignItems="center" flex={1} gap="$4">
          <H3 alignSelf="flex-start" color="#426B1F">
            {header}
          </H3>
          <XStack width={"100%"} justifyContent="center" alignItems="center" padding="$4" gap="$4">
            <H5 color="#426B1F">My Total Steps</H5>
            <H4 color="#426B1F">{myProfileStats?.TotalScore ?? 0}</H4>
          </XStack>
        </YStack>

        <YStack paddingTop="$5" space>
          <Text fontSize="$8" fontWeight="bold" textAlign="center" color="#426B1F">
            OSU FSF
          </Text>
          {!isEditing ? (
            <YStack alignItems="center" space="$4">
              <Text fontSize="$6" fontWeight="bold" color="#FFFFFF">
                {username}
              </Text>
              <Button onPress={() => setIsEditing(true)} backgroundColor="#356122">
                Edit Profile Information
              </Button>
            </YStack>
          ) : (
            <YStack space="$4" paddingHorizontal="$6">
              <Text fontSize="$7" fontWeight="bold" color="#426B1F">
                Edit Profile Information
              </Text>
              <Input placeholder="Name" value={username} onChangeText={setUsername} />
              <Button onPress={onSave} backgroundColor="#356122">
                Save Changes
              </Button>
            </YStack>
          )}
          <Button
            bg={"#426B1F"}
            color={"#FFFFFF"}
            onPress={() => router.push('/IndividualLeaderboards')} // Navigate to individual leaderboard
          >
            View Individual Leaderboard
          </Button>
          <Button bg={"#426B1F"} color={"#FFFFFF"} onPress={signOut}>
            Sign Out
          </Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
