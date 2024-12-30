import { Tabs } from "expo-router";
import { BookOpenIcon, HomeIcon } from "lucide-react-native";
import { Platform } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { HapticTab } from "~/components/HapticTab";
import TabBarBackground from "~/components/ui/TabBarBackground";
import { useColorScheme } from "~/hooks/useColorScheme";

export default function TabLayout() {
    const colorScheme = useColorScheme()

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen name="index" options={{
                title: 'Home',
                headerShown: true,
                tabBarIcon: ({ color, focused, size }) => (
                    <HomeIcon color={color} size={size} />
                )
            }} />
            {/* quiz tab */}
            <Tabs.Screen name="quiz" options={{
                title: 'Quiz',
                tabBarIcon: ({ color, focused, size }) => (
                    <BookOpenIcon color={color} size={size} />
                )
            }} />
        </Tabs>
    )
}