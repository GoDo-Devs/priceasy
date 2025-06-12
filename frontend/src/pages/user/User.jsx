import { useContext, useState } from "react";
import { Box, Button, Dialog, Fab, Stack, Tooltip } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsUser } from "@/hooks/useColumnsUser.js";
import { useNavigate } from "react-router";
import DataTable from "@/components/Table/DataTable.jsx";
import Register from "../auth/Register";
import PageTitle from "../../components/PageTitle/PageTitle";

function User() {
  const [openModal, setOpenModal] = useState(false);
  const { columns, users, handleDelete } = useColumnsUser();

  return (
    <Box padding={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <PageTitle title="Usuários" />
        <Button
          onClick={() => {
            setOpenModal(true);
          }}
          variant="contained"
          color="primary"
          size="small"
        >
          Criar Usuário
          <PersonAddIcon sx={{ ml: 1 }} />
        </Button>
      </Stack>

      <DataTable
        columns={columns}
        data={users}
        handleDelete={handleDelete}
      />

      <Dialog  open={openModal} onClose={() => setOpenModal(false)}>
        <Register onCreate={() => setOpenModal(false) } />
      </Dialog>
    </Box>
  );
}

export default User;
