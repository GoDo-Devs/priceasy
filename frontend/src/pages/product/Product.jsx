import { useContext, useState } from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsProduct } from "@/hooks/useColumnsProduct.js";
import ProductModal from "@/components/Modal/ProductModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";
import ButtonFab from "../../components/Fab/ButtonFab";

function Product() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, products, handleDelete } = useColumnsProduct();
  const [openModal, setOpenModal] = useState(false);
  const [product, setProduct] = useState({name: "", product_group_id: ""});
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
        width: drawerWidth === 0 ? "99vw" : `calc(99vw - ${drawerWidth}px)`,
        transition: "width 0.1s ease",
        padding: "30px"
      }}
    >
      <DataTable
        columns={columns}
        data={products}
        handleDelete={handleDelete}
      />
      <ButtonFab
        title={"Criar Produto"}
        onClick={() => setOpenModal(true)}
        Icon={AddShoppingCartIcon}
      />
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
