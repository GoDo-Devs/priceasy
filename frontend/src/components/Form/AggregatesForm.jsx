import { Box, Grid, Button, InputLabel, Collapse } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SelectInput from "@/components/Form/SelectInput.jsx";
import vehicleCategoryService from "@/services/vehicleCategoryService.js";
import CurrencyInput from "@/components/Form/CurrencyInput.jsx";
import TextInput from "@/components/Form/TextInput.jsx";
import PlanSelectorAggregates from "@/components/Simulation/PlanSelectorAggregates.jsx";

function AggregatesForm({
  simulation,
  setSimulation,
  aggregateQty,
  onEmpty,
  plans,
  onDetails,
}) {
  const typeAgreggate = 8;
  const [fields, setFields] = useState([]);
  const [aggregates, setAggregates] = useState([]);
  const nextId = useRef(1);
  const initialized = useRef(false);
  const debounceTimeout = useRef(null);
  const [expandedIds, setExpandedIds] = useState([]);

  // Inicializa campos respeitando agregados existentes
  useEffect(() => {
    if (initialized.current) return;

    let initialFields = [];

    if (Array.isArray(simulation?.aggregates) && simulation.aggregates.length) {
      initialFields = simulation.aggregates.map((agg, i) => ({
        id: agg.key ?? i + 1,
        aggregateId: agg.id,
        aggregateValue: agg.value,
        aggregatePlate: agg.plate,
      }));
    } else if (aggregateQty > 0) {
      initialFields = Array.from({ length: aggregateQty }, (_, i) => ({
        id: i + 1,
        aggregateId: "",
        aggregateValue: "",
        aggregatePlate: "",
      }));
    } else {
      initialFields = [
        {
          id: 1,
          aggregateId: "",
          aggregateValue: "",
          aggregatePlate: "",
        },
      ];
    }

    setFields(initialFields);
    setExpandedIds(initialFields.map((f) => f.id));
    nextId.current =
      initialFields.reduce((m, f) => Math.max(m, Number(f.id ?? 0)), 0) + 1;

    initialized.current = true;
  }, [simulation?.aggregates, aggregateQty]);

  // Busca categorias de agregados e mantém campos existentes
  useEffect(() => {
    if (!simulation?.vehicle_type_id) {
      setFields([]);
      setAggregates([]);
      nextId.current = 1;
      return;
    }

    const fetchAggregates = async () => {
      try {
        const data =
          await vehicleCategoryService.getVehicleCategoryByIdVehicleTypeId(
            typeAgreggate
          );
        setAggregates(data);

        // Só cria campos vazios se não houver agregados existentes
        if (
          !Array.isArray(simulation?.aggregates) ||
          !simulation.aggregates.length
        ) {
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
      } catch (err) {
        console.error("Erro ao buscar categorias de agregado:", err);
      }
    };

    fetchAggregates();
  }, [simulation?.vehicle_type_id, aggregateQty]);

  // Sincroniza nomes dos agregados
  useEffect(() => {
    if (!aggregates.length || !Array.isArray(simulation?.aggregates)) return;

    const updatedAggregates = simulation.aggregates.map((agg) => {
      const matched = aggregates.find((a) => String(a.id) === String(agg.id));
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
  }, [aggregates, simulation?.aggregates, setSimulation]);

  // Sincroniza campos com simulation (debounce)
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      syncSimulation(fields);
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [fields]);

  const syncSimulation = (updatedFields) => {
    setSimulation((prev) => {
      const newAggregates = (updatedFields || [])
        .filter((f) => f.aggregateId && f.aggregateValue)
        .map((f) => {
          const existing =
            (prev?.aggregates || []).find(
              (agg) => String(agg.key) === String(f.id)
            ) || {};

          const selectedAggregate = aggregates.find(
            (a) => String(a.id) === String(f.aggregateId)
          );

          return {
            ...existing,
            key: f.id,
            id: f.aggregateId,
            name: selectedAggregate?.name ?? existing.name ?? "",
            value: f.aggregateValue,
            plate: f.aggregatePlate,
          };
        });

      return {
        ...prev,
        aggregates: newAggregates,
      };
    });
  };

  const addField = () => {
    const newField = {
      id: nextId.current,
      aggregateId: "",
      aggregateValue: "",
      aggregatePlate: "",
    };
    setFields((prev) => [...prev, newField]);
    setExpandedIds((prev) => [...prev, newField.id]);
    nextId.current += 1;
  };

  const removeField = (id) => {
    const updated = fields.filter((f) => String(f.id) !== String(id));
    setFields(updated);
    setExpandedIds((prev) => prev.filter((eid) => String(eid) !== String(id)));

    setSimulation((prev) => ({
      ...prev,
      aggregates: (prev.aggregates || []).filter(
        (agg) => String(agg.key) !== String(id)
      ),
    }));

    if (updated.length === 0 && onEmpty) onEmpty();
  };

  const handleFieldChange = (id, fieldName, value) => {
    setFields((prev) =>
      prev.map((f) =>
        String(f.id) === String(id) ? { ...f, [fieldName]: value } : f
      )
    );
  };

  return (
    <Box display="flex" flexDirection="column" width="100%">
      {fields.map((field) => {
        const aggregateData = (simulation.aggregates ?? []).find(
          (a) => String(a.key) === String(field.id)
        );

        return (
          <Collapse key={`agg-${field.id}`} in={expandedIds.includes(field.id)}>
            <Grid container columnSpacing={2} mt={2} alignItems="center">
              <Grid size={{ xs: 12, md: 9 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <InputLabel>Agregado</InputLabel>
                    <SelectInput
                      fullWidth
                      size="small"
                      value={field.aggregateId ?? ""}
                      options={aggregates.map((agg) => ({
                        value: agg.id,
                        label: agg.name,
                      }))}
                      onChange={(e) =>
                        handleFieldChange(
                          field.id,
                          "aggregateId",
                          e.target.value
                        )
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
                      maxLength={8}
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
                sx={{ mt: { xs: 1, md: 3.5 } }}
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
              <Grid size={{ xs: 12 }} mt={0.5}>
                <PlanSelectorAggregates
                  aggregate={aggregateData}
                  plans={plans}
                  setSimulation={setSimulation}
                  onDetails={onDetails}
                />
              </Grid>
            </Grid>
          </Collapse>
        );
      })}
    </Box>
  );
}

export default AggregatesForm;
