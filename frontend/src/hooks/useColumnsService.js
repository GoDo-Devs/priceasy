import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp.js";
import { useSnackbar } from "@/contexts/snackbarContext.jsx";

export function useColumnsService() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = () => {
    useHttp.get("/services").then((res) => {
      setServices(res.data.services || []);
    });
  };

  const fetchCategories = () => {
    useHttp.get("/categories").then((res) => {
      setCategories(res.data.categories || []);
    });
  };

  const filteredCoverage = services.filter((item) => item.category_id === 1);
  const filteredAssistance = services.filter((item) => item.category_id === 2);

  const handleDelete = async (service) => {
    try {
      const res = await useHttp.delete(`/services/${service.id}`);
      setServices((prev) => prev.filter((p) => p.id !== service.id));
      showSnackbar(
        res.data.message,
        "success"
      );
    } catch (error) {
      const msg = error.response?.data?.message;
      console.error("Erro ao deletar serviço:", error);
      showSnackbar(msg, "error");
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Nome",
      size: 90,
    },
    {
      accessorKey: "category_id",
      header: "Categoria de Serviços",
      size: 10,
      Cell: ({ cell }) => {
        const category = categories.find((c) => c.id === cell.getValue());
        return category ? category.name : "Nenhum";
      },
    },
  ];

  return {
    columns,
    filteredCoverage,
    filteredAssistance,
    services,
    setServices,
    handleDelete,
  };
}
