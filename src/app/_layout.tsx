import { useEffect, useState } from "react";
import "../../global.css"
import { Stack } from "expo-router";
import { getData } from "../Utils/asyncStorage";
import { GlobalProvider } from "../redux/globalProvider";

export default function RootLayout() {
  const [showOnBoarding, setShowOnBoarding] = useState<boolean | null>(null);
  useEffect(() => {
    checkIfAlreadyOnBoarded();
  })

  const checkIfAlreadyOnBoarded = async () => {
    let onBoarded = await getData('onboarded')
    if (onBoarded == 1) {
      setShowOnBoarding(false)
    }
    else {
      setShowOnBoarding(true)
    }
  }
  return (
    <GlobalProvider>
      <Stack initialRouteName="index" screenOptions={{ headerShown: false,}}>
        <Stack.Screen name="index" />
        <Stack.Screen name="on-boarding-screen" options={{ headerShown: false }} />
        <Stack.Screen name="expenseModal" options={{ presentation: 'modal', }} />
      </Stack>
    </GlobalProvider>
  );
}
