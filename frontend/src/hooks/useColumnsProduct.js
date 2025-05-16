import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp.js";

export function useColumnsProduct() {
  const [products, setProducts] = useState([]);
  const [productGroups, setProductGroups] = useState([]);

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

  const handleDelete = (product) => {
    useHttp
      .delete(`/products/${product.id}`)
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
      })
      .catch((err) => {
        console.error("Erro ao deletar produto:", err);
      });
  };

  const columns = [
    { accessorKey: "name", header: "Nome" },
    {
      accessorKey: "price",
      header: "Preço",
      Cell: ({ cell }) =>
        cell.getValue().toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
    },
    {
      accessorKey: "product_group_id",
      header: "Grupo de Produtos",
      Cell: ({ cell }) => {
        const group = productGroups.find((g) => g.id === cell.getValue());
        return group ? group.name : "Nenhum";
      },
    },
  ];

  return { columns, products, setProducts, handleDelete };
}
