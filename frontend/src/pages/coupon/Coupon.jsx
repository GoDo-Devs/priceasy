import { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useColumnsCoupons } from "@/hooks/useColumnsCoupons.js";
import CouponModal from "@/components/Modal/CouponModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";
import PageTitle from "../../components/PageTitle/PageTitle";

function Coupon() {
  const { columns, coupons, setCoupons, handleDelete } = useColumnsCoupons();
  const [openModal, setOpenModal] = useState(false);
  const [coupon, setCoupon] = useState({
    name: "",
    is_active: true,
    discountPercentage: "",
    target: "",
  });

  const handleEdit = (id) => {
    const cop = coupons.find((p) => p.id === id);
    if (!cop) return;

    setCoupon(cop);
    setOpenModal(true);
  };

  return (
    <Box padding={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <PageTitle title="Cupons" />
        <Button
          onClick={() => {
            setOpenModal(true);
          }}
          variant="contained"
          color="primary"
          size="small"
        >
          Adicionar Cupom
          <AddIcon sx={{ ml: 1 }} />
        </Button>
      </Stack>
      <DataTable
        columns={columns}
        data={coupons}
        handleDelete={handleDelete}
        enableEdit={true}
        handleEdit={handleEdit}
      />
      <CouponModal
        open={openModal}
        coupon={coupon}
        setCoupon={setCoupon}
        setCoupons={setCoupons}
        onClose={() => {
          setOpenModal(false);
          setCoupon({
            name: "",
            is_active: true,
            discountPercentage: "",
            target: "",
          });
        }}
      />
    </Box>
  );
}

export default Coupon;
