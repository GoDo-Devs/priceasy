import { useContext, useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import useHttp from "../../services/useHttp";
import { Box } from "@mui/material";
import { LayoutContext } from "../../contexts/layoutContext";

function Product() {
  const { drawerWidth } = useContext(LayoutContext);
  const [products, setProducts] = useState([]);
  const [productGroups, setProductGroups] = useState([]);

  useEffect(() => {
    useHttp.get("/products").then((response) => {
      setProducts(response.data.products || []);
    });
  }, []);

  useEffect(() => {
    useHttp.get("/product-groups").then((response) => {
      setProductGroups(response.data.productsGroups || []);
    });
  }, []);

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

  return (
    <Box
      sx={{
        width: drawerWidth === 0 ? "100vw" : `calc(100vw - ${drawerWidth}px)`,
        transition: "width 0.1s ease",
      }}
    >
      <MaterialReactTable
        columns={columns}
        data={products}
        enableFullScreenToggle={false}
        muiTableContainerProps={{
          sx: { height: "100%" },
        }}
        muiTableBodyProps={{
          sx: { height: "100%" },
        }}
      />
    </Box>
  );
}

export default Product;
