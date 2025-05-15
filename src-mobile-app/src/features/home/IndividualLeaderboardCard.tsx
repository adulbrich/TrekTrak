import { AnimatePresence, Card, H3, H5, Image, Text, XStack, YStack } from "tamagui";
import { Tables } from "../../lib/supabase-types";
import { useAssets } from "expo-asset";
import { LinearGradient } from 'tamagui/linear-gradient'
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";


export default function IndividualLeaderboardCard(userList: any) {
  

  const pressCallback = React.useCallback(() => {
    
  }, [userList]);

  return (
    <AnimatePresence exitBeforeEnter>
      <YStack
        flex={1}
        justifyContent="flex-end"
        enterStyle={{ y: 15, opacity: 0 }}
        animation="slow"
      >
        <Card height={"$20"} elevation={"$0.25"} pressStyle={{ opacity: 0.8 }} animation="medium" onPress={pressCallback}>
          
      
        </Card>
      </YStack>
    </AnimatePresence>
  );
}