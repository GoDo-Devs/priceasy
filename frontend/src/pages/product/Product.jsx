import { useContext, useState } from "react";
import { Box, Fab } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsProduct } from "@/hooks/useColumnsProduct.js";
import ProductModal from "@/components/Modal/ProductModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";

function Product() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, products, handleDelete } = useColumnsProduct();
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

  return (
    <Box
      sx={{
        width: drawerWidth === 0 ? "100vw" : `calc(100vw - ${drawerWidth}px)`,
        transition: "width 0.1s ease",
      }}
    >
      <DataTable
        columns={columns}
        data={products}
        handleDelete={handleDelete}
      />
      <Fab
        color="primary"
        aria-label="Criar Produto"
        onClick={() => setOpenModal(true)}
        sx={{
          position: "fixed",
          bottom: 40,
          right: 24,
          zIndex: 1000,
        }}
      >
        <AddShoppingCartIcon />
      </Fab>
      <ProductModal
        open={openModal}
        product={product}
        setProduct={setProduct}
        showNewGroupInput={showNewGroupInput}
        handleGroupChange={handleGroupChange}
        onClose={() => {
          setOpenModal(false);
          setProduct({});
        }}
      />
    </Box>
  );
}

export default Product;
