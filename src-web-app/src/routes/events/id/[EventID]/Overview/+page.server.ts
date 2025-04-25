import {Actions, fail, redirect } from '@sveltejs/kit'

export const load = (async({locals: { supabase, getSession } , params }) => {
  
  const {EventID} = params;
  console.log(EventID);
  //console.log(EventID);

  //create a session for the user
    const session = await getSession();

    //if some error in creation of session
    if(!session){
        throw redirect(303 , '/events');
    }

  const {data: eventDetails} = await supabase 
  .from('Events')
  .select('*')
  .eq('EventID', EventID)
  .single();

  const { data: testsigned } = await supabase
  .storage
  .from('EventAssets')
  .createSignedUrl(`Banners/${EventID}`, 300)

  /*
  const { data: eventImage } = await supabase
  .storage
  .from('EventAssets/Banners')
  .getPublicUrl(EventID)
  */

  const { data: teamsWithMembers } = await supabase
  .from('Teams')
  .select(`
    TeamID,
    Name, 
    Profiles (ProfileID, Name)`)
  .eq('BelongsToEventID', EventID);
  
  return { session ,eventDetails, Teams: teamsWithMembers, testsigned};
});

export const actions = {
  deleteEvent: async (event) => {
    const {
      request,
      locals: {supabase}
    } = event;
    const formData = await request.formData();
    const eventId = formData.get('eventId') as string;
    const response = await supabase
      .from('Events')
      .delete()
      .eq('EventID', eventId);
    
    console.log("Deleting event. EventId: ", eventId)
    if(response.status != 204) {
      console.log("Error. Response: ", response);
      return fail(500, {
        errorMessage: "Supabase was not able to fulfill the delete request: " + response.error?.message
      })
    }
    console.log("Successfully deleted event. EventId: ", eventId);
    return {
      errorMessage: null
    }
  }
} satisfies Actions;