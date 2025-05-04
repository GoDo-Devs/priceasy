import useHttp from "./useHttp.js";

const authService = {
  login(data) {
    return useHttp.post("/auth/login", data);
  },

  me() {
    return useHttp.get("/auth/checkuser");
  },

  register(data) {
    return useHttp.post("/auth/register", data);
  },
};

export default authService;
