<!-- This .svelte file contains the content for the view events page, which is seen right after logging in -->
<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "../banner-layout.svelte";
  export let data;
  import Card from "./CategoryEventCard.svelte";
  import SearchBar from "./EventSearchBar.svelte";
  import { goto } from '$app/navigation';
  import type { EventNameAndID } from "../../interfaces";
  let { supabase, pastEvents, upcomingEvents, ongoingEvents, events } = data;
  $: ({ supabase } = data);

  let eventNamesAndID: EventNameAndID[] = []; // Array that holds all the event names and IDs assocaite with the events
  let loading = true; // Boolean that determines if the page is still loading
  let relevantEvents = {
    // Object that holds the relevant events
    pastEvents: pastEvents,
    upcomingEvent: upcomingEvents[0],
    ongoingEvent: ongoingEvents[0],
  };

  // This runs after the component firt renders in the DOM
  onMount(async () => {
    events.forEach((event) => {
      eventNamesAndID.push({ Name: event.Name, ID: event.EventID }); // Push the name and ID of each event to the eventNamesAndID array
    });
    // For each event, determine the status of the event, trim the description, and set the Exists property to true
    trimAllEventDescriptions();
    loading = false; // Set loading to false
  });

  // This function trims the description of an event to 140 characters
  function trimDescription(description: string) {
    if (description.length > 140) {
      return description.slice(0, 140) + "...";
    }
    return description;
  }

  // This function trims the description of all the events
  function trimAllEventDescriptions() {
    pastEvents.forEach((event) => {
      event.Description = trimDescription(event.Description);
      event.Exists = true;
    });
    upcomingEvents.forEach((event) => {
      event.Description = trimDescription(event.Description);
      event.Exists = true;
    });
    ongoingEvents.forEach((event) => {
      event.Description = trimDescription(event.Description);
      event.Exists = true;
    });
  }

  const handleSignOut = async () => {
        await supabase.auth.signOut();
        goto('/');
    };
    
</script>

<svelte:head>
  <title>Events | DamFit</title>
</svelte:head>
<Layout>
  <!-- If loading is true, then display the spinner -->
  {#if loading}
    <div role="status">
      <svg
        aria-hidden="true"
        class="ml-[55%] mt-[10%] inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-beaver-orange"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>
  {:else}
    <!-- Top container that holds searchbar, "Events", search icon, and the create event button -->
    <div class="flex justify-start ml-[18%]">
      <p class="flex event-word ml-[3%]" style="margin-top:25px">Events</p>
      <!-- Searchbar Container -->
      <form class="relative ml-20" style="margin-top: 13px;" autocomplete="off">
        <!-- Search Bar -->
        <SearchBar events={eventNamesAndID} />
      </form>
      <!-- Button Container -->
      <div class="flex flex-col items-start ml-20" style="margin-top: 19px;">
        <!-- Create Event button -->
        <a href="/events/create">
          <button 
            class="btn btn-sm font-normal h-9 font-sans hover:bg-dark-orange text-white rounded-full" 
            style="background-color: #81c745; margin-bottom: 10px;">
            Create Event
          </button>
        </a>
        <!-- View Organizations button -->
        <!-- <a href="/orgs">
          <button 
            class="btn btn-sm font-normal h-9 font-sans hover:bg-dark-orange text-white rounded-full" 
            style="background-color: #81c745; margin-bottom: 10px;">
            View Organizations
          </button>
        </a> -->
        <a href="/users">
          <button 
            class="btn btn-sm font-normal h-9 font-sans hover:bg-dark-orange text-white rounded-full" 
            style="background-color: #81c745;">
            Add Profile
          </button>
        </a>
        <button
        on:click={handleSignOut}
        class="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
        </button>
      </div>
      <div class="flex flex-col items-start ml-20" style="margin-top: 19px;">
        <!-- Create Event button -->
        <a href="/events/importuserscsv">
          <button 
            class="btn btn-sm font-normal h-9 font-sans hover:bg-dark-orange text-white rounded-full" 
            style="background-color: #81c745; margin-bottom: 10px;">
            Import users csv
          </button>
        </a>
      </div>
    </div>

    <!-- Container for the events -->
    <div class="flex flex-row ml-[20.5%] w-[72%] h-[80%] custom-border mt-5">
      <!-- Left container for Ongoing and Past events -->
      <div class="flex flex-col w-[50%] custom-border">
        <!-- Container for ONGOING events -->
        <div class="flex flex-col w-auto custom-border h-fit pt-3">
          <p class="inline-block max-w-full px-0 pb-4" style="font-size: 18px; font-weight:628;">Ongoing Events</p>
          {#if ongoingEvents.length > 0}
            {#each ongoingEvents as event, index (index)}
              <Card Name={event?.Name} StartsAt={event?.StartsAt} EndsAt={event?.EndsAt} Description={event?.Description} EventID={event?.EventID} BannerURL={event?.BannerURL} {index} />
            {/each}
          {:else}
            <p>No ongoing events</p>
          {/if}
        </div>

        <!-- Container for PAST events -->
        <div class="flex flex-col w-auto custom-border h-fit pt-5">
          <div class="flex flex-row w-[100%] pb-4">
            <p class="inline-block" style="font-size: 18px; font-weight:628;">Past Events</p>
            <a href="/events/category/Past" style="margin-left: 10px;">
              <button class="btn btn-xs font-normal font-sans bg-light-black hover:bg-light-blackSelected text-white rounded-full">View All</button>
            </a>
          </div>

          {#if relevantEvents.pastEvents.length > 0}
            <div class="pb-4">
              <Card
                Name={relevantEvents.pastEvents[0]?.Name}
                StartsAt={relevantEvents.pastEvents[0]?.StartsAt}
                EndsAt={relevantEvents.pastEvents[0]?.EndsAt}
                Description={relevantEvents.pastEvents[0]?.Description}
                EventID={relevantEvents.pastEvents[0]?.EventID}
                BannerURL={relevantEvents.pastEvents[0]?.BannerURL}
              />
            </div>
          {:else}
            <p>No events found</p>
          {/if}
        </div>
      </div>

      <!-- Container for UPCOMING events -->
      <div class="flex ml-4 flex-col custom-border h-fit w-[50%] pt-3">
        <div class="flex flex-row w-[100%] pb-4">
          <p class="inline-block" style="font-size: 18px; font-weight:628;">Upcoming Events</p>
          <a href="/events/category/Upcoming" style="margin-left: 10px;">
            <button class="btn btn-xs font-normal font-sans bg-light-black hover:bg-light-blackSelected text-white rounded-full">View All</button>
          </a>
        </div>
        {#if upcomingEvents.length > 0}
          <Card
            Name={relevantEvents.upcomingEvent?.Name}
            StartsAt={relevantEvents.upcomingEvent?.StartsAt}
            EndsAt={relevantEvents.upcomingEvent?.EndsAt}
            Description={relevantEvents?.upcomingEvent?.Description}
            EventID={relevantEvents.upcomingEvent?.EventID}
            BannerURL={relevantEvents.upcomingEvent?.BannerURL}
          />
        {:else}
          <p>No upcoming events</p>
        {/if}
      </div>
    </div>
  {/if}
</Layout>

<style>
  .event-word {
    font-style: normal;
    font-weight: 628;
    font-size: 28px;
    line-height: 44px;
  }
  *:focus {
    outline: none;
  }
  /* Class that adds border around container */
  .custom-border {
    border: 0px solid #c7c7cd;
  }
</style>
