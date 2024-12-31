import { Tabs } from "expo-router";
import { BookOpenIcon, HomeIcon } from "lucide-react-native";
import { Platform } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { HapticTab } from "~/components/HapticTab";
import { ThemeToggle } from "~/components/ThemeToggle";
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
                title: '首页',
                headerShown: true,
                tabBarIcon: ({ color, size }) => (
                    <HomeIcon color={color} size={size} />
                ),
                headerRight: () => <ThemeToggle />
            }} />
            <Tabs.Screen name="quiz" options={{
                title: '题本',
                headerShown: true,
                tabBarIcon: ({ color, size }) => (
                    <BookOpenIcon color={color} size={size} />
                ),
                headerRight: () => <ThemeToggle />
            }} />
        </Tabs>
    )
}