import { useContext, useState } from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsImplement } from "@/hooks/useColumnsImplement.js";
import ImplementModal from "@/components/Modal/ImplementModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";
import ButtonFab from "../../components/Fab/ButtonFab";

function Implement() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, implementsList, handleDelete } = useColumnsImplement();
  const [openModal, setOpenModal] = useState(false);
  const [implement, setImplement] = useState({name: ""});

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
        data={implementsList}
        handleDelete={handleDelete}
      />
      <ButtonFab
        title={"Criar Implemento"}
        onClick={() => setOpenModal(true)}
        Icon={AddIcon}
      />
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
