import { useContext, useState } from "react";
import { Box, Button, Icon, Stack } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsProduct } from "@/hooks/useColumnsProduct.js";
import ProductModal from "@/components/Modal/ProductModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";
import ButtonFab from "@/components/Fab/ButtonFab";
import PageTitle from "../../components/PageTitle/PageTitle";

function Product() {
  const { columns, products, setProducts, handleDelete } = useColumnsProduct();

  const [openModal, setOpenModal] = useState(false);
  const [product, setProduct] = useState({});
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);

  const handleGroupChange = (e) => {
    const selected = e.target.value;
    if (selected === "new") {
      setShowNewGroupInput(true);
      setProduct({ ...product, product_group_id: null });
    } else {
      setShowNewGroupInput(false);
      setProduct({
        ...product,
        product_group_id: selected === "Nenhum" ? null : selected,
      });
    }
  };

  const handleEdit = (id) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    setProduct(prod);
    setShowNewGroupInput(false);
    setOpenModal(true);
  };

  const handleCreate = () => {
    setProduct({});
    setShowNewGroupInput(false);
    setOpenModal(true);
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding: 3,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <PageTitle title={"Produtos"} />
        <Button size="small" variant="contained" color="primary" onClick={handleCreate}>
          Criar Produto
          <AddShoppingCartIcon sx={{ ml: 1 }} />
        </Button>
      </Stack>

      <DataTable
        columns={columns}
        data={products}
        handleDelete={handleDelete}
        enableEdit={true}
        handleEdit={handleEdit}
      />

      <ProductModal
        open={openModal}
        product={product}
        setProduct={setProduct}
        setProducts={setProducts}
        showNewGroupInput={showNewGroupInput}
        handleGroupChange={handleGroupChange}
        onClose={() => {
          setOpenModal(false);
          setProduct({});
          setShowNewGroupInput(false);
        }}
      />
    </Box>
  );
}

export default Product;
