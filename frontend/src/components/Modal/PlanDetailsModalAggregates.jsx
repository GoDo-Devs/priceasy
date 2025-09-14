import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { useEffect, useState, useMemo } from "react";
import useHttp from "@/services/useHttp.js";

function PlanDetailsModalAggregates({ open, onClose, plan, onSave }) {
  console.log(plan);
  if (!open || !plan) return null;

  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});

  useEffect(() => {
    if (!open) {
      setProducts([]);
      setServices([]);
      setSelectedProducts({});
    }
  }, [open]);

  useEffect(() => {
    if (!open || !plan) return;

    setSelectedProducts(plan.selectedProducts || {});
  }, [plan, open]);

  useEffect(() => {
    if (plan?.id && open) {
      useHttp
        .get(`/plan-services/${plan.id}`)
        .then((res) => setServices(res.data))
        .catch(() => setServices([]));
    }
  }, [plan, open]);

  useEffect(() => {
    if (!open) return;
    useHttp
      .post("/product-vehicle-types/vehicle-type", { vehicle_type_id: 8 })
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]));
  }, [open]);

  const handleToggle = (product) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      if (updated[product.product_group_id] === product.id) {
        delete updated[product.product_group_id]; // desmarca se já estava selecionado
      } else {
        updated[product.product_group_id] = product.id; // marca novo produto do grupo
      }
      return updated;
    });
  };

  const isProductSelected = (product) =>
    selectedProducts[product.product_group_id] === product.id;

  const isSwitchDisabled = (product) => {
    const selectedId = selectedProducts[product.product_group_id];
    return selectedId && selectedId !== product.id; // só desabilita se outro produto do grupo estiver selecionado
  };

  const calculatedValueSelectedProducts = useMemo(() => {
    return products.reduce((sum, p) => {
      return selectedProducts[p.product_group_id] === p.id
        ? sum + p.price
        : sum;
    }, 0);
  }, [selectedProducts, products]);

  const formatPrice = (price) =>
    price < 1000
      ? price.toFixed(2).replace(".", ",")
      : price.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

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
            width: 600,
            maxWidth: "100%",
            borderRadius: 8,
            p: 1.5,
          },
        },
      }}
    >
      <DialogTitle textAlign="center">Detalhes do Agregado</DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          mb={2}
          display="flex"
          justifyContent="space-between"
        >
          <span style={{ color: "#1894c3" }}>{plan.name}</span>
          <span style={{ color: "#51d6a4" }}>
            R$ {formatPrice(plan.basePrice)}
          </span>
        </Typography>

        {services.length > 0 ? (
          services.map((s) => (
            <div key={s.id}>
              <Typography variant="body2" fontSize="0.80rem">
                {s.name}
              </Typography>
              <Divider sx={{ my: 1 }} />
            </div>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhum serviço listado para este agregado.
          </Typography>
        )}

        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="primary"
          mb={1}
          mt={2}
        >
          Produtos
        </Typography>

        {products.length > 0 ? (
          products.map((p) => (
            <Box
              key={p.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isProductSelected(p)}
                    onChange={() => handleToggle(p)}
                    color="primary"
                    disabled={isSwitchDisabled(p)}
                  />
                }
                label={p.name}
                sx={{
                  display: "block",
                  "& .MuiFormControlLabel-label": { fontSize: "0.80rem" },
                }}
              />
              <Typography fontSize="0.75rem" color="text.secondary">
                R$ {formatPrice(p.price)}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhum produto vinculado a este agregado.
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="subtitle1"
          fontWeight="bold"
          display="flex"
          justifyContent="space-between"
        >
          <span>Mensalidade média:</span>
          <span style={{ color: "#51d6a4" }}>
            R$ {formatPrice(plan.basePrice + calculatedValueSelectedProducts)}
          </span>
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            if (onSave)
              onSave({
                key: plan.key,
                planId: plan.id,
                selectedProducts,
                basePrice: plan.basePrice,
                valueSelectedProducts: calculatedValueSelectedProducts,
              });
            onClose();
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PlanDetailsModalAggregates;
