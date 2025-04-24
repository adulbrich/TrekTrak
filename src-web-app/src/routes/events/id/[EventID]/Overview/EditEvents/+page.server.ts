import {fail, redirect } from '@sveltejs/kit'

export const load = async ({ locals: { supabase, getSession } }: { locals: { supabase: any; getSession: () => Promise<any> } }) => {
  const session = await getSession();

  if (!session) {
    throw redirect(303, "/events");
  }

  return { session }
}

export const actions = {
  edit: async (event) => {
    const {
      request,
      locals: { supabase, getSession },
    } = event;
    const session = await getSession();

    if (!session) {
      return fail(403, { errorMessage: "User not authenticated." });
    }

    const formData = await request.formData();
    const eventID = formData.get("eventID") as string; // Ensure EventID is retrieved correctly
    const eventName = formData.get("eventName") as string;
    const eventType = formData.get("eventType") as "Steps" | "Distance";
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const eventDescription = formData.get("eventDescription") as string;
    const AchievementCount = Number(formData.get("AchievementsCount"));
    const Achievements = Array.from({ length: AchievementCount }, (_, i) =>
      formData.get(`Achievement${i}`)
    );

    const eventBanner = formData.get("eventBanner") as File | null;

    console.log("Updating event:", eventID, eventName);
    console.log("Form data", formData);
    console.log('Achievements', Achievements);
    // Update event details in the database
    const { error: editEventError, data: editEventData } = await supabase
      .from("Events")
      .update({
        Name: eventName,
        Type: eventType,
        StartsAt: startDate,
        EndsAt: endDate,
        Description: eventDescription,
        AchievementCount: AchievementCount,
        Achievements: Achievements
      })
      .eq("EventID", eventID)
      .select();
    
    console.log(editEventData);

    if (editEventError) {
      console.log("Failed to update event:", editEventError.message);
      return fail(500, { errorMessage: editEventError.message });
    }

    // Upload banner only if a new file is provided
    if (eventBanner) {
      const { error: uploadBannerError } = await supabase.storage
        .from("EventAssets")
        .upload(`Banners/${eventID}`, eventBanner, {
          contentType: eventBanner.type,
          upsert: true, // Overwrite if it already exists
        });

      if (uploadBannerError) {
        console.log("Failed to upload banner:", uploadBannerError.message);
        return fail(500, { errorMessage: uploadBannerError.message });
      }
    }

    console.log("Successfully updated event");
    return { errorMessage: null};
  },
};


  