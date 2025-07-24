import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  InputLabel,
  Divider,
} from "@mui/material";
import SelectInput from "@/components/Form/SelectInput.jsx";
import CurrencyInput from "@/components/Form/CurrencyInput.jsx";
import useHttp from "@/services/useHttp.js";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";

function DiscountModal({
  open,
  onClose,
  simulation,
  setSimulation,
  rangeDetails,
  type,
}) {
  const [coupons, setCoupons] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [discountError, setDiscountError] = useState("");
  const [discountedValue, setDiscountedValue] = useState(null);
  const originalValue = rangeDetails?.[type] ?? simulation?.[type] ?? 0;

  const selectedCoupon = coupons.find((c) => c.id === selectedCouponId);

  const maxDiscountedValue = selectedCoupon
    ? originalValue - (originalValue * selectedCoupon.discountPercentage) / 100
    : originalValue;

  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  useEffect(() => {
    if (open) {
      useHttp
        .get("/auth/checkuser")
        .then((userRes) => {
          const userId = userRes.data.user.id;
          if (!userId) throw new Error("Usuário não encontrado");

          return useHttp.post("/user-coupons/by-user-target", {
            userId,
            target: type,
            is_active: true,
          });
        })
        .then((res) => setCoupons(res.data.coupons || []))
        .catch((err) => console.error("Erro ao carregar os cupons:", err));
    }
  }, [open, type]);

  useEffect(() => {
    if (open) {
      const fieldMap = {
        accession: "discountedAccession",
        monthlyFee: "discountedMonthlyFee",
        installationPrice: "discountedInstallationPrice",
      };
      const field = fieldMap[type];
      const existingValue = simulation?.[field];
      const savedCouponId = simulation?.[`${field}CouponId`];

      setDiscountedValue(existingValue ?? originalValue);
      setSelectedCouponId(savedCouponId ?? null);
      setDiscountError("");
    }
  }, [open, type, simulation, originalValue]);

  useEffect(() => {
    if (!selectedCoupon) {
      setDiscountError("");
      setDiscountedValue(originalValue);
      return;
    }

    const minAllowedValue =
      originalValue - (originalValue * selectedCoupon.discountPercentage) / 100;

    if (discountedValue === null || discountedValue > originalValue) {
      setDiscountError(
        "O valor com desconto não pode ser maior que o original."
      );
    } else if (discountedValue < minAllowedValue) {
      setDiscountError(
        `O valor mínimo permitido com desconto é ${formatCurrency(
          minAllowedValue
        )}.`
      );
    } else {
      setDiscountError("");
    }
  }, [selectedCoupon, discountedValue, originalValue]);

  const handleSelectChange = (e) => {
    const couponId = e.target.value;
    setSelectedCouponId(couponId);

    const coupon = coupons.find((c) => c.id === couponId);
    if (coupon) {
      const maxDiscount =
        originalValue - (originalValue * coupon.discountPercentage) / 100;
      setDiscountedValue(Number(maxDiscount.toFixed(2)));
    }
  };

  const handleValueChange = (value) => {
    setDiscountedValue(value);
  };

  const typeLabels = {
    accession: "Alterar valor da adesão",
    monthlyFee: "Alterar valor da mensalidade",
    installationPrice: "Alterar valor do rastreador",
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
        <Typography variant="h5" mb={2} align="center" gutterBottom>
          {typeLabels[type] || "Alterar valor"}
        </Typography>

        <Typography
          variant="subtitle1"
          fontWeight="bold"
          mb={1}
          display="flex"
          justifyContent="space-between"
        >
          <span style={{ color: "#1894c3" }}>Valor original:</span>
          <span style={{ color: "#51d6a4" }}>
            {formatCurrency(originalValue)}
          </span>
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <SelectInput
          label="Limite de Desconto"
          name="coupon"
          className="mb-5"
          value={selectedCouponId ?? ""}
          onChange={handleSelectChange}
          options={coupons.map((g) => ({
            value: g.id,
            label: `${g.name} - ${g.discountPercentage}%`,
          }))}
        />
        <InputLabel className="text-white mb-1 mt-5">
          Valor a ser cobrado
        </InputLabel>
        <CurrencyInput
          value={discountedValue}
          onChange={handleValueChange}
          prefix="R$ "
          error={Boolean(discountError)}
          helperText={discountError}
        />
        {selectedCoupon && (
          <>
            <Typography variant="body2" mt={2}>
              Desconto aplicado:{" "}
              <span style={{ color: "#51d6a4" }}>
                {formatCurrency(originalValue - discountedValue)}
              </span>
            </Typography>
            <Typography variant="body2">
              Valor mínimo com desconto:{" "}
              <span style={{ color: "#51d6a4" }}>
                {formatCurrency(maxDiscountedValue)}
              </span>
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={() => {
            const simulationFieldMap = {
              accession: "discountedAccession",
              monthlyFee: "discountedMonthlyFee",
              installationPrice: "discountedInstallationPrice",
            };

            const field = simulationFieldMap[type];

            if (field && typeof setSimulation === "function") {
              setSimulation((prev) => ({
                ...prev,
                [field]: discountedValue,
                [`${field}CouponId`]: selectedCouponId,
              }));
            }

            onClose();
          }}
          variant="contained"
          color="secondary"
          disabled={discountedValue === null || Boolean(discountError)}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DiscountModal;
