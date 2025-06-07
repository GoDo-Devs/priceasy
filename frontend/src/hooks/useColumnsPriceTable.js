import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp.js";

export function useColumnsPriceTable() {
  const [priceTables, setPriceTables] = useState([]);

  useEffect(() => {
    fetchPriceTables();
  }, []);

  const fetchPriceTables = () => {
    useHttp.get("/price-tables").then((res) => {
      setPriceTables(res.data.priceTables || []);
    });
  };

  const handleDelete = (priceTable) => {
    useHttp
      .delete(`/price-tables/${priceTable.id}`)
      .then(() => {
        setPriceTables((prev) => prev.filter((p) => p.id !== priceTable.id));
      })
      .catch((err) => {
        console.error("Erro ao deletar Tabela de Preço:", err);
      });
  };

  const columns = [{ accessorKey: "name", header: "Nome" }];

  return { columns, priceTables, setPriceTables, handleDelete };
}