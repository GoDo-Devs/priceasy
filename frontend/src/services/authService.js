import useHttp from "./useHttp";

const authService = {
    login(data) {
        return useHttp.post('/auth/login', data);
    },

    me() {
        return useHttp.get('/auth/checkuser');
    }
}

export default authService;