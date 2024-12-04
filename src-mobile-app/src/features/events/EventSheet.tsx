import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { Sheet } from '@tamagui/sheet';
import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Adapt, Button, H1, H2, H3, Select, YStack, XStack, Text, useTheme, TextArea} from 'tamagui';
import { SBTeam, Tables } from '../../lib/supabase-types';
import { EventsState, setActiveEvent } from '../../store/eventsSlice';
import { RootState, useTypedDispatch } from '../../store/store';
import { TeamsState, fetchTeams } from '../../store/teamsSlice';
import { LinearGradient } from 'tamagui/linear-gradient';
import React from 'react';
import { TextInput, Keyboard, TouchableWithoutFeedback, Text as RN_Text} from 'react-native';
import { ArrowLeft } from '@tamagui/lucide-icons'

import { supabase } from '../../lib/supabase';
import { fetchEvents } from '../../store/eventsSlice';
import { ScrollView as RN_ScrollView } from "react-native";

import TeamCard from '../teams/TeamCard';
import { setGestureState } from 'react-native-reanimated';
import { v4 as uuidv4 } from 'uuid';
import { createTeam } from '../../store/teamsSlice';



type Props = {
	team: Tables<'Teams'>
}

export default function EventDetailsSheet( {team} : Props) {
  //
  const [showJoinOptions, setShowJoinOptions] = useState(true);     // State to manage which join options to display
  const [showCreateOptionsView, setShowCreateOptionsView] = useState(false); // State to manage which create options to display
  const [teamName, setTeamName] = useState('');


  const [dragEnabled, setDragEnabled] = useState(true);

  const activeEvent = useSelector<RootState, EventsState>(state => state.eventsSlice).activeEvent;
  const eventTeams = useSelector<RootState, TeamsState>(state => state.teamsSlice).teams
    .filter(team => team.BelongsToEventID === activeEvent?.EventID);

  const dispatch = useTypedDispatch();

  const[registrationStep, setRegistrationStep] = useState('options'); //state to manage the current registration step

  useEffect(() => {
    if (activeEvent)
      setEvent(activeEvent);

    dispatch(fetchTeams());
  }, [activeEvent]);

  useEffect(() => {
    console.log(eventTeams);
  }, [eventTeams]);

  const [event, setEvent] = useState<Tables<'Events'>>();
  const [teamID, setTeamID] = useState<string>('New');
  const [selectedTeam, setSelectedTeam] = useState<Tables<'Teams'> | null>(null); // State to store selected team

  const registrationOptions = async () => {
    setShowJoinOptions(false);
    setDragEnabled(false);
    
    eventTeams.forEach((team) => {
      console.log(`- ${team.Name}`); // Print each team's name on a new line with a bullet
    });
  }

  const createTeamOption = async () => {
    setShowJoinOptions(false);
    setShowCreateOptionsView(true);
    setDragEnabled(false);
  }

  const activeEventID = useSelector<RootState, string | undefined>(state => state.eventsSlice.activeEvent?.EventID);

  const handleRegister = async () => {
    if (!activeEvent?.EventID) {
      console.error('Active event ID is undefined');
      // case where the active event ID is undefined
      return;
    }
  
    // Dispatch the createTeam action with the team name and event ID
    dispatch(createTeam({ name: teamName, eventID: activeEvent.EventID }))
      .then((resultAction) => {
        if (createTeam.fulfilled.match(resultAction)) {

          // Team creation succeeded
          console.log('New team created:', resultAction.payload);
          alert('New team created successfully!');
          
          dispatch(fetchTeams()); 
        } else if (createTeam.rejected.match(resultAction)) {

          // Team creation failed
          console.error('Error creating team:', resultAction.payload);
          alert('Error creating team: ' + resultAction.payload);
        }
      });
    
    setTeamName('');
    setShowCreateOptionsView(false);
    setShowJoinOptions(true);
    setDragEnabled(true);
  }

  const scrollHandling = () => {
    if(!dragEnabled){
      return true;
    }
    return false;
  }

  const handleBack = () => {
    setShowJoinOptions(true); // Close the modal by setting activeEvent to null
    setDragEnabled(true);
    setShowCreateOptionsView(false);
  };
  

  return (
    <Sheet
      native 
      modal
      animation="medium"
      open={activeEvent !== null}
      dismissOnSnapToBottom
      disableDrag={!dragEnabled}
      onOpenChange={(open: boolean) => { if (!open) dispatch(setActiveEvent(null)); setDragEnabled(true); }}
    >
      <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame>
        <Sheet.Handle />
        <YStack>
          <YStack paddingBottom="$12" paddingTop="0%" alignItems="center">
            {showJoinOptions ? (
              <>
                <H2 paddingBottom="$3">Registration</H2>
                <Text color="white" paddingBottom="$12">- Select an option to register for a team -</Text>
                <XStack justifyContent="center" paddingBottom="$20">
                  <Button
                    bg={'#eb7434'} 
                    color={'white'} 
                    height="$13"
                    width="$12"
                    marginRight="$3"
                    fontSize="$8"
                    onPress={registrationOptions}
                  >
                    Join
                  </Button>
                  <Button
                    bg={'#eb7434'} 
                    color={'white'} 
                    height="$13"
                    width="$12"
                    marginLeft="$3"
                    fontSize="$8"
                    onPress={createTeamOption}
                  >
                    Create
                  </Button>
                </XStack>
              </>
            ) : showCreateOptionsView ? (
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <YStack width="100%">
                  <XStack width="100%" alignItems='center' paddingBottom="$3">
                    <XStack alignItems='center' paddingRight="10%">
                      <Button 
                        icon={<ArrowLeft size="$2"/>} 
                        padding="$2" 
                        marginLeft="$2"
                        marginRight="$2"
                        backgroundColor={"$backgroundTransparent"}
                        onPress={handleBack}
                      >
                      </Button>
                    </XStack>
                    <XStack paddingLeft="$7">
                      <Text fontSize="$7">Create Team</Text>
                    </XStack>
                  </XStack>
                  <YStack justifyContent='space-between' padding="$2">
                    <YStack 
                      height="90%"
                      padding="$10"
                      alignItems='center'
                    >
                      <TextArea
                        value={teamName}
                        onChangeText={(text) => setTeamName(text)}
                        placeholder="Enter team name..."
                        width="90%"
                        padding="$4"
                        fontSize="$6"
                      >
                      </TextArea>
                      
                      <XStack padding="$15">
                        <Button
                          bg={'#eb7434'}
                          color={'white'}
                          fontSize="$6"
                          height="$5"
                          width="$14"
                          borderRadius="$10"
                          pressStyle={{ opacity: 1 }} // Optional: Adjust opacity on press
                          onPress={handleRegister}
                        >
                          Register
                        </Button>
                      </XStack>
                    </YStack>
                  </YStack>
                </YStack>
              </TouchableWithoutFeedback>
              
            ) : (
              <YStack width="100%">
                <XStack width="100%" alignItems='center' paddingBottom="$3">
                  <XStack alignItems='center' paddingRight="10%">
                    <Button 
                      icon={<ArrowLeft size="$2"/>} 
                      padding="$2" 
                      marginLeft="$2"
                      marginRight="$2"
                      backgroundColor={"$backgroundTransparent"}
                      onPress={handleBack}
                    >
                    </Button>
                  </XStack>
                  <XStack paddingLeft="$6">
                    <Text fontSize="$7">Available Teams</Text>
                  </XStack>
                </XStack>
                <YStack justifyContent='space-between'>
                  <RN_ScrollView>
                    {eventTeams.map(team => <TeamCard key={team.TeamID} team={team} /> )}
                  </RN_ScrollView>
                </YStack>
              </YStack>
            )}
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}