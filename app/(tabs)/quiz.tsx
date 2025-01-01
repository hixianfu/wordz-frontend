import { View, Image, Pressable, ScrollView } from "react-native";
import { useState, useEffect } from "react";

import { Card, CardFooter, CardHeader } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Bookmark } from "~/lib/icons/index";

import { getBooksByDifficulty } from "~/apis/book";
import { Book } from "~/types";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const BOOKS_DIFFICULTY = ['全部', '零基础', '入门', '进阶', '高级'];

export default function QuizScreen() {
    const [books, setBooks] = useState<Book[]>([]);
    const [bookDifficulty, setBookDifficulty] = useState<string>('全部');
    const [tab, setTab] = useState('难易度');

    const fetchBooks = async (difficulty?: string) => {
        const b = await getBooksByDifficulty(difficulty);
        setBooks(b);
    }


    const handleBookDifficultyChange = async (difficulty: string) => {
        setBookDifficulty(difficulty);
        await fetchBooks(difficulty);
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <View className='p-4'>
            <Tabs
                value={tab}
                onValueChange={setTab}
                className='w-full mx-auto flex-col gap-1.5'
            >
                <TabsList className='flex-row w-full'>
                    <TabsTrigger value='难易度' className='flex-1'>
                        <Text>难易度</Text>
                    </TabsTrigger>
                    <TabsTrigger value='类别' className='flex-1'>
                        <Text>类别</Text>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='难易度'>

                    <View className="flex flex-row gap-1 pb-2">
                        {
                            BOOKS_DIFFICULTY.map((item, index) => (
                                <View key={index}>
                                    <Button className="rounded-full" size='sm' variant={bookDifficulty === item ? 'default' : 'outline'} onPress={() => handleBookDifficultyChange(item)}>
                                        <Text>{item}</Text>
                                    </Button>
                                </View>
                            ))
                        }
                    </View>

                    <ScrollView style={{ height: '87%' }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 8 }}>
                            {books.length > 0 && books.map((book) => (
                                <Pressable key={book.id} onPress={() => router.push(`/level?bookId=${book.id}`)} style={{ width: '48%', }}>
                                    <Card key={book.id}>
                                        <CardHeader className="p-0 relative">
                                            <Image source={{ uri: book.cover }} style={{ width: '100%', height: 200 }} className="rounded-tl-lg rounded-tr-lg" />
                                            <Button className="absolute top-2 w-12 right-2 bg-[rgba(0,0,0,0.3)] rounded-full" onPress={() => { }}>
                                                <Bookmark size={24} color={'grey'} />
                                            </Button>
                                        </CardHeader>
                                        <CardFooter className="flex-col pt-2">
                                            <Text className="font-bold">{book.name}</Text>
                                            <Text>{book.difficulty}·{book.totalLevel}日完成</Text>
                                        </CardFooter>
                                    </Card>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </TabsContent>
                <TabsContent value='类别'>
                    <Text>暂无</Text>
                </TabsContent>
            </Tabs>
        </View>
    )
}
