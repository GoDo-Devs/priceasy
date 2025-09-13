import { Box, Grid, Button, InputLabel, Collapse } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SelectInput from "@/components/Form/SelectInput.jsx";
import vehicleCategoryService from "@/services/vehicleCategoryService.js";
import CurrencyInput from "@/components/Form/CurrencyInput.jsx";
import TextInput from "@/components/Form/TextInput.jsx";

function AggregatesForm({ simulation, setSimulation, aggregateQty, onEmpty }) {
  const typeAgreggate = 8;
  const [fields, setFields] = useState([]);
  const [aggregates, setAggregates] = useState([]);
  const nextId = useRef(1);
  const initialized = useRef(false);
  const lastVehicleTypeId = useRef(null);
  const debounceTimeout = useRef(null);
  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    if (initialized.current) return;

    if (simulation?.aggregates?.length) {
      const initialFields = simulation.aggregates.map((agg, i) => ({
        id: i + 1,
        aggregateId: agg.id,
        aggregateValue: agg.value,
        aggregatePlate: agg.plate,
      }));
      setFields(initialFields);
      setExpandedIds(initialFields.map((f) => f.id));
      nextId.current = initialFields.length + 1;
    } else {
      const initialFields =
        aggregateQty > 0
          ? Array.from({ length: aggregateQty }, (_, i) => ({
              id: i + 1,
              aggregateId: "",
              aggregateValue: "",
              aggregatePlate: "",
            }))
          : [
              {
                id: 1,
                aggregateId: "",
                aggregateValue: "",
                aggregatePlate: "",
              },
            ];
      setFields(initialFields);
      setExpandedIds(initialFields.map((f) => f.id));
      nextId.current = initialFields.length + 1;
    }

    initialized.current = true;
  }, []);

  useEffect(() => {
    if (!simulation?.vehicle_type_id) return;
    if (simulation.vehicle_type_id === lastVehicleTypeId.current) return;

    lastVehicleTypeId.current = simulation.vehicle_type_id;

    const fetchAggregates = async () => {
      try {
        const data =
          await vehicleCategoryService.getVehicleCategoryByIdVehicleTypeId(
            typeAgreggate
          );
        setAggregates(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAggregates();
  }, [simulation?.vehicle_type_id]);

  useEffect(() => {
    if (!aggregates.length || !simulation?.aggregates?.length) return;

    const updatedAggregates = simulation.aggregates.map((agg) => {
      const matched = aggregates.find((a) => a.id === agg.id);
      return {
        ...agg,
        name: agg.name || matched?.name || "",
      };
    });

    const hasChanges = updatedAggregates.some(
      (agg, i) => agg.name !== simulation.aggregates[i]?.name
    );

    if (hasChanges) {
      setSimulation((prev) => ({
        ...prev,
        aggregates: updatedAggregates,
      }));
    }
  }, [aggregates, simulation?.aggregates]);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      syncSimulation(fields);
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [fields]);

  const syncSimulation = (updatedFields) => {
    setSimulation({
      ...simulation,
      aggregates: updatedFields.map((f) => {
        const existing =
          simulation.aggregates?.find((agg) => agg.key === f.id) || {};

        const selectedAggregate = aggregates.find(
          (agg) => agg.id === f.aggregateId
        );

        return {
          ...existing,
          key: f.id,
          id: f.aggregateId,
          name: selectedAggregate?.name ?? existing.name ?? "",
          value: f.aggregateValue,
          plate: f.aggregatePlate,
        };
      }),
    });
  };

  const addField = () => {
    const newField = {
      id: nextId.current,
      aggregateId: "",
      aggregateValue: "",
      aggregatePlate: "",
    };
    const updated = [...fields, newField];
    setFields(updated);
    setExpandedIds((prev) => [...prev, newField.id]);
    nextId.current += 1;
  };

  const removeField = (id) => {
    const updated = fields.filter((f) => f.id !== id);
    setFields(updated);
    setExpandedIds((prev) => prev.filter((eid) => eid !== id));
    if (updated.length === 0 && onEmpty) onEmpty();
  };

  const handleFieldChange = (id, fieldName, value) => {
    const updated = fields.map((f) =>
      f.id === id ? { ...f, [fieldName]: value } : f
    );
    setFields(updated);
  };

  return (
    <Box display="flex" flexDirection="column" width="100%">
      {fields.map((field) => (
        <Collapse key={`agg-${field.id}`} in={expandedIds.includes(field.id)}>
          <Grid container spacing={2} mt={2} alignItems="center">
            <Grid size={{ xs: 12, md: 9 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <InputLabel>Agregado</InputLabel>
                  <SelectInput
                    fullWidth
                    size="small"
                    value={
                      aggregates.find((a) => a.id === field.aggregateId)
                        ? field.aggregateId
                        : ""
                    }
                    options={aggregates.map((agg) => ({
                      value: agg.id,
                      label: agg.name,
                    }))}
                    onChange={(e) =>
                      handleFieldChange(field.id, "aggregateId", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <InputLabel className="mb-1">Valor Protegido</InputLabel>
                  <CurrencyInput
                    fullWidth
                    value={field.aggregateValue ?? ""}
                    onChange={(value) =>
                      handleFieldChange(field.id, "aggregateValue", value)
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextInput
                    fullWidth
                    label="Placa"
                    name="plate"
                    maxLength={15}
                    value={field.aggregatePlate ?? ""}
                    onChange={(e) =>
                      handleFieldChange(
                        field.id,
                        "aggregatePlate",
                        e.target.value
                      )
                    }
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              size={{ xs: 12, md: 3 }}
              display="flex"
              alignItems="flex-start"
              sx={{
                mt: { xs: 1, md: 3.8 },
              }}
              gap={1}
            >
              <Button
                variant="contained"
                color="secondary"
                size="medium"
                fullWidth
                onClick={addField}
              >
                Adicionar
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                fullWidth
                onClick={() => removeField(field.id)}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Collapse>
      ))}
    </Box>
  );
}

export default AggregatesForm;
