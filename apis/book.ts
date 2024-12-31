import { useAxios } from "~/hooks/useAxios";
import { Book } from "~/types";

const axios = useAxios();

/**
 * 获取题本列表
 * @param difficulty 难度
 * @returns 
 */
export const getBooksByDifficulty = async (difficulty?: string): Promise<Book[]> => {
    return await axios.get('/book/difficulty', { params: { difficulty: difficulty === '全部' ? undefined : difficulty } });
};


/**
 * 获取题本详情
 * @param bookId 题本id
 * @returns 
 */
export const getBookById = async (bookId: string): Promise<Book> => {
    return await axios.get(`/book/${bookId}`);
};
