import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp";

export function useColumnsUser() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    useHttp.get("/users").then((response) => {
      setUsers(response.data.users || []);
    });
  };

  const handleDelete = (user) => {
    useHttp.delete(`/users/${user.id}`).then(() => {
      setProducts((prev) => prev.filter((p) => p.id !== user.id));
    });
  };

  const columns = [
    { accessorKey: "name", header: "Nome" },
    {
      accessorKey: "email",
      header: "E-mail",
    },
    {
      accessorKey: "is_admin",
      header: "Administrador",
      Cell: ({ cell }) => (cell.getValue() ? "Sim" : "Não"),
    },
  ];

  return { columns, users, handleDelete };
}
