import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp";
import { useSnackbar } from "@/contexts/snackbarContext.jsx";

export function useColumnsUser() {
  const [users, setUsers] = useState([]);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    useHttp.get("/users").then((response) => {
      setUsers(response.data.users || []);
    });
  };

  const handleDelete = async (user) => {
    try {
      const res = await useHttp.delete(`/auth/${user.id}`);
      setUsers((prev) => prev.filter((p) => p.id !== user.id));
      showSnackbar(res.data.message, "success");
    } catch (error) {
      const msg = error.response?.data?.message;
      console.error("Erro ao deletar usuário:", error);
      showSnackbar(msg, "error");
    }
  };

  const columns = [
    { accessorKey: "name", header: "Nome", size: 60 },
    {
      accessorKey: "email",
      header: "E-mail",
      size: 70,
    },
    {
      accessorKey: "is_admin",
      header: "Administrador",
      size: 50,
      Cell: ({ cell }) => (cell.getValue() ? "Sim" : "Não"),
    },
  ];

  return { columns, users, handleDelete, fetchUser };
}
