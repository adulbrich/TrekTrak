import { SafeAreaView, StyleSheet } from "react-native";
import Card from "../../features/teams/NameCard";
import { View, Text, ScrollView } from "tamagui";
import React, { useEffect, useState } from "react";
import { selectTeamStatsBreakdown } from "../../store/teamStatsSlice";
import { useTypedSelector } from "../../store/store";
import { TeamStats } from "../../lib/models";
import { selectUserID } from "../../store/systemSlice";
import { selectMyOngoingEvents } from "../../store/eventsSlice";
import { Button } from "tamagui";
// import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router"

export default function Team() {
  // const navigation = useNavigation(); // React Navigation hook for navigation
  const router = useRouter();
  const myTeamStats = useTypedSelector(selectTeamStatsBreakdown);
  const userID = useTypedSelector(selectUserID);
  const myOngoingEvents = useTypedSelector(selectMyOngoingEvents);
  const [teamData, setTeamData] = useState<TeamStats[]>([]);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  useEffect(() => {
    const profileId = userID;
    const rowsWithProfileId = myTeamStats.filter((stat) =>
      stat.Profiles.some((profile) => profile.ProfileID === profileId)
    );
    if (rowsWithProfileId.length > 0) {
      const teamId = rowsWithProfileId[0].TeamID;
      const rowsWithTeamId = myTeamStats.filter(
        (stat) => stat.TeamID === teamId && stat.EventID === myOngoingEvents[0]?.EventID
      );
      if (rowsWithTeamId.length === 0) {
        alert("You are not registered for a team in the current event.");
        setIsRegistered(false);
      } else {
        setTeamData(rowsWithTeamId);
        setIsRegistered(true);
      }
    }
  }, [myTeamStats]);

  return (
    <SafeAreaView style={[styles.safeAreaContainer]}>
      <View style={[styles.userListContainer]}>
        {/* Team Data */}
        {teamData.map((team, index) => (
          <Text key={index} style={[styles.teamName]}>
            {team.TeamName}
          </Text>
        ))}
        <View style={[styles.teamContainer, styles.dropShadow]}>
          <View style={[styles.namesAndStepsContainer]}>
            <Text style={[styles.namesAndStepsText]}>Name</Text>
            <Text style={[styles.namesAndStepsText]}>Steps</Text>
          </View>
          <ScrollView style={[styles.teamsScrollViewContainer]}>
            {teamData.map((team, index) =>
              team.Profiles.map((profile, index) => (
                <Card key={index} name={profile.ProfileName} steps={profile.TotalScore || 0}></Card>
              ))
            )}
          </ScrollView>
          <View style={[styles.totalTeamStepsContainer]}>
            <Text style={[styles.totalTeamStepsText]}>
              Total Steps: {teamData[0]?.TotalScore || 0}
            </Text>
          </View>
        </View>

        {/* Button placed below the team data */}
        <Button
          bg={"#426B1F"}
          color={"#FFFFFF"}
          onPress={() => router.push("/TeamLeaderboards")} // Replace with actual leaderboard route
          style={styles.button}
        >
          Team Leaderboards
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  teamContainer: {
    height: "70%",
    width: "100%",
    borderWidth: 0.1,
    borderColor: "black",
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 50,
  },
  dropShadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  safeAreaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  teamName: {
    fontSize: 25,
    fontWeight: "600",
  },
  userListContainer: {
    flex: 1,
    justifyContent: "space-between", 
    alignItems: "center",
    height: "68%",
    width: "80%",
  },
  namesAndStepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "10%",
  },
  namesAndStepsText: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 20,
    marginHorizontal: 27,
  },
  teamsScrollViewContainer: {
    height: "80%",
    width: "100%",
  },
  totalTeamStepsText: {
    fontSize: 25,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 18,
    marginRight: 12,
  },
  totalTeamStepsContainer: {
    width: "100%",
    alignItems: "flex-end",
  },
  button: {
    marginVertical: 50,
    alignSelf: "center",
  },
});
