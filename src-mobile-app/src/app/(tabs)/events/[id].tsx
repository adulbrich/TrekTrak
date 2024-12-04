import { Stack, useLocalSearchParams } from "expo-router";
import { H3, YStack, Image, XStack, Text, Button, useTheme } from "tamagui";
import { Text as RN_Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTypedDispatch, useTypedSelector } from "../../../store/store";
import { SBEvent, SBTeamStats } from "../../../lib/supabase-types";
import { useAssets } from "expo-asset";
import { getDateString } from "../../../lib/helpers";
//import { useAuth } from "../../../lib/supabase";
import React from "react";
import { setActiveEvent } from "../../../store/eventsSlice";
import { blue } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { widths } from "@tamagui/config";


export default function EventDetails() {
  const theme = useTheme();
  const dispatch = useTypedDispatch();

  const slugEventID = useLocalSearchParams().id;
  const event = useTypedSelector<SBEvent[]>(store => store.eventsSlice.events)
    .find(ev => ev.EventID === slugEventID);

  //const { user, session } = useAuth();

  const teamStats = useTypedSelector<SBTeamStats[]>(store => store.teamStatsSlice.teamStats)
    .filter(ts => ts.BelongsToEventID === slugEventID)
    .sort((a, b) => (b.TotalScore ?? 0) - (a.TotalScore ?? 0));

  console.log(teamStats);

  const [assets] = useAssets([

    require('../../../../assets/images/preview_square.jpg'),
    require('../../../../assets/images/preview_wide.jpg'),
    require('../../../../assets/icons/down-chevron.png')

  ]);

  const registerCallback = React.useCallback(() => {
    dispatch(setActiveEvent(event));
    console.log('Register button pressed!')
  }, [event]);


  if (!event || !assets) return null;

  return (
    <>
      <Stack.Screen
        options={{
          headerTintColor: "#FFFFFF",
          title: event.Name,
          headerShown: true,
          headerBackTitle: 'Events',
          headerStyle: {
            backgroundColor: theme.background.get()
          },
        }}
      />

      <ScrollView
      style={{ flex: 20}}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={true}

      >
        <YStack flex={1} justifyContent="flex-start" alignItems="flex-start" padding="$4" gap={'$4'}>

          {/* Event image */}
          <YStack borderRadius={"$4"} overflow="hidden" width={'100%'} height={'$10'}>
            <Image
              width={'100%'}
              height={'100%'}
              resizeMode="stretch"
              source={{ uri: assets[1].uri, width: assets[1].width!, height: assets[1].height! }}
              />
          </YStack>

          {/* Event box for dates, description, and register button */}
          <YStack 
            width={'100%'} 
            padding="$4" 
            paddingTop="$3"
            borderWidth={1} 
            borderRadius={"$4"}
            borderColor="#898A8D"
            >

            {/* Event dates/timeline */}
            <YStack
              // borderTopWidth={1}
              // borderTopColor={"#898A8D"}
              borderBottomWidth={1} 
              borderBottomColor={"#c9c9c9"}
              >
              
              <YStack marginBottom="$2">
                  <Text 
                  color="black"
                  fontSize="$5"
                  >Dates</Text>
              </YStack>
            </YStack>
            
            <YStack borderBottomWidth={1} borderBottomColor={"#c9c9c9"}>
              <YStack width="100%" alignItems="center" marginBottom="$2.5" marginTop="$2.5">
                <XStack width={'100%'} justifyContent="space-between">

                  <XStack borderWidth="1" borderRadius="$3" padding="$1.5" backgroundColor="#D9D9D9">
                    <Text color='black'>Starts: { getDateString(event.StartsAt) }</Text>
                  </XStack>
                  
                  <XStack borderWidth="1" borderRadius="$3" padding="$1.5" backgroundColor="#D9D9D9">
                    <Text color='black'>Ends: { getDateString(event.EndsAt) }</Text>
                  </XStack>

                  <XStack borderWidth="1" borderRadius="$3" padding="$1.5" backgroundColor="#D9D9D9">
                    <Text color='black'>Type: { event.Type }</Text>
                  </XStack>
                </XStack>
              </YStack>
            </YStack>

            
            {/* Event Description */}
            <YStack marginTop="$2.5">
              <Text color="black" fontSize="$5">Description</Text>

              <YStack marginVertical="$2.5" alignItems="center">
                <YStack width={'100%'} 
                  padding="$3" 
                  //borderWidth={1} 
                  borderRadius="$4"
                  borderRightWidth={1}
                  borderLeftWidth={1}
                  borderColor="#ccc" 
                  backgroundColor="#f8f8f8"
                  maxHeight="$20"
                  shadowRadius=""
                  shadowColor="black"
                >
                  <Text color="black" fontSize="$5">{event.Description}</Text>
                </YStack>
              </YStack>
            </YStack>


            {/* Rounded Register Button */}
            <YStack width={'100%'} alignItems="center" padding="$4">
              <Button
                bg={'#eb7434'}
                color={'white'}
                fontSize="$6"
                height="$5"
                width="$14"
                onPress={registerCallback}
                borderRadius="$10"
                pressStyle={{ opacity: 1 }} // Optional: Adjust opacity on press
                shadowColor={'#000'} // Shadow color
                shadowOffset={{ width: 0, height: 2 }} // Shadow offset
                shadowOpacity={0.3} // Shadow opacity
                shadowRadius={4} // Shadow radius
              >
                Register
              </Button>
            </YStack>
          </YStack>


          <YStack gap={'$4'} 
            borderWidth={1} 
            padding="$4"
            borderRadius="$4"
            borderColor="#898A8D"
            >
            <H3 color="black">Top 5 Teams</H3>
            { teamStats.length === 0 && (
              <XStack width={'100%'} justifyContent="center">
                <Text>No stats available</Text>
              </XStack>
            )}
            { teamStats.slice(0, 5).map(ts =>
              <XStack key={ts.TeamID} width={'100%'} justifyContent="space-between" alignItems="flex-end">
                <Text color="black">{ ts.Name }</Text>
                <RN_Text ellipsizeMode="clip" numberOfLines={1} style={[{ flex: 1, marginHorizontal: 1 }]}>
                  ............................................................
                </RN_Text>
                <Text color="black">{ ts.TotalScore ?? 0 }</Text>
              </XStack>
            )}
          </YStack>
          

        </YStack>
      </ScrollView>
      
    </>
  )
}