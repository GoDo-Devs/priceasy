import { useState } from "react";
import {
  Card,
  Stack,
  Box,
  Typography,
  Collapse,
  IconButton,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DiscountModalAggregates from "@/components/Modal/DiscountModalAggregates.jsx";
import PriceCard from "@/components/Simulation/PriceCard.jsx";

export default function Dropdown({ data, simulation, setSimulation }) {
  if (!data || !simulation?.aggregates) return null;

  const [expandedIds, setExpandedIds] = useState([]);
  const [type, setType] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAggregate, setSelectedAggregate] = useState(null);

  const toggleExpand = (uniqueKey) => {
    setExpandedIds((prev) =>
      prev.includes(uniqueKey)
        ? prev.filter((x) => x !== uniqueKey)
        : [...prev, uniqueKey]
    );
  };

  const handleOpenModal = (type, aggregate) => {
    setType(type);
    setSelectedAggregate(aggregate);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setType(null);
    setSelectedAggregate(null);
  };

  const toNumber = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  return (
    <>
      {simulation.aggregates
        .filter((agg) => agg?.id && agg?.value)
        .map((agg) => {
          const uniqueKey = `${agg.key}-${agg.id}`;
          const isExpanded = expandedIds.includes(uniqueKey);
          const aggData = data[agg.id];
          if (!aggData) return null;

          return (
            <Card
              key={uniqueKey}
              variant="outlined"
              sx={{
                mt: 1.5,
                mb: 1.5,
                borderRadius: 2,
                p: 1.5,
                backgroundColor: "transparent",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontSize={15} ml={0.5} color="text.secondary">
                  {agg.name} - {agg.plate}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => toggleExpand(uniqueKey)}
                >
                  <ExpandMoreIcon
                    sx={{
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "0.3s",
                    }}
                  />
                </IconButton>
              </Stack>

              <Collapse in={isExpanded}>
                <Grid container mt={1}>
                  {aggData.plans?.map((plan) => (
                    <Grid
                      container
                      spacing={1.5}
                      size={{ xs: 12 }}
                      key={plan.id}
                    >
                      <Grid size={{ xs: 6 }}>
                        <PriceCard
                          label="Taxa de Matrícula"
                          discountedValue={agg.discountedAccession ?? null}
                          originalValue={
                            aggData.rangeDetails?.accession ?? null
                          }
                          onEdit={() => handleOpenModal("accession", agg)}
                          alwaysGreen
                          minHeight={110}
                          noBorder
                        />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <PriceCard
                          label="Mensalidade"
                          discountedValue={agg.discountedBasePrice ?? null}
                          originalValue={toNumber(
                            agg.totalBasePrice ?? agg.basePrice
                          )}
                          onEdit={null}
                          alwaysGreen
                          minHeight={110}
                          noBorder
                        />
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Collapse>
            </Card>
          );
        })}
      <DiscountModalAggregates
        open={openModal}
        onClose={handleCloseModal}
        type={type}
        aggregate={selectedAggregate}
        simulation={simulation}
        setSimulation={setSimulation}
      />
    </>
  );
}
