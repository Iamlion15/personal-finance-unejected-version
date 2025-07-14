import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import "../../../global.css";
export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true, tabBarActiveTintColor: "#1A73E8", tabBarInactiveTintColor: "#757575", tabBarStyle: { backgroundColor: "#FFFFFF", borderTopColor: "#E0E0E0" }}}>
      <Tabs.Screen name="overview" options={{ title: "Overview", tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "grid" : "grid-outline"} size={size} color={color} /> }} />
      <Tabs.Screen name="goals" options={{ title: "Goals", tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "flag" : "flag-outline"} size={size} color={color} /> }} />
      <Tabs.Screen name="savings" options={{ title: "Savings", tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "wallet" : "wallet-outline"} size={size} color={color} /> }} />
      <Tabs.Screen name="Notifications" options={{ title: "Notifications", tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "notifications" : "notifications-outline"} size={size} color={color} /> }} />
       <Tabs.Screen name="chats" options={{headerShown:false, title: "Chats", tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "chatbubble" : "chatbubble-outline"} size={size} color={color} /> }}/>
    </Tabs>
  );
}