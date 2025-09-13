import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp.js";
import { useSnackbar } from "@/contexts/snackbarContext.jsx";

export function useColumnsCoupons() {
  const [coupons, setCoupons] = useState([]);
  const showSnackbar = useSnackbar();

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleDateString("pt-BR");
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = () => {
    useHttp.get("/coupons").then((res) => {
      setCoupons(res.data.coupons || []);
    });
  };

  const handleDelete = async (coupon) => {
    try {
      const res = await useHttp.delete(`/coupons/${coupon.id}`);
      setCoupons((prev) => prev.filter((p) => p.id !== coupon.id));
      showSnackbar(res.data.message, "success");
    } catch (error) {
      const msg = error.response?.data?.message;
      showSnackbar(msg, "error");
      console.error("Erro ao deletar cupom:", error);
    }
  };

  const columns = [
    { accessorKey: "name", header: "Nome", size: 50 },
    {
      accessorKey: "discountPercentage",
      header: "Porcentagem de Desconto",
      size: 50,
      Cell: ({ cell }) => `${cell.getValue()}%`,
    },
    {
      accessorKey: "target",
      header: "Aplicação do Desconto",
      size: 50,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        const targetMap = {
          installationPrice: "Rastreador",
          accession: "Adesão",
          monthlyFee: "Mensalidade",
        };
        return targetMap[value] || value;
      },
    },
    {
      accessorKey: "is_active",
      header: "Situação",
      size: 50,
      Cell: ({ cell }) => (cell.getValue() ? "Ativo" : "Inativo"),
    },
  ];

  return { columns, coupons, setCoupons, handleDelete };
}
