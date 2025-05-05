/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import authService from "../services/authService";
import { redirect, useNavigate } from "react-router";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState({});

  function getUserInfo() {
    try {
      const { data } =  authService.me();
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

    if(data.token) {
      localStorage.setItem('access-token', data.token);
    }
  }

  function handleLogout() {
    setIsLogged(false);
    localStorage.clear('access-token');
    setUser({});
  }

  useEffect(() => {
    getUserInfo();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
