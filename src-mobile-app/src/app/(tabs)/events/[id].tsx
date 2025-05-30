import { Stack, useLocalSearchParams } from "expo-router";
import { H3, YStack, Image, XStack, Text, Button, useTheme, View } from "tamagui";
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
import { FlatList } from "react-native";
import { useSelector } from "react-redux";
import { fetchMyTeams, selectMyTeams } from "../../../store/teamsSlice";


export default function EventDetails() {
  const theme = useTheme();
  const dispatch = useTypedDispatch();

  const slugEventID = useLocalSearchParams().id;
  const event = useTypedSelector<SBEvent[]>(store => store.eventsSlice.events)
    .find(ev => ev.EventID === slugEventID);

  const myTeams = useSelector(selectMyTeams);
  const registered = myTeams.some((team) => team.BelongsToEventID == event?.EventID)

  var typeUnit = "";
  if (event?.Type == "Distance"){
    typeUnit = "mi";
  } else if (event?.Type == "Steps"){
    typeUnit = "steps";
  }

  const date = new Date()
  const endDate = new Date(event?.EndsAt ?? "")
  let eventEnded = false

  if (endDate && date > endDate){//event has ended
    eventEnded = true
  }
  

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

            {/* Event Name */}
            <YStack>
              <Text color="black" fontSize="$9" fontWeight="bold" paddingVertical="$1">
                {event.Name}
              </Text>

              <Text color='black' fontSize="$5" paddingVertical="$1">
                { getDateString(event.StartsAt) } - { getDateString(event.EndsAt) }
              </Text>

              <Text color='black' fontSize="$5" paddingVertical="$1">
                Competition Type: { event.Type }
              </Text>

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

              <Text color='black' fontSize="$7" paddingVertical="$1">
                Reward Tiers:
              </Text>

              <View>
                {event.Achievements.map((tier, index) => (
                  <View key={index}>
                    <Text color="black" fontSize="$5">
                      {index + 1}: {tier} {typeUnit}
                    </Text>
                  </View>
                ))
                }
              </View>

            </YStack>


            {/* Rounded Register Button */}
            <YStack width={'100%'} alignItems="center" padding="$4">

              {eventEnded ? 
                <Button
                bg={'#92bf6b'}
                color={'white'}
                fontSize="$6"
                height="$5"
                width="$14"
                onPress={registerCallback}
                borderRadius="$4"
                shadowColor={'#000'} // Shadow color
                shadowOffset={{ width: 0, height: 2 }} // Shadow offset
                shadowOpacity={0.3} // Shadow opacity
                shadowRadius={4} // Shadow radius
                disabled={eventEnded}
              >
                {"Event Ended"}
              </Button>
                :
                <Button
                bg={registered ? '#92bf6b' : '#81c746'}
                color={'white'}
                fontSize="$6"
                height="$5"
                width="$14"
                onPress={registerCallback}
                borderRadius="$4"
                pressStyle={{ opacity: 1 }} // Optional: Adjust opacity on press
                shadowColor={'#000'} // Shadow color
                shadowOffset={{ width: 0, height: 2 }} // Shadow offset
                shadowOpacity={0.3} // Shadow opacity
                shadowRadius={4} // Shadow radius
                disabled={registered}
              >
                {registered ? "Registered" : "Register"}
              </Button>
              }
            </YStack>
          </YStack>


          <YStack gap={'$4'} 
            borderWidth={1} 
            padding="$4"
            borderRadius="$4"
            borderColor="#898A8D"
            >
            <H3 color="black">Top 5 Teams</H3>
            {/*{ teamStats.length === 0 && (
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
            )} */}
          </YStack>
          

        </YStack>
      </ScrollView>
      
    </>
  )
}