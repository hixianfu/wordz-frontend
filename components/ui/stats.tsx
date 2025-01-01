import { View } from "react-native";

import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

export interface StatsProps {
    className?: string;
    title: string;
    value: string;
    unit?: string;
}

export function Stats({ title, value, className, unit }: StatsProps) {
    return (
        <View className={cn(className)}>
            <Text className="font-bold text-sm">{title}</Text>
            <View className="flex flex-row items-baseline gap-1">
                <Text className="text-3xl font-bold">{value}</Text>
                {unit && <Text className="text-sm text-gray-500 dark:text-gray-400">{unit}</Text>}
            </View>
        </View>
    )
}