<img src="src-web-app/static/about/logo.png" alt="FSF Logo" width="75"/>

# Faculty Staff Fitness

## Description
FSF (Faculty Staff Fitness) is an app where users join teams and compete against other teams based on the number of steps they take. It is event-based with one event held each month. The project consists of two parts: a web application for event organizers and a mobile application for users.  We are also using Starlight for the documentation of the project.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [References](#references)

## Installation

### Prerequisites
- Node.js
- npm (Node Package Manager)

### Step-by-Step Instructions

#### Web Application

1. Clone the repository:
    ```bash
    git clone https://github.com/OregonStateUniversity/osu-fsf.git
    ```

2. Navigate to the web app directory:
    ```bash
    cd src-web-app
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

#### Mobile Application

1. Clone the repository (if not already done for the web app)
    ```bash
    git clone https://github.com/adulbrich/TrekTrak.git
    ```

2. Navigate to the mobile app directory:
    ```bash
    cd src-mobile-app
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Set up .env file
    ```
    # /src-mobile-app/.env
    EXPO_PUBLIC_SUPABASE_URL="<supabase url>"
    EXPO_PUBLIC_SUPABASE_ANON_KEY="<supabase anon key>"
    ```
5. Set up mobile emulator
    Android 
        a. Open Android Studio
        b. Go to Virtual Device Manager
        c. Select Run or Create virtual device

    iOS (Mac only)
        a. Open Xcode simulator


6. Start the Expo development server:
    ```bash
    npm run start
    ```

#### Starlight Documentation

Everything you need to know about the project is in the Starlight documentation. 

1. Clone the repository:
    ```bash
    git clone https://github.com/OregonStateUniversity/osu-fsf.git
    ```
2. Navigate to the Starlight directory:
    ```bash
    cd src-docs
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Start the development server:
    ```bash
    npm run dev
    ```



## Usage

### Web Application
The web application is used by event organizers to create and manage events. Once the server is running, navigate to the provided URL to access the application.

### Mobile Application
The mobile application is used by users to join events, track their steps, and compete with other teams. After starting the Expo server, use the Expo Go app on your mobile device to scan the QR code and interact with the application.

## FAQ

#### Why is Expo Go not working?

- If you are having trouble, make sure your internet connection is set to private on your laptop and mobile device, make sure your network has device discovery enabled (For example, OSU secure does not work with Expo Go), make sure your firewall is not blocking the connection, and make sure your mobile device is on the same network as your laptop. If you are still having trouble, try using the tunnel option in the Expo Go app. If you are using a Mac and still having trouble, try using the ios emulator (Windows does not support ios emulators).

#### How does the backend work?

- The backend is built using Supabase, a cloud database service. Supabase provides a RESTful API for interacting with the database. The web application creates events by adding rows to the events table in the database. The mobile application retrieves the events from the database and allows users to join events and track their steps.

#### How is progress tracked?

- The mobile application uses the device's pedometer to track the number of steps taken by the user. Their progress is tracked in chunks in the ActivityProgress table.  

#### How does the routing system work for the web app?

- The web application uses SvelteKit.  The routing system is based on the file structure of the project. The /events homepage is in src/routes/events/+page.svelte.  

#### Do the users have access to the web app?

- No, the web app is only for event organizers. Users can only access the mobile app.  

#### How do you retrieve data from the database on the mobile app?

- The mobile app uses Redux to manage the state of the application. When the app is loaded, it makes a request to the Supabase API to retrieve the events. The events are stored in the Redux store and displayed in the app.

#### Is this project ready for production?

- No, the project is still in development and is not ready for production. Mostly all of the functionality is there, but there some features and design elements that need to be added.



## References
- [SvelteKit Documentation](https://kit.svelte.dev/docs/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Documentation](https://daisyui.com/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Tamagui Documentation](https://tamagui.dev/)
- [Redux Documentation](https://redux.js.org/introduction/getting-started)
- [Supabase Documentation](https://supabase.io/docs)
- [Starlight Documentation](https://starlight.astro.build/)