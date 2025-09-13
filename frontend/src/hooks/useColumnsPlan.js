import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp.js";
import { useSnackbar } from "@/contexts/snackbarContext.jsx";

export function useColumnsPlan() {
  const [plans, setPlans] = useState([]);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = () => {
    useHttp.get("/plans").then((res) => {
      setPlans((res.data.plans || []).sort((a, b) => a.id - b.id));
    });
  };

  const handleDelete = async (plan) => {
    try {
      const res = await useHttp.delete(`/plans/${plan.id}`);
      setPlans((prev) => prev.filter((p) => p.id !== plan.id));
      showSnackbar(
        res.data.message || "Plano removido com sucesso!",
        "success"
      );
    } catch (error) {
      const msg = error.response?.data?.message;
      showSnackbar(msg, "error");
      console.error("Erro ao deletar plano:", err);
    }
  };

  const columns = [
    { accessorKey: "id", header: "Código", size: 20 },
    { accessorKey: "name", header: "Nome", size: 180 },
  ];

  return { columns, plans, setPlans, handleDelete };
}
