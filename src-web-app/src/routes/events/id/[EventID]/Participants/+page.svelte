<script lang="ts">
    export let data;
    import Layout from '../../../../banner-layout.svelte';

    let searchQuery = '';

function filterParticipants() {
  const rows = document.querySelectorAll('.team-row');
  rows.forEach((row) => {
    const teamName = row.querySelector('.text-lg').innerText.toLowerCase();
    const teamMembers = Array.from(row.querySelectorAll('.hidden li')).map((member) =>
      member.innerText.toLowerCase()
    );
  const display =
      teamName.includes(searchQuery.toLowerCase()) ||
      teamMembers.some((memberName) => memberName.includes(searchQuery.toLowerCase()))
        ? 'table-row'
        : 'none';

    row.style.display = display;
  });
}

</script>


<svelte:head>
   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">

    <title>
           Event | Top Teams & Participants
    </title>

    <style>
      .team-row {
        @apply transition-all ease-out bg-gray-100 rounded-lg;
      }
  
      .team-row:hover {
        @apply bg-gray-200;
      }
    </style>

    
</svelte:head>


<Layout>
    <!--This container should keep eveythgint on the right of the vertical navbar-->
    <div class='container ml-[16%] w-auto'>
          <!--Teams -->
          <div class="max-w-full p-4 mx-auto">
            <!-- Search Bar -->
            <input
                type="text"
                placeholder="Search participants..."
                class="w-full p-2 border border-gray-300 rounded-md mb-4"
                bind:value={searchQuery}
                on:input={() => filterParticipants()}
            />

            <!--Table showing the teams and their members when you click on the team, should also show the teams members-->
            <table class="table-auto text-left w-full bg-white border border-gray-300 shadow-md rounded-lg">
              <!--Table Header-->
              <thead>
                  <tr class="bg-gray-200">
                      <th class="px-4 py-2">Participants Name</th>
                      
                      <th class="px-4 py-2">Participants Email</th>
                  </tr>
              </thead>
              <tbody>
                <!--Loop through each paricipant-->
                {#each data.Profiles as profile (profile.ProfileID)}
                  <tr class="border border-gray-300 team-row w-full" data-id={profile.ProfileID} style="transition: all 0.3s ease-out;">
                    <td class="px-4 py-2 cursor-pointer">
                      <div class='w-full'>
                        <span class="text-lg">{profile.Name}</span>
                        <i class="fa fa-chevron-down ml-2"></i>
                      </div>
                    </td>
                  </tr>
                  {/each}
              </tbody>
          </table>
          
    </div>

</Layout>