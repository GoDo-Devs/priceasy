import { Grid, Card } from "@mui/material";
import PriceCard from "./PriceCard.jsx";

export default function PriceCardsList({
  simulation,
  rangeDetails,
  onEdit,
  toNumber,
}) {
  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, md: 12 }}>
        <PriceCard
          label="Valor FIPE"
          discountedValue={simulation.fipeValue}
          originalValue={null}
          alwaysGreen
          minHeight={60}
        />
      </Grid>

      <Grid size={{ xs: 6, md: 6 }}>
        <PriceCard
          label="Taxa de Matrícula"
          discountedValue={
            simulation.discountedAccession != null
              ? toNumber(simulation.discountedAccession)
              : null
          }
          originalValue={
            simulation.accession != null
              ? toNumber(simulation.accession)
              : rangeDetails.accession != null
              ? toNumber(rangeDetails.accession)
              : null
          }
          onEdit={
            simulation.accession != null || rangeDetails.accession != null
              ? () => onEdit("accession")
              : null
          }
          alwaysGreen
        />
      </Grid>

      <Grid size={{ xs: 6, md: 6 }}>
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
              ? toNumber(simulation.monthlyFee)
              : rangeDetails.monthlyFee != null
              ? toNumber(rangeDetails.monthlyFee) +
                toNumber(simulation.valueSelectedProducts)
              : null
          }
          onEdit={
            simulation.vehicle_type_id === 8
              ? null
              : simulation.monthlyFee != null || rangeDetails.monthlyFee != null
              ? () => onEdit("monthlyFee")
              : null
          }
          alwaysGreen
        />
      </Grid>

      <Grid size={{ xs: 6, md: 6 }}>
        <PriceCard
          label="Rastreador"
          discountedValue={
            simulation.discountedInstallationPrice != null
              ? simulation.discountedInstallationPrice
              : null
          }
          originalValue={
            simulation.installationPrice != null
              ? simulation.installationPrice
              : rangeDetails.installationPrice ?? null
          }
          onEdit={
            simulation.installationPrice != null ||
            rangeDetails.installationPrice != null
              ? () => onEdit("installationPrice")
              : null
          }
          alwaysGreen
        />
      </Grid>

      <Grid size={{ xs: 6, md: 6 }}>
        <PriceCard
          label="Cota de Participação"
          discountedValue={
            simulation.franchiseValue != null
              ? simulation.isFranchisePercentage
                ? (simulation.protectedValue || 0) *
                  (simulation.franchiseValue / 100)
                : toNumber(simulation.franchiseValue)
              : rangeDetails.franchiseValue != null
              ? rangeDetails.isFranchisePercentage
                ? (simulation.protectedValue || 0) *
                  (rangeDetails.franchiseValue / 100)
                : toNumber(rangeDetails.franchiseValue)
              : null
          }
          originalValue={null}
          alwaysGreen
        />
      </Grid>
    </Grid>
  );
}
