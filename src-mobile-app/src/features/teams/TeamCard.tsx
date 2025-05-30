import { AnimatePresence, Button, Card, H3, Image, Text, View, XStack, YStack, useTheme } from "tamagui";
import { Tables } from "../../lib/supabase-types";
import { useAssets } from "expo-asset";
import { LinearGradient } from 'tamagui/linear-gradient';
import { useDispatch } from "react-redux";
import { fetchCurrentEvents, setActiveEvent } from "../../store/eventsSlice";
import React, { useEffect } from "react";
import { router } from "expo-router";
import { AlignCenter } from "@tamagui/lucide-icons";
import { supabase } from "../../lib/supabase"; // Import your Supabase client
import { selectMyProfile} from "../../store/profilesSlice";
import { selectProfile } from "../../store/profileSlice";
import { selectUserID } from "../../store/systemSlice";
import { RootState, useTypedDispatch } from '../../store/store';
import { useSelector } from 'react-redux';


//Purpose: defines a card for a team. The card contains the team name, number of members, and a "Join" button
type Props = {
	team: Tables<'Teams'>
}

export default function TeamCard({ team }: Props) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const dispatch2 = useTypedDispatch();//don't know the difference but it works 👍

	// fetch team name
  function TeamName({ team }: Props) {
		const teamname = team && team.Name;
		console.log(teamname);
		return teamname;
  }
	// grab current userID (user that's currently logged into the app)
	const UserID = useSelector(selectUserID)
	console.log("USER ID: ", UserID)

	// function to handle a user joining a team
	const handleJoinTeam = async () => {
		try {
			dispatch(setActiveEvent(team));
			
			if(!UserID){
				return;
			}
 			 
			// print the current team's TeamID
			console.log('Team ID:', team.TeamID);  
			
			// insert data in TeamsProfiles (ProfileID and TeamID)
			const { error, status } = await supabase
				.from('TeamsProfiles') // The join table name
				.insert([
					{ TeamID: team.TeamID, ProfileID: UserID, RewardCount: 0 }
				]);

				if(error && status == 409){
					console.log('You\'re already registered for this team!');
					alert("You've already joined this team!");
					return;
				}

				dispatch2(fetchCurrentEvents(UserID));
				console.log('User joined the team successfully:');
				return;
			} catch (error) {
				console.log('Error joining the team:');
			}
	};
	

  return(
    <AnimatePresence exitBeforeEnter>
			<YStack
				padding="$4"
			>
				<Card height="$8"
					width="100%"
					elevation={"$1"} 
					backgroundColor="white" 
					borderTopLeftRadius={"$5"}
					borderTopRightRadius={"$5"}
					borderBottomLeftRadius={"$5"}
					borderBottomRightRadius={"$5"}
				>
					<XStack
						width="70%"
						height="100%"
						position="absolute"
						paddingVertical={"$5"}
						paddingHorizontal={"$4"}
						backgroundColor={"#EEEEEEEE"}
						borderTopLeftRadius={"$5"}
						borderBottomLeftRadius={"$5"}
					>
						<H3 color="black">{TeamName({ team })}</H3>
					</XStack>

					<XStack
						width="30%"
						height="100%"
						marginLeft="auto"
						alignSelf="flex-end"
						borderColor={"black"}
						borderTopRightRadius="$5"
						borderBottomRightRadius="$5"
						justifyContent="center"
						borderLeftWidth="$0.5"
						borderLeftColor="#898A8D"
					>
						<Button
							borderBottomLeftRadius={0}
							borderTopRightRadius={0}
							alignSelf="center"
							width="$7"
							bg={'#81c746'}
							shadowColor="black" 										 // Color of the shadow
							shadowOffset={{ width: 0, height: 2 }}   // Offset of the shadow
							shadowOpacity={0.50}       							 // Opacity of the shadow
							shadowRadius={3.84}        							 // Blur radius of the shadow
							onPress={handleJoinTeam}   							 // call function to join the user to the team, to join the team to the event
						>
							<Text 
								fontSize="$6" 
								color="white"
								fontWeight="bold"
							>
								Join
							</Text>
						</Button>
					</XStack>

				</Card>
			</YStack>
    </AnimatePresence>
  );
}               