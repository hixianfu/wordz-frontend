import { View, Image, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { BookmarkIcon } from "lucide-react-native";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";

import { getBooksByDifficulty } from "~/apis/book";
import { Book } from "~/types";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";

export default function QuizScreen() {
    const [books, setBooks] = useState<Book[]>([]);

    const fetchBooks = async () => {
        const b = await getBooksByDifficulty();
        setBooks(b);
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 8 }}>
            {books.length > 0 && books.map((book) => (
                <Pressable key={book.id} onPress={() => router.push(`/level?bookId=${book.id}`)} style={{ width: '48%', }}>
                    <Card key={book.id}>
                        <CardHeader className="p-0 relative">
                            <Image source={{ uri: book.cover }} style={{ width: '100%', height: 200 }} className="rounded-tl-lg rounded-tr-lg" />
                            <Button className="absolute top-2 w-12 right-2 bg-[rgba(0,0,0,0.3)] rounded-full" onPress={() => { }}>
                                <BookmarkIcon size={24} color={'grey'} />
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
    )
}
