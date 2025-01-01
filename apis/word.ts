import { useAxios } from "~/hooks/useAxios";
import { Word } from "~/types";

const axios = useAxios();

/**
 * 获取每日单词 
 * @param id 用户id
 * @returns 单词列表
 */
export const getDailyWords = async (id: number = 1): Promise<Word[]> => {
    return await axios.get('/word/cet4/daily', { params: { id } });
}

export const getAllWords = async (id: number = 1): Promise<ALLWord[]> => {
    return await axios.get('/word/cet4/all', { params: { id } })
}

/**
 * 更新用户单词进度
 * @param data 
 * @returns 
 */
export const updateUserWordProgress = async (data: UpdateUserWordProgressPayload) => {
    return await axios.patch('/progress', data)
}

/**
 * 获取用户单词进度
 * @param id 用户id
 * @returns 单词进度
 */
export const getUserWordProgress = async (id: number = 1): Promise<{ learned: number, familiar: number, forgotten: number }> => {
    return await axios.get('/progress/cet4/learned', { params: { id } });
}


export interface UpdateUserWordProgressPayload {
    userId: number;
    wordId: number;
    status: '0' | '1' | '2'; // 0: 遗忘; 1: 熟悉; 2: 已学会
    nextReviewTime: string;
}

export interface ALLWord {
    id: number,
    cet4_word: string,
    cet4_translate: string,
    letter: string
    status: '-1' | '0' | '1' | '2'
}
