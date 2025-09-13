import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useHttp from "@/services/useHttp";
import TextInput from "@/components/Form/TextInput.jsx";

export default function SelectUserModal({
  open,
  onClose,
  selectedUserIds,
  setSelectedUserIds,
}) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      useHttp
        .get("/users")
        .then((res) => setUsers(res.data.users || []))
        .catch(() => setUsers([]));
    }
  }, [open]);

  const toggleUser = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (filteredUsers.every((user) => selectedUserIds.includes(user.id))) {
      setSelectedUserIds((prev) =>
        prev.filter((id) => !filteredUsers.some((user) => user.id === id))
      );
    } else {
      const newIds = filteredUsers
        .filter((user) => !selectedUserIds.includes(user.id))
        .map((user) => user.id);
      setSelectedUserIds((prev) => [...prev, ...newIds]);
    }
  };

  const isAllSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((user) => selectedUserIds.includes(user.id));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            textAlign: "justify",
            width: "450px",
            maxWidth: "100%",
            borderRadius: 8,
            p: 2,
          },
        },
      }}
    >
      <DialogContent>
        <Typography variant="h5" mb={3} align="center" gutterBottom>
          Selecionar Usuários
        </Typography>
        <TextInput
          label="Buscar usuário"
          className="mb-2"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={isAllSelected}
              onChange={toggleSelectAll}
              color="primary"
            />
          }
          label={isAllSelected ? "Desmarcar todos" : "Selecionar todos"}
        />
        {filteredUsers.map((user) => (
          <Box key={user.id}>
            <FormControlLabel
              control={
                <Switch
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                />
              }
              label={user.name}
            />
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
