# To-Do-App
# Setup instructions
Initialize the Expo Project 
npx create-expo-app todo-convex-app

- npm run android
- npm run ios # you need to use macOS to build the iOS project - use the Expo app if you need to do iOS development without a Mac
- npm run web

# Build commands
# Environment variables config
# Convex setup steps

**Step 1: Install the Convex CLI**
Open your terminal or command prompt and install the Convex command-line interface globally:
```bash
npm install -g convex
```

**Step 2: Initialize Your Convex Project**
Navigate to the root directory of your React Native project (todo-convex-app/) in your terminal. Then, run the initialization command:

```bash
convex init
```

This command will guide you through a few steps:

### 1. Log in/Sign up: It will prompt you to open a URL in your browser to log in to your Convex account or sign up if you don't have one.

### 2.Create a New Project: Once logged in, it will ask you to name your new Convex project

### 3. Project Files: The CLI will then create the necessary files and directories in your local project:

A convex/ directory containing the initial backend code (convex/schema.ts and convex/myFunctions.ts).

A convex.json file, which stores your project configuration.

A .env.local file, which stores your private deployment key (ensure this file is in your .gitignore).

**Step 3: Start the Convex Development Server**
Once initialized, start the Convex development process. This watches your local convex/ directory for changes and automatically pushes them to your Convex cloud backend in real-time.
```bash
convex dev
```
The output will display your development deployment URL (e.g., <https://example-app-dev.convex.cloud>).

**Step 4: Link Convex URL to Your Expo App**
Finally, you must link this development URL to your React Native application using the environment variable we discussed previously.

### 1.Copy the Development URL shown in your terminal (or from your Convex Dashboard).

### 2.Update your .env file in the root of your project:

# .env file

EXPO_PUBLIC_CONVEX_URL="YOUR_COPIED_DEVELOPMENT_URL_HERE"

### 3.Restart your Expo development server to load the new environment variable:

```bash
npx expo start --clear
```
