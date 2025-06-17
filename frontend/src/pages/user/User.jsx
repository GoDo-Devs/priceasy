import { useState } from "react";
import { Box, Button, Dialog, Stack, Paper } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useColumnsUser } from "@/hooks/useColumnsUser.js";
import DataTable from "@/components/Table/DataTable.jsx";
import Register from "../auth/Register";
import PageTitle from "../../components/PageTitle/PageTitle";

function User() {
  const [openModal, setOpenModal] = useState(false);
  const { columns, users, handleDelete } = useColumnsUser();
  const [user, setUser] = useState({});

  const handleEdit = (id) => {
    const userId = users.find((p) => p.id === id);
    if (!userId) return;

    setUser(userId);
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
        enableEdit={true}
        handleEdit={handleEdit}
      />
      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setUser({});
        }}
        slots={{ paper: Paper }}
        slotProps={{
          paper: {
            sx: {
              width: "450px",
              textAlign: "justify",
              maxWidth: "36%",
              borderRadius: 8,
              p: 2,
            },
          },
        }}
      >
        <Register
          open={openModal}
          user={user}
          setUser={setUser}
          onCreate={() => setOpenModal(false)}
        />
      </Dialog>
    </Box>
  );
}

export default User;
