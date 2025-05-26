<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { fade } from 'svelte/transition';
  import osuLogo from '$lib/images/OSU_horizontal_2C_O_over_B.png';
  import { afterNavigate, goto, invalidateAll } from '$app/navigation';
  import toast from 'svelte-french-toast';
  import { tick } from 'svelte';
    
  // Page data and form data
  export let form;
  export let data;
  let { supabase } = data;
  $: ({ supabase } = data);

  // Variables related to the auth form
  let email: string = '';
  let password: string = '';
  let actionSubmitted: boolean = false;
  $: signInDisabled = email === '' || password === '' || actionSubmitted;

  // Auth form user / password refs
  let emailRef: HTMLInputElement | undefined;
  let passwordRef: HTMLInputElement | undefined;

  // On page enter, auto focus the username input
  afterNavigate(({ type }) => {
    if (type === 'enter') emailRef?.focus();
  });

  function getFormValue(form: FormData, id: string) {
    return form.get(id) as string;
  }

  // Only used in the DEV environment
  async function signInWithGitHub() {
    // Disable form for submission
    actionSubmitted = true;

    // Attempt sign in
    const signInResult = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost:5173/auth/callback'
      }
    });

    setTimeout(() => {
      // Show the error to the user
      if (signInResult.error)
        toast.error(signInResult.error.message);

      // Enable form controls
      actionSubmitted = false;
    }, 3000);
  }
</script>

<svelte:head>
  <title>Login | DamFit</title>
</svelte:head>

<!-- Centered container -->
<div class="flex flex-col h-full justify-center mx-auto max-w-sm">

  <!-- Login modal -->
  <div class="shadow-lg rounded-md ring-1 ring-black/5 flex flex-col">
    <!-- Logo
    <div class="py-4 text-center px-4 border-b border-black/5 flex items-end justify-between">
      <img class="h-auto w-[50%] p-2" src="/FSF_Logo_Transparent.png" alt="OSU Logo">
      TrekTrak
    </div>-->

    <!-- Title -->
    <div class="p-8 pb-0 text-xl font-semibold">
      Login
    </div>
    
    <!-- Sign in form -->
    <form
      class="flex flex-col gap-4 p-8"
      method="post"
      use:enhance={({ formData }) => {
        // Disable form submission for now
        actionSubmitted = true;
        return async ({ update, result }) => {
          // Act based on the result type
          switch (result.type) {
            case 'redirect':
              // If the form returns with a redirect (shouldn't happen) we handle it
              goto(result.location);
              break;
            case 'success':
              // Call invalidateAll(), which triggers a new page load
              // The load function in +page.server.ts will throw a redirect
              // to /events because a session now exists!
              invalidateAll();
              break;
            default:
              // This is for 'failure' and other types
              // If you don't add a timeout, immediately trying to focus the password element breaks stuff.
              // This is an ugly hack, I know.
              // Reference: https://github.com/sveltejs/kit/issues/8439
              // BONUS: Prevents auth spamming
              setTimeout(() => refocus(), 500);
          }

          // Define our refocus function which is explained above
          const refocus = async () => {
            // Update our form data variable
            await applyAction(result);

            // Reset form values
            email = getFormValue(formData, 'email') || '';
            password = '';

            // Allow the form to be submitted again
            actionSubmitted = false;

            // Issue a toast!
            if (form && !form.success && form.errorMessage)
              toast.error(form.errorMessage);

            // Apply focus back to the password field
            // await tick() is ugly but focus breaks without it :(
            await tick();
            passwordRef?.focus();
          }
        }
      }
    }>
      <!-- Email input -->
      <div class="flex flex-col gap-2">
        <label for="email" class="text-gray-500 font-medium text-sm">EMAIL</label>
        <input
          bind:this={emailRef}
          bind:value="{email}"
          disabled={actionSubmitted}
          name="email"
          autocomplete="email"
          class="ring-1 ring-black/10 rounded outline-none focus:ring-2 focus:ring-blue-400 transition-all ease-in-out px-3 h-10"
          />
      </div>

      <!-- Password input -->
      <div class="flex flex-col gap-2">
        <label for="password" class="text-gray-500 font-medium text-sm">PASSWORD</label>
        <input
          bind:this={passwordRef}
          bind:value="{password}"
          disabled={actionSubmitted}
          type="password"
          name="password"
          autocomplete="current-password"
          class="ring-1 ring-black/10 rounded outline-none focus:ring-2 focus:ring-blue-400 transition-all ease-in-out px-3 h-10"
          />
      </div>

      <!-- Forgot password -->
      <div class="flex">
        <a href="/auth/forgotPassword" class="text-gray-500">Forgot password?</a>
      </div>

      <!-- Sign in button -->
      <button
        class="flex justify-center items-center text-white disabled:text-gray-300 ring-1 ring-blue-400/75 disabled:ring-0 bg-blue-400 hover:bg-blue-500 disabled:bg-gray-100 transition-all ease-in-out disabled:cursor-not-allowed h-10 w-32 mt-4 rounded"
        disabled={signInDisabled}
        >
        <!-- Conditional that shows a spinner IF we are processing a sign in request -->
        {#if actionSubmitted}
          <div class="absolute" in:fade={{ delay: 50 , duration: 50  }} out:fade={{ duration: 50 }}>
            <svg class="animate-spin w-6 h-6 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        {:else}
          <span in:fade={{ delay: 50 , duration: 50  }} out:fade={{ duration: 50 }} class="absolute text-md font-bold">SIGN IN</span>
        {/if}
      </button>
    </form>
  </div>
</div>
