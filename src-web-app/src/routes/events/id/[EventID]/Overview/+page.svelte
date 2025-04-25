<script lang="ts">
  import Layout from "../../../../banner-layout.svelte";
  export let data;
  export let form;

  import { enhance, applyAction } from "$app/forms";
  import { goto } from "$app/navigation";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-french-toast";

  function goToEditEventPage() {
    goto(`/events/id/${data.eventDetails?.EventID}/Overview/EditEvents`, { replace: false });
  }

  $: if (form) {
    if (form.errorMessage) {
      toast.error(`Failed To delete event:${form.errorMessage}`);
    } else {
      toast.success("Event was deleted successfully!");
      goto(`/events`);
    }
  }

  const handleDeleteEvent: SubmitFunction = async ({ cancel }) => {
    if (confirm("Are you sure you want to delete the event?")) {
      return async ({ result }) => {
        return await applyAction(result);
      };
    } else {
      cancel();
    }
  };
</script>

<svelte:head>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" />

  <title>Event | Top Teams & Participants</title>

  <style>
    /* Add your custom styles here */
    .navbar {
      background-color: white;
      color: black;
      transition:
        background-color 0.3s ease,
        color 0.3s ease;
    }

    .event-picture {
      object-fit: cover;
      border-radius: 50%;
      width: 100%; /* Adjust the width as needed */
      height: 100%; /* Adjust the height as needed */
    }
  </style>
</svelte:head>

<Layout></Layout>
<!-- Container for everything left of the black navbar -->
<div class="container ml-[16%] w-auto mt-6">
  <!-- container for description -->
  <div class="ml-[2%]">
    <h1 class="text-3xl font-semi-bold mt-4">Description</h1>
    <div class="w-1/2 mt-3">
      <p class="text-lg">{data.Event?.Description}</p>

      <div
      class="stats shadow flex items-center mt-[3%]"
      style="width: fit-content;"
    >
      <div class="stat place-items-center">
        <div class="stat-title">Current Event Participants</div>
        <div class="stat-value">{data.Teams.length}</div>
      </div>
    </div>

    </div>
  </div>

  <!-- Container for when it starts and ends -->
  <div class="ml-[2%] mt-6">
    <h2 class="text-3xl font-semi-bold mt-4">When it Starts and Ends</h2>
    <div class="mt-1 flex items-center">
      <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" class="mt-4">
        <path
          d="M17 3H3C1.89543 3 1 3.89543 1 5V19C1 20.1046 1.89543 21 3 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3Z"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M14 1V5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6 1V5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M1 9H19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <p class="ml-2 text-lg mt-4">From {data.eventDetails?.StartsAt.slice(0, 10)} to {data.eventDetails?.EndsAt.slice(0, 10)}</p>
    </div>
  </div>

  <!-- Container for the What to expect -->
  <div class="ml-[2%] mt-7">
    <h2 class="text-3xl font-semi-bold mt-4">Achievements</h2>
    <div class="w-1/2 mt-5"></div>
    <!-- container for the step levels and the leafs, same as below -->
    <div class="mt-5">
      {#each data.eventDetails?.Achievements as achievement, index}
        <div class="flex items-center mt-1">
          <p class="mr-3">Level {index + 1} - {achievement} {data.eventDetails?.RewardPlural}</p>
        </div>
      {/each}
    </div>
  </div>

  <div>
    <button class="btn-primary bg-[#81c745] hover:bg-[#81c745]" on:click={goToEditEventPage}>Edit Event</button>
    <form method="POST" action="?/deleteEvent" use:enhance={handleDeleteEvent}>
      <input name="eventId" type="eventId" value={data.eventDetails?.EventID} hidden />
      <button class="btn-primary bg-[#ff5e32] hover:bg-[#e69a5a]">Delete Event</button>
    </form>
  </div>
</div>

<style>
  .btn-primary {
    margin-top: 20px;
    margin-left: 26px;
    padding: 10px 20px;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
