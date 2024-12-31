import { useAxios } from "~/hooks/useAxios";
import { Level } from "~/types";

const axios = useAxios()

export const getLevelsByBookId = (bookId: string): Promise<Level[]> => {
    return axios.get(`/level/book/${bookId}`)
}
