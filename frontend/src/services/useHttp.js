import axios from 'axios'
import { redirect } from 'react-router';


const useHttp = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('access-token')}`
    }
});

useHttp.interceptors.response.use(
    function (response) {
        if (response.data.token) {
            localStorage.setItem('access-toke', response.data.token);
        }

        return response;
    },
    function (error) {
        if (error.status === 401) {
            localStorage.removeItem('access-token');
            redirect('/auth/login');
        }
        return Promise.reject(error);
    }
);

export default useHttp