<script lang="ts">
  
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import EventBanner from "./eventbanner.svelte";
  import { goto } from '$app/navigation';

  export let data;
  export const form: {
    eventName?: string;
    eventType?: string;
    startDate?: string;
    endDate?: string;
    eventDescription?: string;
    AchievementsCount?: number;
    Achivements?: string[];
  } = {};

  let { session, supabase, Event} = data;
  $: ({ session, supabase, Event} = data);

  let createEventForm: HTMLFormElement;
  let loading = false;
  let eventName: string = Event?.Name ?? "";
  let eventType: string = Event?.Type ?? "Walk (steps)";
  let startDate: string = Event?.StartsAt ?? "";
  let endDate: string = Event?.EndsAt ?? "";
  let eventDescription: string = Event?.Description ?? "";
  let AchievementsCount: number = Event?.AchievementCount ?? 0; // Default achievement count
  let Achievements: string[] = Event?.Achievements ?? [""]; // Default list of achievements

  export let eventDetails = {
    Description: data.Event?.Description,
    EventName: data.Event?.Name,
    EventType: data.Event?.Type,
    // edit it to html format, so we can pre-populate the form
    EventStartDate: data.Event?.StartsAt ? data.Event?.StartsAt.split('T')[0] : '', 
    EventEndDate: data.Event?.EndsAt ? data.Event?.EndsAt.split('T')[0] : '',
    EventID: data.Event?.EventID,
    AchievementsCount: data.Event?.AchievementCount,
    Achievements: data.Event?.Achievements
  };

  $: {
    if (AchievementsCount > Achievements.length) {
      while (Achievements.length < AchievementsCount) Achievements.push("");
    } else if (AchievementsCount < Achievements.length) {
      Achievements = Achievements.slice(0, AchievementsCount);
    }
  }

  $: Achievements = Array.from({ length: AchievementsCount }, (_, i) => Achievements[i] || "");

  let successMessage = "";
  let showSuccess = false;

  const handleSubmit: SubmitFunction = async ({ form, data }) => {
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
      });

      if (response.ok) {
        successMessage = "Event updated successfully! Please go back to the previous page to look for the changes.";
        showSuccess = true;

        // Auto-hide after 3 seconds
        setTimeout(() => (showSuccess = false), 3000);
      } else {
        throw new Error("Failed to update the event.");
      }
    } catch (error) {
      successMessage = "Failed to update the event. Please try again.";
      showSuccess = true;

      setTimeout(() => (showSuccess = false), 3000);
    }
  };


  
</script>

  <div class="h-screen bg-light-black fixed top-0 left-0 p-2" style="width: 16%">
    <!-- Logo and Faculty Fitness Text -->
    <div class="flex justify-center mb-4">
        <img class="h-auto w-[70%] p-2" src="../../../../FSF_Logo_Transparent.png" alt="FSF Logo">
    </div>
    <p class="text-white mt-1 ml-3 font-bold text-center">TrekTrak</p>
    
    <div class="flex-1 flex flex-col justify-center items-center space-y-4">
        <!-- Home Link, add 'active' class based on the current route -->
        <a href="/events" class="pt-2 pb-2 flex items-center">
            <img class="h-[50%] max-w-[50%] ml-8" src="../../../../home_icon.png" alt="home icon">
            <p class="text-white mx-3 mr-12">Home</p>
        </a>
    </div>
  </div>

  <div class="p-7 h-auto">
    <!--Form Attributes-->
    <div class="form-widget flex-1 ml-[17%] flex flex-wrap -mx-3 mb-6">
      <a href="/events" style="margin-left: 10px; margin-top:15px;">   
      </a>
      <!--Header-->
      <div class="w-full">
    </div>
        
      <form method='POST' action='?/edit' use:enhance={handleSubmit}>
        {#if showSuccess}
          <div class="success-message bg-green-500 text-white text-center py-2 rounded-md mb-4">
            {successMessage}
          </div>
        {/if}

          <!-- Grid container for the first row with two columns -->
          <div class="grid grid-cols-3 gap-6 mb-6 ml-4">
            <input type="hidden" id="eventID" name="eventID"
            bind:value={eventDetails.EventID}/>
            <!--Container for Event Name-->
            <div>
              <label for="eventName" class="block mb-2 text-sm font-medium text-gray-900 ">Event Name</label>
              <input type="text" id="eventName" name="eventName"
                bind:value={eventDetails.EventName}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="Event Name" required />
            </div>

            <!--Container for Event Type Dropdown-->
            <div>
              <label for="eventType" class="block mb-2 text-sm font-medium text-gray-900 ">Event Type</label>
              <select id="eventType" name="eventType" bind:value={eventDetails.EventType}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                <option selected>Steps</option>
                <option>Distance</option>
              </select>
            </div>
          </div>

          <!-- Grid container for the second row with two columns -->
          <div class="grid grid-cols-3 gap-6 mb-6  ml-4">
              <!--Container for Start Date Input-->
              <div>
                  <label for="startDate" class="block mb-2 text-sm font-medium text-gray-900 ">Start Date</label>
                  <input type="date" id="startDate" name="startDate" bind:value={eventDetails.EventStartDate} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required />
              </div>

              <!--Container for End Date Input-->
              <div>
                  <label for="endDate" class="block mb-2 text-sm font-medium text-gray-900 ">End Date</label>
                  <input type="date" id="endDate" name="endDate" bind:value={eventDetails.EventEndDate} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required />
              </div>
          </div>

          <!--Container for Event Description Input-->
          <div class="col-span-3  ml-4">
              <label for="eventDescription" class="block mb-2 text-sm font-medium text-gray-900">Event Description</label>
              <textarea id="eventDescription" name="eventDescription" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " rows="3"
                bind:value={eventDetails.Description}
                placeholder="Write details about the event here!" required></textarea>
          </div>

          <!-- Dropdown to select number of achievements -->
          <div class="mb-6">
            <label
              for="achievementsCount"
              class="block mb-2 text-sm font-medium text-gray-900"
            >
              Number of Achievements
            </label>
            <select
              name="AchievementsCount"
              id="AchievementsCount"
              bind:value={AchievementsCount}
              class="bg-gray-50 border w-40 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              {#each Array(7).fill(0).map((_, i) => i + 1) as count}
                <option value={count}>{count}</option>
              {/each}
            </select>
          </div>

          <!-- Inputs for achievements -->
          <div class="mb-6">
            <label for="achievements"
            class="block mb-2 text-sm font-medium text-gray-900">Achievements</label>
            {#each Array(Number(AchievementsCount)) as _, index}
              <div class="mb-3">
                <input
                  name={'Achievement'+index}
                  type="text"
                  bind:value={Achievements[index]}
                  class="bg-gray-50 border w-40 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder={Achievements[index]}
                />
              </div>
            {/each}
          </div>

        <div class="px-2">
          <input
            type="submit"
            class="btn  text-white primary hover:bg-dark-orange bg-beaver-orange appearance-none py-3 px-4 mb-3 "
            value={loading ? "Loading.." : "Edit"}
            disabled={loading}
          />
        </div>

      </form>
    </div>
  </div>

<style>
  .flex.items-center {
    display: flex;
    align-items: center; /* Vertically aligns the items in the center */
    justify-content: center; /* Horizontally centers the content */
    text-align: center; 

  }
  @media (max-width: 768px) {
    .bg-light-black {
        display: none;
    }
  }
</style>