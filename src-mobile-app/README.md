# TrekTrak Mobile Fitness App

## Overview

This is a [Expo](https://docs.expo.dev/) + [React Native project](https://reactnative.dev/docs/).

The dev server can be ran via ```npm run start```.

Notable libraries used:
* [NativeWind](https://www.nativewind.dev/) (port of [Tailwind](https://tailwindcss.com/docs/), used for application styling)
* [React Redux](https://react-redux.js.org/) (state management)

## Layout

* ```src``` - application routes
* ```components``` - reusable React Native components
* ```assets``` - static files needed by the application such as icons and images
* ```constants``` - definitions files such as theme colors

## `src` Directory

The `src` folder contains nearly all of the core logic and code in a React Native project. This includes the user interface, navigation, Redux logic, and third-party integrations like Supabase. It serves as the central hub of the app’s functionality.

---

### `app` Folder

The `app` folder contains code related to screen routing and layout using **Expo Router**. Think of this as where all the screen-level navigation logic lives.

- **`_layout.tsx`** is the first file that runs when the app boots. It sets up the global layout, providers (e.g. Redux, Tamagui), theme, and splash screen.
- **`index.tsx`** acts as the landing page. It handles logic for checking authentication and fetching key data like profile stats and events.
- Other files in this folder represent routeable screens such as the **Team Leaderboard** and **Individual Leaderboard**.

> Note: Home and Events screens are currently located in the `features` folder, but a future refactor may relocate them to improve modularity and organization.

---

### `features` Folder

This folder contains the components and logic for specific features or screens of the app.

- Includes shared UI elements and business logic.
- Subfolders like `home` and `events` hold full screen layouts, despite not being in the `app` folder.
- If you’re adding a new feature and need state management, create a slice in the `store` folder.

For Redux usage and creating slices, refer to the documentation linked above.

---

## `app.json`

This file configures the app's metadata, including:

- App name, icons, and splash screen
- iOS and Android build settings
- The current **bundle identifier**: `com.TrekTrak`

If the bundle identifier is changed (e.g., to `com.Capucity.trektrak` for better consistency with the Capucity org), the app will need to be re-released under a new identity in the App Store/Play Store to preserve signing keys.

---

## `eas.json`

Defines **Expo Application Services (EAS)** build settings. It also includes references to public environment variables needed to connect with external services like Supabase.

---

## Environment Variables

To use environment variables locally, create a `.env` file in the project root (typically `src-mobile-app/`). This file should include your Supabase keys and other sensitive values. You can find these keys in the Supabase dashboard or referenced in the Supabase README.


## What it Means to Be an Expo Project

**Expo** is a framework built on top of **React Native** that simplifies mobile app development for both **iOS** and **Android**. It provides tools, APIs, and services that make building, testing, and deploying apps much easier—especially for teams without deep native development experience.

### Key Features

- **Cross-platform**: Write once in JavaScript/TypeScript, run on both iOS and Android.
- **OTA Updates**: Push updates without App Store or Play Store resubmissions.
- **Simplified Builds**: Use `expo start`, `expo install`, and `eas build` for easy development and deployment.
- **Built-in APIs**: Access device features (camera, location, notifications) without native code.

### Navigation & Structure

With **Expo Router**, routing is file-based (like Next.js). 
- `app/_layout.tsx` defines layout wrappers.
- Navigation is declarative using `<Link />` and `<Redirect />`.
  
This differs from traditional React Native apps, which use `react-navigation` and manually configure routes and stacks in JavaScript.

### Summary

Expo streamlines app development and deployment with minimal native setup, making it great for rapid development. Just be aware of the differences in routing, command usage, and native module support compared to vanilla React Native.
