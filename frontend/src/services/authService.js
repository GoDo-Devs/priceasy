import useHttp from "./useHttp.js";

const authService = {
  login(data) {
    return useHttp.post("/auth/login", data).then((res) => {
      const token = res.data.token;
      if (token) {
        localStorage.setItem("access-token", token);
      }
      return res;
    });
  },

  me() {
    return useHttp.get("/auth/checkuser");
  },

  register(data) {
    return useHttp.post("/auth/register", data);
  },

  update(token, data) {
    return useHttp.patch(`/auth/edit/${token}`, data);
  },
};

export default authService;
