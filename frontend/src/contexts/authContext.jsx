import { createContext, useEffect, useState } from "react";
import authService from "@/services/authService";
import { useNavigate } from "react-router";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  async function getUserInfo() {
    try {
      const { data } = await authService.me();
      afterConfirmLogin(data);
      return true;
    } catch (e) {
      console.log(e);
    }
  }

  async function updateUser(id, data) {
    return await authService.update(id, data);
  }

  async function handleLogin(loginFields) {
    const response = await authService.login(loginFields);
    afterConfirmLogin(response.data);

    return response;
  }

  async function handleRegister(registerFields) {
    const response = await authService.register(registerFields);

    return response;
  }

  function afterConfirmLogin(data) {
    setIsLogged(true);
    setUser(data.user);
  }

  function handleLogout() {
    setIsLogged(false);
    setUser({});
    localStorage.clear("access-token");
    navigate("/auth/login");
    setUser({});
  }

  useEffect(() => {
    if (!isLogged) {
      getUserInfo();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        setIsLogged,
        getUserInfo,
        user,
        setUser,
        handleLogin,
        handleRegister,
        handleLogout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
