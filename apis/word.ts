import { useAxios } from "~/hooks/useAxios";
import { Word } from "~/types";

const axios = useAxios();

export const getDailyWords = async (userId: string = '1'): Promise<Word[]> => {
    return await axios.get('/word/cet4/daily', { params: { userId } });
}
