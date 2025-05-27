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
    { accessorKey: "name", header: "Nome" },
    {
      accessorKey: "category_id",
      header: "Categoria de Serviços",
      Cell: ({ cell }) => {
        const category = categories.find((c) => c.id === cell.getValue());
        return category ? category.name : "Nenhum";
      },
    },
  ];

  return { columns, services, setServices, handleDelete };
}
