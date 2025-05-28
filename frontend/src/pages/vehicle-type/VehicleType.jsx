import { useContext, useState } from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsVehicleType } from "@/hooks/useColumnsVehicleType.js";
import VehicleTypeModal from "@/components/Modal/VehicleTypeModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";

function VehicleType() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, vehiclesType, handleDelete } = useColumnsVehicleType();
  const [openModal, setOpenModal] = useState(false);
  const [vehicleType, setVehicleType] = useState({});
  const width = 64;

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
        width={width}
      />
      <Tooltip title="Criar Tipo de Veículo">
        <Fab
          color="primary"
          aria-label="Criar Tipo de Veículo"
          onClick={() => setOpenModal(true)}
          sx={{
            position: "fixed",
            bottom: 40,
            right: 24,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <VehicleTypeModal
        open={openModal}
        vehicleType={vehicleType}
        setVehicleType={setVehicleType}
        onClose={() => {
          setOpenModal(false);
          setVehicleType({});
        }}
      />
    </Box>
  );
}

export default VehicleType;
