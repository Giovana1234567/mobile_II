
import axios from 'axios';

export const apiDummyJson = axios.create({
    baseURL: 'https://dummyjson.com'
})

apiDummyJson.interceptors.request.use((request) => {
    console.log('Interceptando requisição!');
    console.log(request.url);
    console.log('---------------------------');
    
    return request;
})