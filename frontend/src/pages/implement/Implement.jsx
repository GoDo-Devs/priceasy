import { useContext, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsImplement } from "@/hooks/useColumnsImplement.js";
import ImplementModal from "@/components/Modal/ImplementModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";
import ButtonFab from "@/components/Fab/ButtonFab";
import PageTitle from "../../components/PageTitle/PageTitle";

function Implement() {
  const { columns, implementsList, setImplementsList, handleDelete } =
    useColumnsImplement();

  const [openModal, setOpenModal] = useState(false);
  const [implement, setImplement] = useState({ name: "" });

  return (
    <Box padding={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <PageTitle title="Implementos" />
        <Button
          onClick={() => {
            setOpenModal(true);
          }}
          variant="contained"
          color="primary"
          size="small"
        >
          Adicionar Implemento
          <AddIcon sx={{ ml: 1 }} />
        </Button>
      </Stack>

      <DataTable
        columns={columns}
        data={implementsList}
        handleDelete={handleDelete}
      />

      <ImplementModal
        open={openModal}
        implement={implement}
        setImplement={setImplement}
        setImplementsList={setImplementsList}
        onClose={() => {
          setOpenModal(false);
          setImplement({ name: "" });
        }}
      />
    </Box>
  );
}

export default Implement;
