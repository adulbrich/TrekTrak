<script lang="ts">
  import Layout from "../../banner-layout.svelte";
  import RewardLabelInput from "./RewardLabelInput.svelte";
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-french-toast";
  import RewardTierInput from "./RewardTierInput.svelte";
  import { goto } from "$app/navigation";
  export let data;
  export let form;

  let { session, supabase } = data;
  $: ({ session, supabase } = data); // Listen to changes in supabase

  $: if (form) {
    if (form.errorMessage) {
      toast.error(form.errorMessage);
    }
    else { 
      toast.success("Event created!");
      goto(`/events`);
    }
  }

  let createEventForm: HTMLFormElement;
  let loading = false;

  let AchievementCount = 1;

  const handleSubmit: SubmitFunction = () => {
    loading = true;
    return async ({ update }) => {
      loading = false;
      // Update form variable so we can do stuff like display
      // an error message (if applicable).
      update();
    };
  };

  let userRole: "participant" | "admin" | "developer" | null = null;
  let accessDenied = false;
  // Fetch the logged-in user's role
  const fetchUserRole = async () => {
      if (!session?.user?.id) {
          accessDenied = true;
          return;
      }

      const { data: profile, error } = await supabase
          .from("Profiles")
          .select("Role")
          .eq("ProfileID", session.user.id)
          .single();

      if (error || !profile) {
          console.error("Error fetching user role:", error);
          accessDenied = true;
          return;
      }

      userRole = profile.Role;
      if (userRole !== "admin" && userRole !== "developer") {
          console.log("Role is: ", userRole)
          accessDenied = true;
      }
  };

  fetchUserRole();
</script>

<Layout>
  {#if accessDenied}
  <div class="flex justify-center items-center h-screen">
      <p class="text-2xl font-bold text-red-600">Only Developers and Admins can create events.</p>
      <!-- <p class="flex event-word ml-[3%]" style="margin-top:25px">Currently Logged in as: </p> -->
      {#if userRole}
        <p class="text-2xl font-bold text-red-600"> {"Currently Logged in as:  " + userRole}.</p>
      {/if}
  </div>
  {:else}
    <div class="p-7 h-auto">
      <!--Form Attributes-->
      <form class="flex flex-row ml-[17%]" enctype="multipart/form-data" method="post" action="?/createEvent" use:enhance={handleSubmit} bind:this={createEventForm}>
        <div class="flex flex-wrap w-[40%] -mx-3 mb-6">
          <a href="/events" style="margin-left: 10px; margin-top:15px;">
            <!-- Arrow that redirects to /events -->
            <svg width="20" height="17" viewBox="0 0 51 43" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M24.1251 42.4336C23.2836 42.4243 22.4765 42.0987 21.8646 41.5217L0.911133 21.1135L21.8646 0.705341C22.5076 0.308915 23.2685 0.147891 24.0172 0.249796C24.7659 0.351701 25.456 0.710211 25.9694 1.26403C26.4827 1.81785 26.7876 2.5326 26.8318 3.28607C26.876 4.03954 26.6568 4.78496 26.2117 5.39489L10.3011 21.1135L26.4726 36.8322C26.9461 37.2876 27.2708 37.8755 27.404 38.5185C27.5371 39.1616 27.4725 39.8298 27.2186 40.4356C26.9648 41.0413 26.5335 41.5563 25.9815 41.9128C25.4294 42.2694 24.7823 42.4509 24.1251 42.4336Z"
                fill="black"
              />
              <path
                d="M47.5996 24.3699H9.25746C8.39275 24.3699 7.56346 24.0268 6.95202 23.4161C6.34057 22.8054 5.99707 21.977 5.99707 21.1133C5.99707 20.2496 6.34057 19.4213 6.95202 18.8105C7.56346 18.1998 8.39275 17.8567 9.25746 17.8567H47.5996C48.4643 17.8567 49.2936 18.1998 49.9051 18.8105C50.5165 19.4213 50.86 20.2496 50.86 21.1133C50.86 21.977 50.5165 22.8054 49.9051 23.4161C49.2936 24.0268 48.4643 24.3699 47.5996 24.3699V24.3699Z"
                fill="black"
              />
            </svg>
          </a>
          <!--Header-->
          <h2 class="header-style px-5">Create Event</h2>
          <div class="w-full">
            <p class="w-[100%] block pl-6 py-2 my-4 text-base italic text-gray-500">
              Create your event here. You will be able to invite participants, create teams, configure achievements, publish the event, and edit details on the event page.
            </p>
          </div>

          <!--Container for Event Name-->
          <div class=" md:w-[40%] px-5 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="eventName">Event Name</label>
            <input
              required
              name="eventName"
              id="eventName"
              value=""
              class="appearance-none block w-full text-gray-700 rounded-md border-black border py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              placeholder="Event Name"
            />
          </div>

          <!--Container for Event Type Dropdown-->
          <div class=" md:w-[40%] px-5 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="eventType">Type</label>

            <div class="relative">
              <select
                required
                id="eventType"
                name="eventType"
                value=""
                class="block appearance-none w-full rounded-md border-black border text-gray-700 py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option>Steps</option>
                <option>Distance</option>
              </select>
              <!-- Drop down arrow  -->
              <div class="absolute" style="right: 5.8%; bottom:12px; pointer-events:none;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          <!--Container for Start Date Input-->
          <div class=" md:w-[50%] px-5 mb-6 md:mb-0">
            <label for="startDate" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value=""
              required
              class="appearance-none w-full text-gray-700 rounded-md border-black border py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            />
          </div>

          <!--Container for End Date Input-->
          <div class=" md:w-[50%] px-5 mb-6 md:mb-0">
            <label for="endDate" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value=""
              required
              class="appearance-none w-full text-gray-700 rounded-md border-black border py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            />
          </div>

          <!--Container for Event Description Input-->
          <div class="md:w-3/4 px-5 mb-0 md:mb-0">
            <label for="eventDescription" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Event Details</label>
            <textarea
              id="eventDescription"
              name="eventDescription"
              value=""
              required
              rows="4"
              class="block p-2.5 w-full text-sm text-black bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 light:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write details about the event here!"
            ></textarea>
          </div>
          <!-- Container for Both Create Event and Upload Banner button -->
          <div class="flex w-full flex-col h-auto ml-4">
            <!-- Container for Event Banner Uploading -->
            <div class="mt-3 w-[25%] mb-3 my-0 btn primary bg-beaver-orange text-white hover:bg-dark-orange">
              <label class="button primary block" for="eventBanner">Upload Banner</label>
              <input style="position:absolute; visibility:hidden;" type="file" id="eventBanner" name="eventBanner" accept="image/*" />
            </div>
            <!-- Container for Create Event Button -->
            <div class=" pt-3">
              <input
                type="submit"
                class="btn bg-light-black text-white primary hover:bg-light-blackSelected appearance-none py-3 px-4 mb-3"
                value={loading ? "Loading.." : "Create Event"}
                disabled={loading}
              />
            </div>
          </div>
        </div>
        <!-- Container for the Reward config -->
        <div class="flex flex-col w-[30%] ml-[5%] mt-[7%]">
          <!-- Labels for reward inputs -->
          <RewardLabelInput id="singularReward" name="singularReward" placeholder="Leaf" label="Singular Reward" />
          <RewardLabelInput id="pluralReward" name="pluralReward" placeholder="Leaves" label="Plural Reward" />
          <!-- Button for uploading reward icon -->
          <div class="w-[35%]">
            <label class="btn primary bg-beaver-orange text-white hover:bg-dark-orange" for="rewardIcon">
              Upload Icon
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 13V17C19 17.5304 18.7893 18.0391 18.4142 18.4142C18.0391 18.7893 17.5304 19 17 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V13"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path d="M15 6L10 1L5 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10 1V13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <input style="position:absolute; visibility:hidden;" type="file" id="rewardIcon" name="rewardIcon" accept="image/*" />
            </label>
          </div>
          <!-- Add Dropdown for Selecting Number of Achievements -->
          <div class=" md:w-[70%] mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="AchievementCount">
              Number of Achievements
            </label>
            <div class="relative">
              <select
                id="AchievementCount"
                name="AchievementCount"
                bind:value={AchievementCount}
                class="block appearance-none w-full rounded-md border-black border text-gray-700 py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </select>
              <!-- Drop down arrow -->
              <div class="absolute" style="right: 5.8%; bottom:12px; pointer-events:none;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          <!-- Dynamically Render Achievement Inputs -->
          {#each Array(Number(AchievementCount)) as _, index}
          <div>
          <RewardTierInput id="Achievement{index + 1}" name="Achievement{index + 1}" placeholder="Achievement {index + 1}" label="Achievement {index + 1}" />
          </div>
          {/each}
      </form>
    </div>
  {/if}
</Layout>

<style>
  .header-style {
    font-style: normal;
    font-weight: 628;
    font-size: 28px;
    line-height: 44px;
  }
  .black-border {
    border: 1px solid black;
  }
  .daily-tiers-text {
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 44px;
  }
</style>
