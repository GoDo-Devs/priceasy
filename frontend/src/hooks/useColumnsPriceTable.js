import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp.js";

export function useColumnsPriceTable() {
  const [implementsList, setImplementsList] = useState([]);

  useEffect(() => {
    fetchImplementsList();
  }, []);

  const fetchImplementsList = () => {
    useHttp.get("/implements").then((res) => {
      setImplementsList(res.data.implementsList || []);
    });
  };

  const handleDelete = (implement) => {
    useHttp
      .delete(`/implements/${implement.id}`)
      .then(() => {
        setImplementsList((prev) => prev.filter((p) => p.id !== implement.id));
      })
      .catch((err) => {
        console.error("Erro ao deletar implemento:", err);
      });
  };

  const columns = [{ accessorKey: "name", header: "Nome" }];

  return { columns, implementsList, setImplementsList, handleDelete };
}