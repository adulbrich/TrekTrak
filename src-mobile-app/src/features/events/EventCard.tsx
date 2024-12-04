import { AnimatePresence, Card, H3, Image, Text, XStack, YStack } from "tamagui";
import { Tables } from "../../lib/supabase-types";
import { useAssets } from "expo-asset";
import { LinearGradient } from 'tamagui/linear-gradient'
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";

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

  function getDateString() {
    const starts = new Date(event.StartsAt).getTime();
    const ends = new Date(event.EndsAt).getTime();
    const now = new Date().getTime();
    if (now < starts)
      return `Begins ${new Date(event.StartsAt).toLocaleDateString()}`;
    else if (now < ends)
      return `Ends ${new Date(event.EndsAt).toLocaleDateString()}`;
    else
      return `Ended ${new Date(event.EndsAt).toLocaleDateString()}`;
  }
  
  const pressCallback = React.useCallback(() => {
    router.push(`/events/${event.EventID}`);
  }, [event]);

  return (
    <AnimatePresence exitBeforeEnter>
      <YStack
        flex={1}
        justifyContent="flex-end"
        enterStyle={{ y: 15, opacity: 0 }}
        animation="slow"
      >
        <Card height={"$15"} elevation={"$0.25"} pressStyle={{ opacity: 0.8 }} animation="medium" onPress={pressCallback}>
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
            <H3 color="black">{event.Name}</H3>
            <Text color="black" marginTop={"$2"} fontSize={"$4"}>{ getDateString() }</Text>
          </XStack>
      
        </Card>
      </YStack>
    </AnimatePresence>
  );
}