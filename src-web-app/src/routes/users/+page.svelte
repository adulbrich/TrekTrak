<!-- Description: Page to add users through a form, though might not be necessary. It should be functioning with the Supabase. -->
<script lang="ts">
    import Layout from "../banner-layout.svelte";
    import { goto } from '$app/navigation';

    export let data;
    let { session, supabase } = data;
    $: ({ session, supabase } = data); // Listen to changes in Supabase

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

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        goto('/');
    };

    // Define a type for the user data
    interface Profile {
        ProfileID: string;
        CreatedAt: string;
        UpdatedAt: string;
        Name: string;
        Role: "participant" | "admin" | "developer";
        Organization: string;
    }

    // Define a type for organizations
    interface Organization {
        id: number;
        org_name: string;
    }

    let profiles: Profile[] = [];
    let orgName = "";
    let userName = "";
    let userPassword = "";
    let userEmail = "";
    let userRoleInput: "participant" | "admin" = "participant"; // Default role
    let formMessage = "";
    let organizations: Organization[] = [];

    const fetchOrganizations = async () => {
        const { data: orgData, error } = await supabase.from("Organizations").select("*");
        if (error) {
            console.error("Error fetching organizations:", error);
        } else {
            organizations = orgData as Organization[];
        }
    };

    const fetchProfiles = async () => {
        const { data: profileData, error } = await supabase.from("Profiles").select("*");
        if (error) {
            console.error("Error fetching profiles:", error);
        } else {
            profiles = profileData as Profile[];
        }
    };

    const addProfile = async () => {
        formMessage = "";

        if (!userName || !userPassword || !userEmail || !userRoleInput || !orgName) {
            formMessage = "All fields are required.";
            return;
        }

        // Create a new user in auth.users
        const { data: newUser, error: signUpError } = await supabase.auth.signUp({
            email: userEmail,
            password: userPassword,
        });

        if (signUpError || !newUser || !newUser.user) {
            formMessage = "Failed to create a new user.";
            console.error("Error creating user:", signUpError);
            return;
        }

        const newProfileID = newUser.user.id; // Get the new user's ID
        const currentTimestamp = new Date().toISOString();

        // Check if the organization exists
        const { data: orgData, error: orgError } = await supabase
            .from("Organizations")
            .select("*")
            .eq("org_name", orgName);

        if (orgError || orgData.length === 0) {
            formMessage = "The organization does not exist.";
            return;
        }

        // Insert the new profile into Profiles table
        const { error: insertError } = await supabase.from("Profiles").insert([
            {
                ProfileID: newProfileID,
                CreatedAt: currentTimestamp,
                UpdatedAt: currentTimestamp,
                Name: userName,
                Role: userRoleInput,
                Organization: orgName,
            },
        ]);

        if (insertError) {
            console.error("Error adding profile:", insertError);
            formMessage = "Failed to add profile.";
        } else {
            console.log("Profile added successfully");
            userName = "";
            userPassword = "";
            userEmail = "";
            userRoleInput = "participant"; // Reset to default
            orgName = "";
            formMessage = "Profile added successfully";
            await fetchProfiles();
        }
    };

    fetchOrganizations();
    fetchProfiles();
</script>

<Layout>
    {#if accessDenied}
        <div class="flex justify-center items-center h-screen">
            <p class="text-2xl font-bold text-red-600">Only Admins and Developers can add users.</p>
            {#if userRole}
                <p class="text-2xl font-bold text-red-600"> {"Currently Logged in as:  " + userRole}.</p>
            {/if}
        </div>
    
    {:else}
        <div class="flex flex-col h-full justify-start mx-auto max-w-2xl">
            <div class="flex flex-col mt-10 mb-8">
                <p class="text-2xl font-bold mb-4 text-center">Add Profile</p>
                <form on:submit|preventDefault={addProfile} class="space-y-4">
                    <div class="flex flex-col">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            bind:value={userName}
                            placeholder="Enter user name"
                            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            required
                        />
                    </div>
                    <div class="flex flex-col">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            bind:value={userPassword}
                            placeholder="Enter password"
                            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            required
                        />
                    </div>                
                    <div class="flex flex-col">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            bind:value={userEmail}
                            placeholder="Enter user email"
                            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            required
                        />
                    </div>
                    <div class="flex flex-col">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Role
                        </label>
                        <select
                            bind:value={userRoleInput}
                            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            required
                        >
                            <option value="participant">Participant</option>
                            <option value="admin">Admin</option>
                            <option value="developer">Developer</option>
                        </select>
                    </div>
                    <div class="flex flex-col">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Organization
                        </label>
                        <input
                            type="text"
                            bind:value={orgName}
                            placeholder="Enter organization name"
                            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            required
                        />
                    </div>
                    {#if formMessage}
                        <p class="text-red-500 text-sm">{formMessage}</p>
                    {/if}
                    <button
                        type="submit"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Profile
                    </button>
                </form>
            </div>
        </div>
    {/if}
</Layout>
