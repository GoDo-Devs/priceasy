import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  InputLabel,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Paper,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import TextInput from "@/components/Form/TextInput.jsx";
import CurrencyInput from "@/components/Form/CurrencyInput.jsx";
import SelectInput from "@/components/Form/SelectInput.jsx";
import SelectUsersModal from "@/components/Modal/SelectUsersModal.jsx";
import useHttp from "@/services/useHttp.js";
import { useSnackbar } from "@/contexts/snackbarContext.jsx";

const targetOptions = [
  { value: "accession", label: "Adesão" },
  { value: "monthlyFee", label: "Mensalidade" },
  { value: "installationPrice", label: "Rastreador" },
];

function CouponModal({ open, onClose, coupon, setCoupon, setCoupons }) {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectUsersModalOpen, setSelectUsersModalOpen] = useState(false);

  const showSnackbar = useSnackbar();

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        const resUsers = await useHttp.get("/users");
        setUsers(resUsers.data.users || []);
      } catch {
        setUsers([]);
      }

      if (coupon?.id) {
        try {
          const resUserCoupons = await useHttp.get(
            `/user-coupons/${coupon.id}`
          );
          setSelectedUserIds(resUserCoupons.data || []);
        } catch {
          setSelectedUserIds([]);
        }
      } else {
        setSelectedUserIds([]);
      }
    };

    fetchData();
  }, [coupon?.id, open]);

  useEffect(() => {
    if (!open) return;

    setCoupon((prev) => ({
      ...prev,
      is_active: prev?.is_active ?? true,
      target: prev?.target || "accession",
    }));
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSelectedUserIds([]);
    }
  }, [open]);

  const handleChange = useCallback(
    (field) => (e) => {
      const value = e?.target?.value ?? e;
      setCoupon((prev) => ({ ...prev, [field]: value }));
    },
    [setCoupon]
  );

  const handleCheckboxChange = (field) => (e) => {
    setCoupon((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...coupon,
      users_ids: selectedUserIds,
    };

    try {
      if (coupon?.id) {
        const res = await useHttp.patch(`/coupons/${coupon.id}`, payload);
        setCoupons((prev) =>
          prev.map((c) =>
            c.id === coupon.id ? { ...payload, id: coupon.id } : c
          )
        );

        showSnackbar(
          res.data.message || "Cupom atualizado com sucesso!",
          "success"
        );
      } else {
        const res = await useHttp.post("/coupons/create/", payload);
        setCoupons((prev) => [...prev, res.data]);
        showSnackbar(
          res.data.message || "Cupom criado com sucesso!",
          "success"
        );
      }

      onClose();
    } catch (error) {
      const msg = error.response?.data?.message;
      showSnackbar(msg, "error");
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
          {coupon?.id ? "Editar Cupom" : "Criar Cupom"}
        </Typography>
        <TextInput
          label="Nome do Cupom"
          name="name"
          className="mb-5"
          value={coupon.name || ""}
          onChange={handleChange("name")}
          required
        />
        <InputLabel className="text-white mb-1 mt-5">
          Porcentagem de Desconto
        </InputLabel>
        <CurrencyInput
          value={coupon.discountPercentage}
          onChange={handleChange("discountPercentage")}
          prefix=""
          suffix="%"
        />
        <SelectInput
          label="Aplicação de Desconto"
          name="target"
          className="mb-3 mt-5"
          value={coupon.target || ""}
          onChange={handleChange("target")}
          options={targetOptions}
        />
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <FormControlLabel
            control={
              <Checkbox
                name="is_active"
                checked={coupon.is_active}
                onChange={handleCheckboxChange("is_active")}
              />
            }
            label="Ativo"
          />
          <Typography variant="body2">
            {selectedUserIds.length} usuário(s) selecionado(s)
          </Typography>
        </Box>
        <Button
          variant="contained"
          fullWidth
          onClick={() => setSelectUsersModalOpen(true)}
        >
          Selecionar Usuários
        </Button>
      </DialogContent>
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
      <SelectUsersModal
        open={selectUsersModalOpen}
        onClose={() => setSelectUsersModalOpen(false)}
        selectedUserIds={selectedUserIds}
        setSelectedUserIds={setSelectedUserIds}
      />
    </Dialog>
  );
}

export default CouponModal;
