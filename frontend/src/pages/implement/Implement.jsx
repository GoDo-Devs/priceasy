import { useContext, useState } from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsImplement } from "@/hooks/useColumnsImplement.js";
import ImplementModal from "@/components/Modal/ImplementModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";

function Implement() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, implementsList, handleDelete } = useColumnsImplement();
  const [openModal, setOpenModal] = useState(false);
  const [implement, setImplement] = useState({});
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
        data={implementsList}
        handleDelete={handleDelete}
        width={width}
      />
      <Tooltip title="Criar Implemento">
        <Fab
          color="primary"
          aria-label="Criar Implemento"
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
      <ImplementModal
        open={openModal}
        implement={implement}
        setImplement={setImplement}
        onClose={() => {
          setOpenModal(false);
          setImplement({});
        }}
      />
    </Box>
  );
}

export default Implement;
