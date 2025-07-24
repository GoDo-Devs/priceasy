import React from "react";
import { Box } from "@mui/material";
import PriceCard from "./PriceCard.jsx";

export default function PriceCardsList({
  simulation,
  rangeDetails,
  onEdit,
  toNumber,
}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <PriceCard
        label="Valor FIPE"
        discountedValue={simulation.fipeValue}
        originalValue={null}
        alwaysGreen
      />
      <PriceCard
        label="Taxa de Matrícula"
        discountedValue={
          simulation.discountedAccession != null &&
          simulation.discountedAccession !== rangeDetails.accession
            ? simulation.discountedAccession
            : rangeDetails.accession
        }
        originalValue={rangeDetails.accession}
        onEdit={rangeDetails.accession ? () => onEdit("accession") : null}
        alwaysGreen
      />
      <PriceCard
        label="Mensalidade"
        discountedValue={
          simulation.discountedMonthlyFee != null
            ? toNumber(simulation.discountedMonthlyFee) +
              toNumber(simulation.valueSelectedProducts)
            : null
        }
        originalValue={
          simulation.monthlyFee != null
            ? toNumber(simulation.monthlyFee) +
              toNumber(simulation.valueSelectedProducts)
            : null
        }
        onEdit={simulation.monthlyFee ? () => onEdit("monthlyFee") : null}
        alwaysGreen
      />
      <PriceCard
        label="Rastreador"
        discountedValue={
          simulation.discountedInstallationPrice != null &&
          simulation.discountedInstallationPrice !==
            rangeDetails.installationPrice
            ? simulation.discountedInstallationPrice
            : rangeDetails.installationPrice
        }
        originalValue={rangeDetails.installationPrice}
        onEdit={
          rangeDetails.installationPrice
            ? () => onEdit("installationPrice")
            : null
        }
        alwaysGreen
      />
      <PriceCard
        label="Cota de Participação"
        discountedValue={
          rangeDetails.franchiseValue != null
            ? rangeDetails.isFranchisePercentage
              ? (simulation.protectedValue || 0) *
                (rangeDetails.franchiseValue / 100)
              : rangeDetails.franchiseValue
            : null
        }
        originalValue={null}
        alwaysGreen
      />
    </Box>
  );
}
