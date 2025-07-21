import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  InputLabel,
  Typography,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import TextInput from "@/components/Form/TextInput.jsx";
import DateInput from "@/components/Form/DateInput.jsx";
import CurrencyInput from "@/components/Form/CurrencyInput.jsx";
import useHttp from "@/services/useHttp.js";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";

function CouponModal({ open, onClose, coupon, setCoupon, setCoupons }) {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    if (coupon && open) {
      if (coupon.validity && typeof coupon.validity === "string") {
        setCoupon((prev) => ({
          ...prev,
          validity: dayjs(prev.validity),
        }));
      }

      useHttp
        .get("/users")
        .then((response) => {
          setUsers(response.data.users || []);
        })
        .catch(() => setUsers([]));

      if (coupon.id) {
        useHttp
          .get(`/user-coupons/${coupon.id}`)
          .then((res) => {
            setSelectedUserIds(res.data || []);
          })
          .catch(() => setSelectedUserIds([]));
      } else {
        setSelectedUserIds([]);
      }
    }
  }, [coupon, open]);

  const toggleUser = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  useEffect(() => {
    if (!open) {
      setSelectedUserIds([]);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...coupon,
        validity: coupon.validity ? coupon.validity.toISOString() : null,
        users_ids: selectedUserIds,
      };

      if (coupon.id) {
        await useHttp.patch(`/coupons/${coupon.id}`, payload);
        const updatedCoupon = { ...payload, id: coupon.id };
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? updatedCoupon : c))
        );

        console.log("Cupom atualizado:", updatedCoupon);
      } else {
        await useHttp.post("/coupons/create/", payload);
        setCoupons((prev) => [...prev, payload]);
      }
      onClose();
    } catch (error) {
      console.error("Erro ao salvar o cupom:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slots={{ paper: Paper }}
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
          {coupon.id ? "Editar Cupom" : "Criar Cupom"}
        </Typography>
        <TextInput
          label="Nome do Cupom"
          name="name"
          className="mb-5"
          value={coupon.name || ""}
          onChange={(e) => setCoupon({ ...coupon, name: e.target.value })}
          required
        ></TextInput>
        <DateInput
          label="Selecionar Validade"
          value={coupon.validity || null}
          onChange={(newValue) => setCoupon({ ...coupon, validity: newValue })}
          required
        />
      </DialogContent>
      <Box mb={2}>
        <InputLabel sx={{ marginLeft: "22px" }} className="text-white mb-1">
          Porcentagem de Desconto
        </InputLabel>
        <CurrencyInput
          value={coupon.discountPercentage}
          onChange={(value) =>
            setCoupon({ ...coupon, discountPercentage: value })
          }
          padding={"0px 22px"}
          prefix=""
          suffix="%"
        />
      </Box>
      <Box sx={{ padding: "0px 22px" }}>
        <InputLabel className="text-white mb-1">Selecionar Usuários</InputLabel>
        {users.map((user) => (
          <Box key={user.id} display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                  color="primary"
                />
              }
              label={user.name}
              sx={{
                display: "block",
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.9rem",
                },
              }}
            />
          </Box>
        ))}
      </Box>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          disabled={!coupon.name}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CouponModal;
