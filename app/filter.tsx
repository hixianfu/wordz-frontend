import { FlatList, View, FlatListComponent, FlatListProps, Pressable, StyleSheet, Alert } from "react-native";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { ALLWord, getAllWords } from "~/apis/word";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { Checkbox } from "~/components/ui/checkbox";
import { ListChecks, ListTodo, RotateCcw } from '~/lib/icons'
import { IconButton } from "~/components/ui/IconButton";
import { Button } from "~/components/ui/button";

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const ITEM_HEIGHT = 80; // 每个项的高度
const WORD_STATUS_MAP = {
    '0': '学习中',
    '1': '复习中',
    '2': '已掌握',
    '-1': '未学习'
}

export default function AlphabetListScreen() {
    const { isDarkColorScheme } = useColorScheme();

    const [checkboxes, setCheckboxes] = useState<number[]>([]);
    const [filterData, setFilterData] = useState<ALLWord[]>([]);
    const [data, setData] = useState<ALLWord[]>([]);
    const [currentAlphabet, setCurrentAlphabet] = useState('A')
    const flatListRef = useRef<FlatListComponent<ALLWord, FlatListProps<ALLWord>>>(null);

    const handleLongPress = (item: ALLWord) => {
        setCheckboxes(prevCheckboxes => {
            if (prevCheckboxes.includes(item.id)) {
                return prevCheckboxes.filter(i => i !== item.id)
            } else {
                return [...prevCheckboxes, item.id]
            }
        })
    };

    useEffect(() => {
        getAllWords().then(response => {
            setData(response);
        })
    }, []);


    const Item = memo(({ item }: { item: ALLWord }) => (
        <View style={styles.item} className="relative w-11/12 flex flex-row justify-center items-center gap-2">
            <Checkbox checked={checkboxes.includes(item.id)} onCheckedChange={() => setCheckboxes(prevCheckboxes => {
                if (prevCheckboxes.includes(item.id)) {
                    return prevCheckboxes.filter(i => i !== item.id)
                } else {
                    return [...prevCheckboxes, item.id]
                }
            })} />
            <View className="flex-1">
                <Text className="text-2xl font-semibold">{item.cet4_word}</Text>
                <Text>
                    <Text className="text-green-500 font-extrabold text-lg">
                        {item.cet4_translate.split('.')[0]}.
                    </Text>
                    {item.cet4_translate.split('.')[1]}
                </Text>
            </View>
            <Text className="absolute top-0 right-0 text-gray-400">
                {
                    WORD_STATUS_MAP[item.status]
                }
            </Text>
        </View>
    ));
    const renderItem = useCallback(({ item }: { item: ALLWord }) => (
        <Pressable onPress={() => handleLongPress(item)}>
            <Item item={item} />
        </Pressable>
    ), [checkboxes.length]);

    const scrollToLetter = (letter: string) => {
        const index = data.findIndex(item => item.letter === letter);
        if (index !== -1) {
            flatListRef.current?.scrollToIndex({ index, animated: true });
        }
    };

    const handleAlphabetPress = (letter: string) => {
        scrollToLetter(letter)
        setCurrentAlphabet(letter)
    }

    const getItemLayout = (data: ArrayLike<ALLWord> | null | undefined, index: number) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    });

    const handleSelectAll = (type: 'invert' | 'all' = 'all') => {
        if (type === 'all') {
            setCheckboxes(data.map(item => item.id))
        } else {
            setCheckboxes(data.filter(item => !checkboxes.includes(item.id)).map(item => item.id))
        }
    }

    return (
        <View style={{ height: 900, width: '100%' }}>
            <View className="flex flex-row bg-gray-300 dark:bg-background relative">
                <View className="pl-4">
                    {alphabet.map(letter => (
                        <Pressable key={letter} onPress={() => handleAlphabetPress(letter)}>
                            <Text className={(currentAlphabet === letter ? 'text-sky-500' : '') + ' font-bold text-lg'}>{letter}</Text>
                        </Pressable>
                    ))}
                </View>
                <FlatList
                    ref={flatListRef}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    getItemLayout={getItemLayout}
                    style={[styles.list, {
                        backgroundColor: isDarkColorScheme ? '#111' : '#fff',
                        height: checkboxes.length > 0 ? 630 : 700,
                        marginBottom: checkboxes.length > 0 ? 0 : 100
                    }]}
                />
                {
                    checkboxes.length > 0 &&
                    (
                        <View className="absolute h-20 p-2 px-5 -bottom-20 left-0 right-0 bg-white border-t border-gray-500 z-50 dark:bg-background w-screen">
                            <View className="flex flex-row items-center justify-between">
                                <Text>
                                    已选中
                                    <Text style={{ padding: 4 }} className="ml-4 font-bold text-lg">{checkboxes.length}</Text>
                                    词
                                </Text>
                                <View className="flex flex-row items-center">
                                    <Button variant='ghost' className="flex flex-row items-center" size='sm' onPress={() => handleSelectAll('all')}>
                                        <ListChecks size={24} color='#22c55e' />
                                        <Text>全选</Text>
                                    </Button>
                                    <Button variant='ghost' className="flex flex-row items-center" size='sm' onPress={() => handleSelectAll('invert')}>
                                        <ListTodo size={24} color='#22c55e' />
                                        <Text>反选</Text>
                                    </Button>
                                    <Button variant='ghost' className="flex flex-row items-center" size='sm' onPress={() => setCheckboxes([])}>
                                        <RotateCcw size={24} color='#22c55e' />
                                        <Text>重置</Text>
                                    </Button>
                                    <Button variant='ghost' size='sm'>
                                        <Text>完成</Text>
                                    </Button>
                                </View>
                            </View>
                            <View>
                                <Button>
                                    <Text>设置</Text>
                                </Button>
                            </View>
                        </View>
                    )
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        marginLeft: 8,
        marginTop: 10,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    item: {
        padding: 16,
        marginLeft: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 20,
        overflow: 'hidden',
        height: ITEM_HEIGHT
    }
})