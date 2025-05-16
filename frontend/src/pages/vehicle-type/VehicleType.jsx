import { useContext, useState } from "react";
import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsVehicleType } from "@/hooks/useColumnsVehicleType.js";
import VehicleTypeModal from "@/components/Modal/VehicleTypeModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";

function VehicleType() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, vehiclesType, handleDelete } = useColumnsVehicleType();
  const [openModal, setOpenModal] = useState(false);

  return (
    <Box
      sx={{
        width: drawerWidth === 0 ? "100vw" : `calc(100vw - ${drawerWidth}px)`,
        transition: "width 0.1s ease",
      }}
    >
      <DataTable
        columns={columns}
        data={vehiclesType}
        handleDelete={handleDelete}
      />
      <Fab
        color="primary"
        aria-label="Criar Usuário"
        onClick={() => setOpenModal(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>
      <VehicleTypeModal open={openModal} onClose={() => setOpenModal(false)} />
    </Box>
  );
}

export default VehicleType;
