import axios from 'axios';

export const useAxios = () => {
    const instance = axios.create({
        baseURL: 'http://106.52.244.92:3333',
    });

    instance.interceptors.response.use((response) => {
        return response.data;
    });

    return instance;
};

