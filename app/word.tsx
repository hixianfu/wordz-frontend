import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import { getDailyWords } from '~/apis/word';
import { IconButton } from '~/components/ui/IconButton';
import { Progress } from '~/components/ui/progress';
import { P } from '~/components/ui/typography';
import { Text } from '~/components/ui/text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Volume2, X } from '~/lib/icons';
import { Word } from '~/types';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogCancel, AlertDialogTrigger, AlertDialogDescription, AlertDialogTitle, AlertDialogHeader, AlertDialogFooter } from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import { useColorScheme } from '~/lib/useColorScheme';
import { router } from 'expo-router';

export default function MyPager() {
    const [tab, setTab] = useState('释义')
    const [words, setWords] = useState<Word[]>([]);

    const { isDarkColorScheme } = useColorScheme();

    const handlePageSelected = () => {
        setTab('释义')
    }

    useEffect(() => {
        getDailyWords().then(response => {
            setWords(response);
        });
    }, []);

    return (
        <AlertDialog>
            <View style={styles.container} className='p-4 pt-12 bg-[#FFFCF7] dark:bg-black'>
                <PagerView style={styles.container} initialPage={0} onPageSelected={handlePageSelected}>

                    {
                        words.map((word, index) => {
                            return (
                                <View className='w-full h-full flex-col items-center' key={index}>
                                    <View className='flex flex-row items-center'>
                                        <AlertDialogTrigger asChild>
                                            <IconButton icon={<X size={24} color={isDarkColorScheme ? 'grey' : 'black'} />} />
                                        </AlertDialogTrigger>

                                        <Progress className='h-2 flex-1 my-1' value={0.5} />
                                        <View className='ml-2'> 
                                            <Text>1/10</Text>
                                        </View>
                                    </View>
                                    <P className={(word.cet4_word.length >= 14 ? 'text-5xl' : 'text-7xl') + ' font-bold text-center mt-10'}>{word.cet4_word}</P>

                                    <View className='py-8'>
                                        <View className='flex flex-row justify-center items-center w-96'>
                                            <P className='text-center'>{word.cet4_phonetic.split('美')[0]}</P>
                                            <IconButton style={{ marginLeft: 8 }} icon={<Volume2 size={24} color={isDarkColorScheme ? 'grey' : 'black'} />} />
                                        </View>
                                        <View className='flex flex-row justify-center items-center w-96'>
                                            <P className='text-center'>美{word.cet4_phonetic.split('美')[1]}</P>
                                            <IconButton style={{ marginLeft: 8 }} icon={<Volume2 size={24} color={isDarkColorScheme ? 'grey' : 'black'} />} />
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
                                        <TabsContent value="释义" className='p-4'>
                                            <P>
                                                {word.cet4_translate}
                                            </P>
                                        </TabsContent>
                                        <TabsContent value="例句" style={{ height: '70%' }}>
                                            <ScrollView style={{ padding: 8, paddingRight: 4 }}>
                                                <P>
                                                    {word.cet4_samples}
                                                </P>
                                            </ScrollView>
                                        </TabsContent>
                                        <TabsContent value="短语" className='p-4'>
                                            <P>
                                                {word.cet4_phrase}
                                            </P>
                                        </TabsContent>
                                    </Tabs>
                                </View>
                            )
                        })
                    }
                </PagerView>


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
