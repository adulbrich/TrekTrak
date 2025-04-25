<script lang="ts">
    import Layout from "../banner-layout.svelte";
    import { goto } from '$app/navigation';
    export let data;
    import { page } from "$app/stores";

    let { session, supabase } = data;
    $: ({ session, supabase } = data); // Listen to changes in supabase

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        goto('/');
    };

    console.log(supabase);

    // Define a type for the Organization table rows
    interface Organization {
        id: number;
        org_name: string;
        description: string;
    }

    let orgName = "";
    let orgDescription = "";
    let organizations: Organization[] = []; // Explicitly type the array
    let showErrorModal = false; // Modal visibility
    let errorMessage = ""; // Modal message

    let userRole: "participant" | "admin" | null = null;
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
        if (userRole !== "developer") {
            console.log("Role is: ", userRole)
            accessDenied = true;
        }
    };

    fetchUserRole();

    const fetchOrganizations = async () => {
        const { data: orgData, error } = await supabase
            .from("Organizations")
            .select("*");

        if (error) {
            console.error("Error fetching organizations:", error);
        } else {
            organizations = orgData as Organization[]; // Type assertion
        }
    };

    const addOrganization = async () => {
        if (!orgName || !orgDescription) {
            errorMessage = "Please fill in all fields.";
            showErrorModal = true;
            return;
        }

        // Check for duplicate names (case-insensitive)
        const { data: existingOrgs, error: fetchError } = await supabase
            .from("Organizations")
            .select("org_name")
            .ilike("org_name", orgName.toLowerCase());

        if (fetchError) {
            errorMessage = "Error checking for existing organization.";
            showErrorModal = true;
            return;
        }

        if (existingOrgs && existingOrgs.length > 0) {
            errorMessage = "An organization with this name already exists.";
            showErrorModal = true;
            return;
        }

        // Insert new organization
        const { data: insertData, error: insertError } = await supabase
            .from("Organizations")
            .insert([{ org_name: orgName, description: orgDescription }]);

        if (insertError) {
            errorMessage = "Error adding organization.";
            showErrorModal = true;
        } else {
            console.log("Organization added successfully:", insertData);
            orgName = "";
            orgDescription = "";
            await fetchOrganizations(); // Refresh the list after adding
        }
    };

    // Close the modal
    const closeModal = () => {
        showErrorModal = false;
        errorMessage = "";
    };

    // Fetch organizations on component load
    fetchOrganizations();
</script>

<Layout>
    {#if accessDenied}
        <div class="flex justify-center items-center h-screen">
            <p class="text-2xl font-bold text-red-600">Only Developers Can Access This Page. </p>
            {#if userRole}
            <p class="text-2xl font-bold text-red-600"> {"Currently Logged in as:  " + userRole}.</p>
            {/if}
        </div>
    {:else}
    <div class="flex flex-col h-full justify-start mx-auto max-w-2xl">
        <!-- Form Section -->
        <div class="flex flex-col mt-10 mb-8">
            <p class="text-2xl font-bold mb-4 text-center">Register a New Organization</p>
            <form 
                on:submit|preventDefault={addOrganization} 
                class="space-y-4"
            >
                <div class="flex flex-col">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="orgName">
                        Organization Name
                    </label>
                    <input
                        id="orgName"
                        type="text"
                        bind:value={orgName}
                        placeholder="Enter organization name"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        required
                    />
                </div>
                <div class="flex flex-col">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="orgDescription">
                        Description
                    </label>
                    <textarea
                        id="orgDescription"
                        bind:value={orgDescription}
                        placeholder="Enter organization description"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add Organization
                </button>
            </form>
        </div>

        <!-- Organizations List Section -->
        <div>
            <p class="text-xl font-bold mb-4">Organizations Registered</p>
            {#if organizations.length > 0}
                <ul class="space-y-4">
                    {#each organizations as org}
                        <li class="p-4 border rounded bg-gray-50 shadow">
                            <p class="font-bold text-lg">{org.org_name}</p>
                            <p class="text-gray-700">{org.description}</p>
                        </li>
                    {/each}
                </ul>
            {:else}
                <p class="text-gray-500">No organizations found.</p>
            {/if}
        </div>

        <!-- Modal -->
        {#if showErrorModal}
            <div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
                <div class="bg-white p-6 rounded shadow-md w-1/3">
                    <p class="text-lg font-bold mb-4">Error</p>
                    <p class="mb-4">{errorMessage}</p>
                    <button
                        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        on:click={closeModal}
                    >
                        Close
                    </button>
                </div>
            </div>
        {/if}
    </div>
    {/if}
</Layout>
