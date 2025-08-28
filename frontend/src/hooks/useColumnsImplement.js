import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp.js";
import { useSnackbar } from "@/contexts/snackbarContext.jsx";

export function useColumnsImplement() {
  const [implementsList, setImplementsList] = useState([]);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    fetchImplementsList();
  }, []);

  const fetchImplementsList = () => {
    useHttp.get("/implements").then((res) => {
      setImplementsList(res.data.implementsList || []);
    });
  };

  const handleDelete = async (implement) => {
    try {
      const res = await useHttp.delete(`/implements/${implement.id}`);
      setImplementsList((prev) => prev.filter((p) => p.id !== implement.id));
      showSnackbar(res.data.message, "success");
    } catch (error) {
      const msg = error.response?.data?.message;
      showSnackbar(msg, "error");
      console.error("Erro ao deletar implemento:", error);
    }
  };

  const columns = [{ accessorKey: "name", header: "Nome" }];

  return { columns, implementsList, setImplementsList, handleDelete };
}
