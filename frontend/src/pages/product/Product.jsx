import { useContext, useState } from "react";
import { Box } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsProduct } from "@/hooks/useColumnsProduct.js";
import ProductModal from "@/components/Modal/ProductModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";
import ButtonFab from "../../components/Fab/ButtonFab";

function Product() {
  const { drawerWidth } = useContext(LayoutContext);
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
        width: drawerWidth === 0 ? "99vw" : `calc(99vw - ${drawerWidth}px)`,
        transition: "width 0.1s ease",
        padding: "30px",
      }}
    >
      <DataTable
        columns={columns}
        data={products}
        handleDelete={handleDelete}
        enableEdit={true}
        handleEdit={handleEdit}
      />
      <ButtonFab
        title={"Criar Produto"}
        onClick={handleCreate}
        Icon={AddShoppingCartIcon}
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
