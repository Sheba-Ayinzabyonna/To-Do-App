// App.tsx
import 'react-native-reanimated'; // Must be imported first for Reanimated
import React from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ThemeProvider } from '../src/context/ThemeContext';
import TodoScreen from '../src/screens/TodoScreen';

// Ensure your .env or app.json sets this variable
const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL; 
if (!CONVEX_URL) {
    throw new Error('EXPO_PUBLIC_CONVEX_URL is not set!');
}

const convex = new ConvexReactClient(CONVEX_URL);

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider>
        {/* React Native elements for global status bar/safe area */}
        <TodoScreen /> 
      </ThemeProvider>
    </ConvexProvider>
  );
}



