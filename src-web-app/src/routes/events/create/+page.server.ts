import { fail, redirect } from "@sveltejs/kit";
import { randomUUID } from "crypto";

export const load = async ({ locals: { supabase, getSession } }: { locals: { supabase: any; getSession: () => Promise<any> } }) => {
  const session = await getSession();

  if (!session) {
    throw redirect(303, "/events");
  }

  return { session }
}

export const actions = {
  createEvent: async (event) => {
    // Get current session information from SvelteKit hooks.
    const {
      request,
      locals: { supabase, getSession },
    } = event;
    const session = await getSession();

    // Extract form data from the client's request.
    const formData = await request.formData();

    // Event specific information.
    const eventName = formData.get("eventName") as string;
    // NOTE: Event type has a special type and cannot be a generic string.
    const eventType = formData.get("eventType") as "Steps" | "Distance";
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const eventDescription = formData.get("eventDescription") as string;
    const RewardSingular = formData.get("singularReward") as string;
    const RewardPlural = formData.get("pluralReward") as string;
    const AchievementCount = formData.get("AchievementCount") as string;
    const Achievements = Array.from({ length: parseInt(AchievementCount) }, (_, i) =>
      formData.get(`Achievement${i + 1}`) as string
    );

    // Event banner image, it should be a base64 encoded string.
    const eventBanner = formData.get("eventBanner") as File;
    const rewardIcon = formData.get("rewardIcon") as File;

    console.log("Event Banner", eventBanner);
    console.log("Reward Icon", rewardIcon);

    // Current user session ID.
    const userID = session?.user.id;

    console.log("User Id: ", userID);

    // If no user session ID, error out, they have no business creating an event.
    // Honestly this should never happen unless someone is attempting to
    // exploit the API.
    if (!userID) {
      return fail(500, {
        errorMessage: "Invalid user session.",
        eventName,
        eventType,
        startDate,
        endDate,
        eventDescription,
        RewardSingular,
        RewardPlural,
        AchievementCount,
        Achievements,
      });
    }

    const { error: createEventError, data: createEventData } = await supabase
      // Table names must match case according to schema.
      .from("Events")
      .upsert({
        // Column names must match case acccording to schema.
        EventID: randomUUID(),
        Name: eventName,
        Type: eventType,
        StartsAt: startDate,
        EndsAt: endDate,
        CreatedByUserID: userID,
        Description: eventDescription,
        RewardSingular: RewardSingular,
        RewardPlural: RewardPlural,
        AchievementCount: AchievementCount,
        Achievements: Achievements,
      })
      // Select the data we just created so we can use it for the banner.
      .select()
      // We only expect to get one result, this prevents a single item
      // array being return to us. Instead, we get a single object (in data var above).
      .single();

    // Error handle.
    if (createEventError) {
      console.log('Failed to create event: ', createEventError.message);
      return fail(500, {
        errorMessage: createEventError.message,
        eventName,
        eventType,
        startDate,
        endDate,
        eventDescription,
        RewardSingular,
        RewardPlural,
        AchievementCount,
        Achievements,
      });
    }

    console.log(createEventData);

    // The EventBanners bucket already exists, it only allows image/* MIME type,
    // and has a file upload size limit of 5MB (configurable from dashboard).
    const { error: uploadBannerError } = await supabase.storage.from("EventAssets").upload(
      // To keep it simple, the filename will be the event ID.
      // So, on the mobile app we simply query for 'EventBanners/{EventID}'
      // to retrieve that event's banner image!
      `Banners/${createEventData.EventID}`,
      // The actual image data to upload:
      eventBanner,
      {
        // Specify the content type for the upload.
        contentType: eventBanner.type,
      }
    );
    const { error: uploadRewardIconError } = await supabase.storage.from("EventAssets").upload(`RewardIcons/${createEventData.EventID}`, rewardIcon, {
      contentType: rewardIcon.type,
    });
    if (uploadRewardIconError) {
      console.log("Failed to upload reward icon: ", uploadRewardIconError.message);
    }

    // Error handle.
    if (uploadBannerError) {
      console.log("Failed to upload banner: ", uploadBannerError.message);
      return fail(500, {
        errorMessage: uploadBannerError.message,
        eventName,
        eventType,
        startDate,
        endDate,
        eventDescription,
        RewardSingular,
        RewardPlural,
        AchievementCount,
        Achievements,
      });
    }

    console.log('Successfully created an event');
    // Done.
    return {
      errorMessage: null,
      eventName,
      eventType,
      startDate,
      endDate,
      eventDescription,
      RewardSingular,
      RewardPlural,
      AchievementCount,
      Achievements,
    };
  },
};
