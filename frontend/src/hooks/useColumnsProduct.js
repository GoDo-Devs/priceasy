import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp.js";
import { useSnackbar } from "@/contexts/snackbarContext.jsx";

export function useColumnsProduct() {
  const [products, setProducts] = useState([]);
  const [productGroups, setProductGroups] = useState([]);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    fetchProducts();
    fetchProductGroups();
  }, []);

  const fetchProducts = () => {
    useHttp.get("/products").then((res) => {
      setProducts(res.data.products || []);
    });
  };

  const fetchProductGroups = () => {
    useHttp.get("/product-groups").then((res) => {
      setProductGroups(res.data.productsGroups || []);
    });
  };

  const handleDelete = async (product) => {
    try {
      const res = await useHttp.delete(`/products/${product.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      showSnackbar(res.data.message, "success");
    } catch (error) {
      const msg = error.response?.data?.message;
      console.error("Erro ao deletar produto:", error);
      showSnackbar(msg, "error");
    }
  };

  const columns = [
    { accessorKey: "name", header: "Nome", size: 60 },
    {
      accessorKey: "price",
      header: "Preço",
      size: 30,
      Cell: ({ cell }) =>
        cell.getValue().toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
    },
    {
      accessorKey: "product_group_id",
      header: "Grupo de Produtos",
      size: 30,
      Cell: ({ cell }) => {
        const group = productGroups.find((g) => g.id === cell.getValue());
        return group ? group.name : "Nenhum";
      },
    },
  ];

  return { columns, products, setProducts, handleDelete };
}
