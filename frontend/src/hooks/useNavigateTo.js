import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { guardedAuthenticatedRoutes } from "../router/routes";
import { AuthContext } from "../contexts/authContext";

function getAllPathGuards(path, routes, parentGuards = []) {
  const selectRoute = routes.filter((route) => route.path === path)[0];

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
          ...route.guard,
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
    console.log("aquo");
    const guards = getAllPathGuards(path, guardedAuthenticatedRoutes);

    for (const guard of guards) {
      const result = await guard(path, user);

      if (typeof result === "string") {
        navigate(result);
        return;
      }
    }

    console.log("saída");
    return true;
  }

  async function redirect(path) {
    if (runGuards(path)) {
      navigate(path);
    }
  }

  return {
    redirect,
    runGuards,
  };
}

export default useNavigateTo;
