import { Pressable, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { P } from "~/components/ui/typography";
import { ArrowUpDown, BarChart, Bolt, Book, Inbox, IterationCw, PenTool, Share, SlidersHorizontal } from '~/lib/icons/index'
import { IconButton } from "~/components/ui/IconButton";
import { Button } from "~/components/ui/button";
import { Stats } from "~/components/ui/stats";
import { Progress } from "~/components/ui/progress";
import CircularProgress from "~/components/CircleProgress";
import { getUserWordProgress } from "~/apis/word";
import { useCallback, useState } from "react";

export default function HomeScreen() {
    const [progress, setProgress] = useState<{ learned: number, familiar: number, forgotten: number }>({ learned: 0, familiar: 0, forgotten: 0 });

    useFocusEffect(
        useCallback(() => {
            getUserWordProgress().then(response => {
                setProgress(response);
            });
        }, [])
    );

    return (
        <View className="p-4 pt-12">
            <Card className="rounded-md">
                <CardHeader className="flex max-w-sm flex-row items-center justify-between relative">
                    <View className="flex flex-row gap-2 items-center">
                        <Book size={20} color={'grey'} />
                        <P className="text-xl font-bold">
                            专八核心词汇
                        </P>
                        <Text className="text-gray-500">
                            3919词
                        </Text>
                    </View>
                    <View className="flex flex-row items-center absolute right-0">
                        <IconButton icon={<ArrowUpDown size={20} color={'grey'} />} />
                        <IconButton icon={<Bolt size={20} color={'grey'} />} />
                    </View>
                </CardHeader>
            </Card>


            <Card className="rounded-md mt-2">
                <CardHeader className="flex max-w-sm flex-row items-center justify-between relative">
                    <View className="flex flex-row gap-2 items-center">
                        <BarChart size={20} color={'grey'} />
                        <P className="text-xl font-bold">
                            今日概览
                        </P>
                    </View>
                    <View className="absolute -right-2">
                        <Button variant='ghost' className="flex flex-row items-center gap-1">
                            <Share size={20} color={'grey'} />
                            <Text>分享成绩</Text>
                        </Button>
                    </View>
                </CardHeader>
                <CardContent className="flex flex-row gap-2">
                    <View className="w-1/2 flex flex-row flex-wrap gap-2 border-r border-gray-400">
                        <Stats title="学习单词" value="10" unit="个" className="w-1/3" />
                        <Stats title="复习单词" value="10" unit="个" className="w-1/3" />
                        <Stats title="学习时长" value="100" unit="分钟" className="w-1/3" />
                    </View>
                    <View className="w-1/2 flex flex-row flex-wrap gap-2">
                        <Stats title="学习单词" value="10" className="w-1/3" />
                        <Stats title="复习单词" value="10" className="w-1/3" />
                        <Stats title="学习时长" value="10" className="w-1/3" />
                    </View>
                </CardContent>
            </Card>

            <Pressable onPress={() => {
                router.push('/word')
            }}>
                <Card className="rounded-md mt-2">
                    <CardHeader className="flex flex-row gap-2 items-center pb-1">
                        <View className="flex flex-row gap-2 items-center">
                            <PenTool size={20} color={'grey'} />
                            <P className="text-xl font-bold">
                                单词初记
                            </P>
                        </View>
                        <View style={{ flex: 1 }} className="flex flex-row items-center gap-2 pr-2">
                            <Progress value={progress.forgotten / 4000 * 100} className='h-2 w-10/12' indicatorClassName='bg-green-500' />
                            <Text className="text-sm text-gray-500 dark:text-gray-400">{progress.forgotten}词</Text>
                        </View>
                    </CardHeader>
                    <CardFooter className="flex justify-end p-1.5">
                        <Text className="text-sm text-green-500">正在学习</Text>
                    </CardFooter>
                </Card>
            </Pressable>

            <View className="flex flex-row gap-2">
                <View className="w-1/2">
                    <Card className="rounded-md mt-2">
                        <CardHeader className="flex flex-row gap-2 items-center pb-1">
                            <View className="flex flex-row gap-2 items-center">
                                <IterationCw size={20} color={'grey'} />
                                <P className="text-xl font-bold">
                                    强化复习
                                </P>
                            </View>
                            <Text className="text-sm text-gray-500 dark:text-gray-400">{progress.familiar}词</Text>
                        </CardHeader>
                        <CardFooter className="flex justify-end p-1.5">
                            <Text className="text-sm text-orange-500">正在复习</Text>
                        </CardFooter>
                    </Card>

                    <Card className="rounded-md mt-2">
                        <CardHeader className="flex flex-row gap-2 items-center pb-1">
                            <View className="flex flex-row gap-2 items-center">
                                <Inbox size={20} color={'grey'} />
                                <P className="text-xl font-bold">
                                    轻松回顾
                                </P>
                            </View>
                            <Text className="text-sm text-gray-500 dark:text-gray-400">{progress.learned}词</Text>
                        </CardHeader>
                        <CardFooter className="flex justify-end p-1.5">
                            <Text className="text-sm text-sky-500">正在回顾</Text>
                        </CardFooter>
                    </Card>
                </View>
                <View className="w-[49%]">
                    <Pressable onPress={() => {
                        router.push('/filter')
                    }}>
                        <Card className="rounded-md mt-2">
                            <CardHeader className="flex flex-row gap-2 items-center pb-3">
                                <View className="flex flex-row gap-2 items-center">
                                    <SlidersHorizontal size={20} color={'grey'} />
                                    <P className="text-xl font-bold">
                                        筛选单词
                                    </P>
                                </View>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center pt-0 pb-2 relative">
                                <CircularProgress progress={90} size={100} strokeWidth={3} color="#22c55e" />
                                <Text className="text-xl font-bold text-green-500 absolute">90%</Text>
                            </CardContent>
                        </Card>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}