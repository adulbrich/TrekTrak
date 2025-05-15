import { AnimatePresence, Card, H3, H5, Image, Text, View, XStack, YStack } from "tamagui";
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
    
  }, []);

  return (
    <AnimatePresence exitBeforeEnter>
      <YStack
        flex={1}
        justifyContent="flex-end"
        enterStyle={{ y: 15, opacity: 0 }}
        animation="slow"
      >
        <Card height={"auto"} width={"100%"} elevation={"$0.25"} pressStyle={{ opacity: 0.8 }} animation="medium" onPress={pressCallback}>
            <View style={styles.leaderboardContainer}>
            {displayList.length === 0 ? (
                <Text style={styles.placeholderText}>No leaderboard data available!</Text>
            ) : (
                displayList.map((team, index) => (
                <View key={team.TeamID} style={styles.teamRow}>
                    <Text style={styles.teamName}>
                    {index + 1}. {team.Name}
                    </Text>
                    <Text style={styles.teamScore}>{team.RewardCount ?? 0}</Text>
                </View>
                ))
            )}
            </View>
        </Card>
      </YStack>
    </AnimatePresence>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F5F5",
    },
    scrollView: {
      alignItems: "center",
      padding: 16,
    },
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#426B1F",
      marginBottom: 20,
    },
    leaderboardContainer: {
      width: "100%",
      padding: 16,
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      marginBottom: 20,
    },
    teamRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 8,
    },
    teamName: {
      fontSize: 18,
      fontWeight: "500",
      color: "#333",
    },
    teamScore: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#426B1F",
      textAlign: "right"
    },
    placeholderText: {
      fontSize: 18,
      textAlign: "center",
      color: "#888",
    },
    backButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      textAlign: "center",
    },
  });