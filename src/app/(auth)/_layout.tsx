import "../../../global.css"
import { Stack } from "expo-router";

export default function RootLayout() {
    return(
        <Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{ title: "login" }}/>
            <Stack.Screen name="register" options={{ title: "signup" }}/>
        </Stack>
    )
}