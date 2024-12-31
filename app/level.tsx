import { useEffect, useState } from "react";
import { View, Image, ScrollView, FlatList } from "react-native";
import { useSearchParams } from "expo-router/build/hooks";

import { Text } from "~/components/ui/text";

import { getLevelsByBookId } from "~/apis/level";
import { getBookById } from "~/apis/book";
import { Book, Level } from "~/types";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Progress } from "~/components/ui/progress";
import { H1, P } from "~/components/ui/typography";
import { useColorScheme } from "~/lib/useColorScheme";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Lock, Star } from "~/lib/icons/";

export default function LevelScreen() {
    const params = useSearchParams()
    const bookId = params.get('bookId')
    const colorScheme = useColorScheme()

    const [book, setBook] = useState<Book>()
    const [levels, setLevels] = useState<Level[]>([])
    const [progress, setProgress] = useState<number>(80)

    useEffect(() => {
        if (!bookId) return
        getBookById(bookId).then(book => {
            setBook(book)
        })
        getLevelsByBookId(bookId).then(levels => {
            setLevels(levels)
        })
    }, [])

    return (
        <ScrollView
            stickyHeaderIndices={[1]}
        >
            <View className="p-6" style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View className="w-3/5">
                    <H1 className="text-3xl font-bold">{book?.name}</H1>
                    <P className="text-gray-500">{book?.description}</P>
                </View>
                <Avatar alt="Rick Sanchez's Avatar" className='w-24 h-24'>
                    <AvatarImage source={{ uri: book?.cover }} />
                    <AvatarFallback>
                        <Text>RS</Text>
                    </AvatarFallback>
                </Avatar>
            </View>

            <View className="px-6 py-4 flex-row items-center gap-2" style={{ backgroundColor: colorScheme.isDarkColorScheme ? 'black' : 'white' }}>
                <Progress value={progress} className='h-3 w-11/12' indicatorClassName='bg-sky-600' />
                <P className="font-bold ml-2">{progress}%</P>
            </View>

            <View className="p-6 flex-col gap-2" style={{ backgroundColor: colorScheme.isDarkColorScheme ? 'black' : '#0ea5e9' }}>

                <P className="text-white text-2xl font-bold mb-4">{levels.length}个关卡</P>

                <View className="flex-row">
                    <View>
                        {
                            levels.map((_l, index) => {
                                return (
                                    <View key={index} className="pr-4 flex-col items-center gap-2 h-64">
                                        <View className="p-3 rounded-full bg-white dark:bg-foreground/10">
                                            <Lock size={24} className="text-sky-400 dark:text-foreground/70" />
                                        </View>
                                        {
                                            index !== (levels.length - 1) && (
                                                <View className="w-0.5 h-48 bg-sky-400 dark:bg-foreground/50 rounded-full"></View>
                                            )
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>

                    <View className="flex-1 gap-2">
                        {
                            levels.map((l, index) => {
                                return (
                                    <Card key={index} className="p-6">
                                        <CardHeader>
                                            <CardTitle>Day {l.levelNumber}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <P className="text-3xl font-bold">{l.name}</P>
                                        </CardContent>
                                        <CardFooter className="flex-row justify-end items-center">
                                            <Star size={24} className="text-yellow-500 mr-2" />
                                            <P className="text-xl font-bold">0/10</P>
                                        </CardFooter>
                                    </Card>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}