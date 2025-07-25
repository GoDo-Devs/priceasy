import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { guardedAuthenticatedRoutes } from "../router/routes";
import { AuthContext } from "../contexts/authContext";

function getAllPathGuards(path, routes, parentGuards = []) {
  const selectRoute = routes.find((route) => route.path === path);

  if (selectRoute) {
    const selectRouteGuards = selectRoute.guard ?? [];
    return [...parentGuards, ...selectRouteGuards];
  } else {
    let allGuards;

    routes.forEach((route) => {
      if (route.children) {
        const childPath = path.replace(route.path + "/" ?? "", "");

        allGuards = getAllPathGuards(childPath, route.children, [
          ...parentGuards,
          ...(route.guard ?? []),
        ]);
      }
    });

    return allGuards;
  }
}

function useNavigateTo() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  async function runGuards(path) {
    const guards = getAllPathGuards(path, guardedAuthenticatedRoutes);

    if (!Array.isArray(guards)) {
      console.warn("Guards inválidos para path:", path, guards);
      return true; 
    }

    for (const guard of guards) {
      const result = await guard(path, user);

      if (typeof result === "string") {
        navigate(result);
        return;
      }
    }

    return true;
  }

  async function redirect(path) {
    if (await runGuards(path)) {
      navigate(path);
    }
  }

  return {
    redirect,
    runGuards,
  };
}

export default useNavigateTo;
