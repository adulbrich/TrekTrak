import { fail, redirect } from "@sveltejs/kit";

export const load = async ({ locals: { supabase, getSession }, params }) => {
  const { EventID } = params;
  console.log('EventID: ', EventID);
  //console.log(EventID);

  //create a session for the user
  const session = await getSession();

  //if some error in creation of session
  if (!session) {
    throw redirect(303, "/events");
  }

  //grab the event details
  const { data: Event } = await supabase.from("Events").select("*").eq("EventID", EventID).single();

  //grab the participants that are enlisted in the event
  const { data: Profiles, error } = await supabase
  .from('Profiles')
  .select(
    `
    Name,
    Teams (BelongsToEventID)
    `
  )
  .eq('Teams.BelongsToEventID', EventID);

  if (error) {
    console.log('Error getting profiles: ', error);
  } else {
    console.log('Returned data: ', Profiles);
  }

  return { session, Profiles, Event };
};