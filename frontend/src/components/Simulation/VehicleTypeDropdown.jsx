import { useState, useEffect } from "react";
import {
  Card,
  Stack,
  Box,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import vehicleTypeService from "@/services/vehicleTypeService.js";

export default function VehicleTypeDropdown({ simulation, rangeDetails }) {
  if (!simulation?.vehicle_type_id) return null;

  const [expanded, setExpanded] = useState(false);
  const [vehicleTypeName, setVehicleTypeName] = useState([]);

  const formatBRL = (value) => {
    if (value === null || value === undefined) return "-";
    const num = Number(value);
    if (isNaN(num)) return "-";
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  useEffect(() => {
    if (!simulation?.vehicle_type_id) return;

    vehicleTypeService
      .getById(simulation.vehicle_type_id)
      .then((data) => setVehicleTypeName(data.name ?? "Veículo"))
      .catch((err) => console.error("Error fetching vehicle type:", err));
  }, [simulation?.vehicle_type_id]);

  const handleExpand = () => setExpanded(!expanded);

  return (
    <Card
      variant="outlined"
      sx={{
        mt: 1.5,
        mb: 1.5,
        borderRadius: 2,
        p: 1.5,
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontSize={15} color="text.secondary" fontWeight="medium">
          {(vehicleTypeName || "Veículo").toString().split(" ")[0]} - {simulation.plate}
        </Typography>

        <IconButton size="small" onClick={handleExpand}>
          <ExpandMoreIcon
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.3s",
            }}
          />
        </IconButton>
      </Stack>

      <Collapse in={expanded}>
        <Stack direction="column" spacing={0} mt={1}>
          {" "}
          <Typography fontSize={14} color="text.secondary">
            Taxa de Matrícula:{" "}
            <Box component="span" color="secondary.main">
              {formatBRL(
                simulation.discountedAccession ?? rangeDetails.accession
              )}
            </Box>
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Mensalidade:{" "}
            <Box component="span" color="secondary.main">
              {formatBRL(
                simulation.discountedMonthlyFee ?? simulation.monthlyFee
              )}
            </Box>
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Rastreador:{" "}
            <Box component="span" color="secondary.main">
              {formatBRL(
                simulation.discountedInstallationPrice ??
                  rangeDetails.installationPrice
              )}
            </Box>
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Cota de Participação:{" "}
            <Box component="span" color="secondary.main">
              {formatBRL(
                (simulation.franchiseValue ?? rangeDetails.franchiseValue) !=
                  null
                  ? (
                      simulation.franchiseValue != null
                        ? simulation.isFranchisePercentage
                        : rangeDetails.isFranchisePercentage
                    )
                    ? (simulation.protectedValue || 0) *
                      ((simulation.franchiseValue ??
                        rangeDetails.franchiseValue) /
                        100)
                    : simulation.franchiseValue ?? rangeDetails.franchiseValue
                  : null
              )}
            </Box>
          </Typography>
        </Stack>
      </Collapse>
    </Card>
  );
}
