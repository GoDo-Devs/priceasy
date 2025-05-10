/* eslint-disable react-refresh/only-export-components */
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
      const { data } =  await authService.me();
      afterConfirmLogin(data);
      return true
    } catch (e) {
      console.log(e)
    }
  }

  async function handleLogin(loginFields) {
    try {
      const { data } = await authService.login(loginFields);
      afterConfirmLogin(data)
      return true
    } catch (e) {
      console.log(e);

      return false;
    }
  }

  function afterConfirmLogin(data) {
    setIsLogged(true);
    setUser(data.user);
  }

  function handleLogout() {
    setIsLogged(false);
    setUser({});
    localStorage.clear('access-token');
    navigate('/auth/login')
    setUser({});
  }

  useEffect(() => {
    if (!isLogged) {
      getUserInfo();
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        setIsLogged,
        getUserInfo,
        user,
        setUser,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
