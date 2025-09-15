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

function PlanDetailsModal({ open, onClose, plan, simulation, onSave }) {
  if (!open || !plan) return null;

  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});

  useEffect(() => {
    if (!open) return;
    setSelectedProducts(simulation?.selectedProducts || {});
  }, [open, simulation]);

  useEffect(() => {
    if (!open) {
      setProducts([]);
      setServices([]);
    }
  }, [open]);

  useEffect(() => {
    if (plan?.id && open) {
      useHttp
        .get(`/plan-services/${plan.id}`)
        .then((response) => setServices(response.data))
        .catch(() => setServices([]));
    }
  }, [plan, open]);

  useEffect(() => {
    if (!open) return;

    const vehicleTypeId =
      simulation?.vehicle_type_fipeCode === 4
        ? 8
        : simulation?.vehicle_type_fipeCode;

    if (vehicleTypeId) {
      useHttp
        .post("/product-vehicle-types/vehicle-type", {
          vehicle_type_id: vehicleTypeId,
        })
        .then((response) => {
          setProducts(response.data.products || []);
        })
        .catch(() => setProducts([]));
    } else {
      setProducts([]);
    }
  }, [simulation, open]);

  const formatPrice = (price) => {
    if (price < 1000) {
      return price.toFixed(2).replace(".", ",");
    }
    return price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleToggle = (product) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      if (updated[product.product_group_id] === product.id) {
        delete updated[product.product_group_id];
      } else {
        updated[product.product_group_id] = product.id;
      }
      return updated;
    });
  };

  const isProductSelected = (product) =>
    selectedProducts[product.product_group_id] === product.id;

  const isSwitchDisabled = (product) => {
    const selectedId = selectedProducts[product.product_group_id];
    return selectedId && selectedId !== product.id;
  };

  const calculatedValueSelectedProducts = useMemo(() => {
    return products.reduce((sum, p) => {
      return selectedProducts[p.product_group_id] === p.id
        ? sum + p.price
        : sum;
    }, 0);
  }, [selectedProducts, products]);

  const monthlyFee = useMemo(
    () => plan.basePrice + calculatedValueSelectedProducts,
    [plan.basePrice, calculatedValueSelectedProducts]
  );

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
            width: "600px",
            maxWidth: "100%",
            borderRadius: 8,
            p: 1.5,
          },
        },
      }}
    >
      <DialogTitle textAlign="center">Detalhes do Plano</DialogTitle>
      <DialogContent
        dividers
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
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
          services.map((service) => (
            <div key={service.id}>
              <Typography variant="body2" fontSize="0.80rem">
                {service.name}
              </Typography>
              <Divider sx={{ my: 1 }} />
            </div>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhum serviço listado para este plano.
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
          products.map((product) => {
            const isSelected = isProductSelected(product);
            const disabled = isSwitchDisabled(product);

            return (
              <Box
                key={product.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={isSelected}
                      onChange={() => handleToggle(product)}
                      color="primary"
                      disabled={disabled}
                    />
                  }
                  label={product.name}
                  sx={{
                    display: "block",
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.80rem",
                    },
                  }}
                />
                <Typography fontSize="0.75rem" color="text.secondary">
                  R$ {formatPrice(product.price)}
                </Typography>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhum produto vinculado a este tipo de veículo.
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
          <span style={{ color: "#51d6a4" }}>R$ {formatPrice(monthlyFee)}</span>
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            setProducts([]);
            setServices([]);
            onClose();
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => {
            if (onSave)
              onSave({
                planId: plan.id,
                monthlyFee,
                valueSelectedProducts: calculatedValueSelectedProducts,
                selectedProducts,
              });
            onClose();
          }}
          variant="contained"
          color="secondary"
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PlanDetailsModal;
