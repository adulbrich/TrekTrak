<script lang="ts">
  import {page} from '$app/stores';
  export let data;

</script>

<div class="ml-[16%] w-auto h-[13%] eventTitle">
  <div class="flex items-center">
    <!-- Back button that navigates back to /events -->
    <a href="/events" class="mt-[1.2%] ml-[2%]">
    <svg width="18" height="14" viewBox="0 0 51 43" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24.1251 42.4336C23.2836 42.4243 22.4765 42.0987 21.8646 41.5217L0.911133 21.1135L21.8646 0.705341C22.5076 0.308915 23.2685 0.147891 24.0172 0.249796C24.7659 0.351701 25.456 0.710211 25.9694 1.26403C26.4827 1.81785 26.7876 2.5326 26.8318 3.28607C26.876 4.03954 26.6568 4.78496 26.2117 5.39489L10.3011 21.1135L26.4726 36.8322C26.9461 37.2876 27.2708 37.8755 27.404 38.5185C27.5371 39.1616 27.4725 39.8298 27.2186 40.4356C26.9648 41.0413 26.5335 41.5563 25.9815 41.9128C25.4294 42.2694 24.7823 42.4509 24.1251 42.4336Z" fill="black"/>
      <path d="M47.5996 24.3699H9.25746C8.39275 24.3699 7.56346 24.0268 6.95202 23.4161C6.34057 22.8054 5.99707 21.977 5.99707 21.1133C5.99707 20.2496 6.34057 19.4213 6.95202 18.8105C7.56346 18.1998 8.39275 17.8567 9.25746 17.8567H47.5996C48.4643 17.8567 49.2936 18.1998 49.9051 18.8105C50.5165 19.4213 50.86 20.2496 50.86 21.1133C50.86 21.977 50.5165 22.8054 49.9051 23.4161C49.2936 24.0268 48.4643 24.3699 47.5996 24.3699V24.3699Z" fill="black"/>
    </svg>
    </a>
    <!-- Name of the event -->
    <h1 class="ml-[1.3%] mt-[1%]">{data.Event?.Name}</h1>
  </div>
  <!-- Labels for the navbar -->
  <div class="ml-[2%] w-auto flex flex-row h-[40%] mt-5">
    <a href="/events/id/{data.Event?.EventID}/Overview" class:navBarSelected={$page.url.pathname === `/events/id/${data.Event?.EventID}/Overview`} class="navBarLabel">Overview
      <!-- If the current path is this nav option, then bold it and add an underline -->
      {#if $page.url.pathname === `/events/${data.Event?.EventID}/Overview`} 
        <div class="blackLine"></div>
      {/if}
    </a>
    <a href="/events/id/{data.Event?.EventID}/Teams" class:navBarSelected={$page.url.pathname === `/events/id/${data.Event?.EventID}/Teams`} class="navBarLabel ml-9 nav">Teams
      {#if $page.url.pathname === `/events/${data.Event?.EventID}/Teams`}
        <div class="blackLine"></div>
      {/if}
    </a>
  </div>
</div>
<slot />

<style>
  .eventTitle {
    font-size: 25px;
    font-weight: 600;
  }
  .navBarLabel {
    font-size: 18px;
    font-weight: 450;
  }
  .navBarSelected {
    font-size: 18px;
    font-weight: 600;
  }
  /* Style that is just a black line */
  .blackLine {
    border-bottom: 2px solid black;
  }
</style>