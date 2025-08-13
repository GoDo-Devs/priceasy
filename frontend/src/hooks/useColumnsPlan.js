import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp.js";

export function useColumnsPlan() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = () => {
    useHttp.get("/plans").then((res) => {
      setPlans((res.data.plans || []).sort((a, b) => a.id - b.id));
    });
  };

  const handleDelete = (plan) => {
    useHttp
      .delete(`/plans/${plan.id}`)
      .then(() => {
        setPlans((prev) => prev.filter((p) => p.id !== plan.id));
      })
      .catch((err) => {
        console.error("Erro ao deletar plano:", err);
        setPlans([]);
      });
  };

  const columns = [
    { accessorKey: "id", header: "Código", size: 20 },
    { accessorKey: "name", header: "Nome", size: 180 },
  ];

  return { columns, plans, setPlans, handleDelete };
}
