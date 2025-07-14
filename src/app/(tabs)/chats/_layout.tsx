// src/app/(tabs)/(chat)/_layout.tsx
import { Stack } from "expo-router";

export default function ChatStack() {
    return (
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen 
                name="index" 
                options={{ 
                    title: "Messages",
                }} 
            />
            <Stack.Screen 
                name="[id]" 
                options={{ 
                    title: "Chat",
                    headerBackTitle: "", // Use this instead of headerBackTitleVisible
                }} 
            />
        </Stack>
    );
}