import { fail, redirect } from "@sveltejs/kit";

export const load = async ({ locals: { supabase, getSession }, params }) => {
  const { EventID } = params;
  console.log(EventID);
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
  const { data: Profiles } = await supabase
    .from("Profiles")
    .select(
      `
    ProfileID,
    Name
    `
    )
    .eq("BelongsToEventID", EventID);

  return { session, Profiles, Event };
};