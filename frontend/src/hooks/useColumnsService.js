import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp.js";

export function useColumnsService() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

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

  const handleDelete = (service) => {
    useHttp
      .delete(`/services/${service.id}`)
      .then(() => {
        setServices((prev) => prev.filter((p) => p.id !== service.id));
      })
      .catch((err) => {
        console.error("Erro ao deletar serviço:", err);
      });
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
    handleDelete,
  };
}
