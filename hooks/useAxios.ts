import axios from 'axios';

export const useAxios = () => {
    const instance = axios.create({
        baseURL: 'http://192.168.0.101:3333',
    });

    instance.interceptors.response.use((response) => {
        return response.data;
    });

    return instance;
};

