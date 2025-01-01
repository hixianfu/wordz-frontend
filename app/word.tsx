import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import PagerView from 'react-native-pager-view';
import { Audio } from "expo-av";

import { audioUrl, getDailyWords } from '~/apis/word';
import { IconButton } from '~/components/ui/IconButton';
import { Progress } from '~/components/ui/progress';
import { P } from '~/components/ui/typography';
import { Text } from '~/components/ui/text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Ellipsis, Volume2, X } from '~/lib/icons';
import { Word } from '~/types';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogCancel, AlertDialogTrigger, AlertDialogDescription, AlertDialogTitle, AlertDialogHeader, AlertDialogFooter } from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import { useColorScheme } from '~/lib/useColorScheme';
import { updateUserWordProgress } from '~/apis/word';

type WordWithAudio = Word & {
    audio_us: string;
    audio_uk: string;
}

export default function MyPager() {
    const { isDarkColorScheme } = useColorScheme();
    const pagerRef = useRef<PagerView>(null);

    const [userId, setUserId] = useState(1);
    const [tab, setTab] = useState('释义')
    const [currentPage, setCurrentPage] = useState(0);
    const [words, setWords] = useState<WordWithAudio[]>([]);

    const handlePageSelected = (e: any) => {
        setCurrentPage(e.nativeEvent.position)
        setTab('释义')
    }

    const handleUpdateUserWordProgress = async (status: '0' | '1' | '2') => {
        const word = words[currentPage];

        await updateUserWordProgress({ userId: 1, wordId: word.id, status, nextReviewTime: '2025-01-04' });
        pagerRef.current?.setPage(currentPage + 1);
    }

    // 播放单词音频
    async function playSound(url: string) {
        const { sound } = await Audio.Sound.createAsync(
            {
                uri: url,
            }
        );

        try {
            await sound.playAsync();
        } catch (error) {
            ToastAndroid.show('播放失败,请稍后再试', ToastAndroid.SHORT);
        }
    }

    useFocusEffect(
        useCallback(() => {
            getDailyWords().then(wordList => {
                setWords(wordList.map(word => ({
                    ...word,
                    audio_us: audioUrl(0, word.cet4_word),
                    audio_uk: audioUrl(1, word.cet4_word)
                })));
            });
        }, [])
    );

    return (
        <AlertDialog>
            <View style={styles.container} className='p-4 pt-12 bg-[#FFFCF7] dark:bg-black'>
                <View className='flex flex-row items-center'>
                    <AlertDialogTrigger asChild>
                        <IconButton icon={<X size={24} color={isDarkColorScheme ? 'grey' : 'black'} />} />
                    </AlertDialogTrigger>

                    <Progress className='h-2 flex-1 my-1' value={(currentPage + 1) / words.length * 100} />
                    <View className='ml-2'>
                        <Text>{currentPage + 1}/{words.length}</Text>
                    </View>
                </View>
                <PagerView ref={pagerRef} style={styles.container} initialPage={currentPage} onPageSelected={handlePageSelected}>
                    {
                        words.length > 0 && words.map((word, index) => {
                            return (
                                <View className='w-full h-full flex-col items-center' key={index}>

                                    <P className={(word.cet4_word.length >= 10 ? 'text-6xl' : 'text-7xl') + ' font-bold text-center mt-10'}>{word.cet4_word}</P>

                                    <View className='py-8'>
                                        <View className='flex flex-row justify-center items-center w-96'>
                                            <P className='text-center'>{word.cet4_phonetic.split('美')[0]}</P>
                                            <IconButton style={{ marginLeft: 8 }} icon={<Volume2 size={24} color={isDarkColorScheme ? 'grey' : 'black'} onPress={() => playSound(word.audio_uk)} />} />
                                        </View>
                                        <View className='flex flex-row justify-center items-center w-96'>
                                            <P className='text-center'>美{word.cet4_phonetic.split('美')[1]}</P>
                                            <IconButton style={{ marginLeft: 8 }} icon={<Volume2 size={24} color={isDarkColorScheme ? 'grey' : 'black'} />} onPress={() => playSound(word.audio_us)} />
                                        </View>
                                    </View>

                                    <Tabs value={tab} onValueChange={setTab} >
                                        <TabsList className='flex-row w-full'>
                                            <TabsTrigger value='释义' className='flex-1'>
                                                <Text>释义</Text>
                                            </TabsTrigger>
                                            <TabsTrigger value='例句' className='flex-1'>
                                                <Text>例句</Text>
                                            </TabsTrigger>
                                            <TabsTrigger value='短语' className='flex-1'>
                                                <Text>短语</Text>
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="释义" className='p-4' style={{ height: '68%' }}>
                                            <P>
                                                {word.cet4_translate}
                                            </P>
                                        </TabsContent>
                                        <TabsContent value="例句" style={{ height: '68%' }}>
                                            <ScrollView style={{ padding: 8, paddingRight: 4 }}>
                                                <P>
                                                    {word.cet4_samples}
                                                </P>
                                            </ScrollView>
                                        </TabsContent>
                                        <TabsContent value="短语" className='p-4' style={{ height: '68%' }}>
                                            <ScrollView style={{ padding: 8, paddingRight: 4 }}>
                                                <P>
                                                    {word.cet4_phrase}
                                                </P>
                                            </ScrollView>
                                        </TabsContent>
                                    </Tabs>


                                </View>
                            )
                        })
                    }
                </PagerView>

                <View className='absolute bottom-4 left-0 px-4 flex flex-row justify-between w-full gap-2'>
                    <Button variant='outline' className='flex-1' onPress={() => handleUpdateUserWordProgress('0')}>
                        <Text>
                            遗忘
                        </Text>
                    </Button>
                    <Button variant='outline' className='flex-1' onPress={() => handleUpdateUserWordProgress('1')}>
                        <Text>
                            熟悉
                        </Text>
                    </Button>
                    <Button variant='outline' className='flex-1' onPress={() => handleUpdateUserWordProgress('2')}>
                        <Text>
                            已学会
                        </Text>
                    </Button>
                    <IconButton variant='outline' icon={<Ellipsis size={24} color={isDarkColorScheme ? 'grey' : 'black'} />} />
                </View>

                <AlertDialogContent className='w-2/3'>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确定要放弃吗？</AlertDialogTitle>
                        <AlertDialogDescription>
                            太可惜了~
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onPress={() => router.back()}>
                            <Text>放弃</Text>
                        </AlertDialogCancel>
                        <AlertDialogAction>
                            <Text>继续</Text>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </View>
        </AlertDialog>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
});
