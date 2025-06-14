import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Box,
  Card,
  CardActionArea,
  Typography,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useHttp from "@/services/useHttp.js";

const iconsMap = {
  1: <DirectionsCarIcon sx={{ fontSize: 40 }} />,
  2: <TwoWheelerIcon sx={{ fontSize: 40 }} />,
  3: <LocalShippingIcon sx={{ fontSize: 40 }} />,
  4: <AgricultureIcon sx={{ fontSize: 40 }} />,
};

function VehicleTypeModal({ open, priceTable, setPriceTable, onClose }) {
  const [vehicleType, setVehicleType] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      useHttp
        .get("/vehicle-types")
        .then((res) => setVehicleType(res.data.vehicleTypes))
        .catch((err) => console.error("Erro ao carregar grupos:", err));
    }
  }, [open]);

  const handleSelect = (value) => {
    setPriceTable((prev) => ({
      ...prev,
      vehicle_type_id: value,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slots={{ paper: Paper }}
      slotProps={{
        paper: {
          sx: { borderRadius: 8, p: 2 },
        },
      }}
    >
      <DialogContent>
        <Typography variant="h6" mb={2}>
          Selecione um Tipo de Veículo
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {vehicleType.map(({ id, name }) => {
            const isSelected = priceTable.vehicle_type_id === Number(id);
            return (
              <Card
                key={id}
                sx={{
                  width: 100,
                  boxShadow: isSelected ? 6 : 1,
                  bgcolor: isSelected ? "primary.main" : "background.paper",
                }}
              >
                <CardActionArea
                  onClick={() => handleSelect(Number(id))}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  {iconsMap[id] || null}
                  <Typography mt={1} variant="body2" textAlign="center">
                    {name}
                  </Typography>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() =>
            navigate("/adicionar-tabela", {
              state: { vehicleType: priceTable.vehicle_type_id },
            })
          }
          variant="contained"
          color="secondary"
          disabled={!priceTable?.vehicle_type_id}
        >
          Avançar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default VehicleTypeModal;
