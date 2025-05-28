import { useContext, useState } from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsPlan } from "@/hooks/useColumnsPlan.js";
import ProductModal from "@/components/Modal/ProductModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";

function Plan() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, plans, handleDelete } = useColumnsPlan();
  const [openModal, setOpenModal] = useState(false);
  const [plan, setPlan] = useState();
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
        data={plans}
        handleDelete={handleDelete}
        width={width}
      />
      <Tooltip title="Criar Plano">
        <Fab
          color="primary"
          aria-label="Criar Plano"
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
    </Box>
  );
}

export default Plan;
