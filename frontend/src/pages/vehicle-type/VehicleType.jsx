import { useContext, useState } from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsVehicleType } from "@/hooks/useColumnsVehicleType.js";
import VehicleTypeModal from "@/components/Modal/VehicleTypeModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";
import ButtonFab from "../../components/Fab/ButtonFab";

function VehicleType() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, vehiclesType, handleDelete } = useColumnsVehicleType();
  const [openModal, setOpenModal] = useState(false);
  const [vehicleType, setVehicleType] = useState({});

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
        data={vehiclesType}
        handleDelete={handleDelete}
      />
      <ButtonFab
        title={"Criar Tipo de Veículo"}
        onClick={() => setOpenModal(true)}
        Icon={AddIcon}
      />
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
