import { Box, Card, Grid, InputLabel, Button } from "@mui/material";
import { useEffect, useState } from "react";
import useHttp from "@/services/useHttp.js";
import TextInput from "@/components/Form/TextInput.jsx";
import CurrencyInput from "@/components/Form/CurrencyInput.jsx";
import SelectInput from "@/components/Form/SelectInput.jsx";
import PlateSearchInput from "@/components/Form/PlateSearchInput.jsx";
import AutoCompleteInput from "@/components/Form/AutoCompleteInput.jsx";
import { useSimulation } from "@/contexts/simulationContext.jsx";
import { useSearchParams } from "react-router";

function ClientVehicleForm({
  vehicleType,
  brand,
  model,
  year,
  priceTableNames,
}) {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isEditing = Boolean(id);
  const { client, setClient, simulation, setSimulation } = useSimulation();
  const [cpfOptions, setCpfOptions] = useState([]);

  useEffect(() => {
    if (
      Array.isArray(year) &&
      year.length > 0 &&
      simulation.year &&
      !year.find((y) => String(y.value) === String(simulation.year))
    ) {
      const selected = year.find(
        (y) =>
          String(y.value) === String(simulation.year) ||
          String(y.label) === String(simulation.year)
      );

      if (selected) {
        setSimulation((prev) => ({
          ...prev,
          year: Number(selected.value),
          modelYearLabel: selected.label,
          fuel: selected.fuel ?? "",
        }));
      }
    }
  }, [year, simulation.year]);

  useEffect(() => {
    if (client.cpf && client.cpf.length >= 3) {
      useHttp
        .post("/clients/search", { cpf: client.cpf })
        .then((res) => {
          const options = res.data.map((item) => ({
            value: item.cpf,
            label: item.cpf,
          }));
          setCpfOptions(options);
        })
        .catch((err) => {
          console.error("Erro ao buscar CPFs:", err);
        });
    } else {
      setCpfOptions([]);
    }
  }, [client.cpf]);

  const handleFetchVehicleData = async () => {
    const plate = simulation.plate?.trim();
    if (!plate || plate.length < 7) return;

    try {
      const { data } = await useHttp.post("/fipe/plate", { plate });
      const fipeData = data.fipe;
      console.log("fipeData", fipeData)
      if (!fipeData) return;

      const matchedType = vehicleType.find(
        (cat) => cat.fipeCode === fipeData.tipo
      );

      setSimulation((prev) => ({
        ...prev,
        vehicle_type_id: matchedType?.id ?? prev.vehicle_type_id,
        vehicle_type_fipeCode: fipeData.tipo ?? prev.vehicle_type_fipeCode,
        brand_id: fipeData.id_marca ?? prev.brand_id,
        model_id: fipeData.id_modelo ?? prev.model_id,
        year: fipeData.modelYear ?? prev.year,
        fuel: fipeData.fuelCode ?? prev.fuel,
        fipeValue: fipeData.valor ?? prev.fipeValue,
        plate,
        name: fipeData.modelo,
        fipeCode: fipeData.codigo
      }));
    } catch (err) {
      console.error("Erro ao buscar veículo pela placa:", err);
    }
  };

  const fetchClientData = async (cpf) => {
    if (cpf.length !== 11) return;
    try {
      const res = await useHttp.post("/clients/cpf", { cpf });
      const { name, phone } = res.data;
      setClient((prev) => ({ ...prev, name, phone }));
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Erro ao buscar cliente:", err);
      }
    }
  };

  function formatCPF(value) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatPhone(value) {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
      .slice(0, 15);
  }

  return (
    <Card sx={{ borderRadius: 2 }} elevation={0} className="p-5">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4.3 }}>
          <TextInput
            fullWidth
            label="Nome"
            name="name"
            value={client.name ?? ""}
            onChange={(e) => setClient({ ...client, name: e.target.value })}
            disabled={isEditing}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <AutoCompleteInput
            freeSolo
            fullWidth
            label="CPF"
            options={cpfOptions}
            value={formatCPF(client.cpf ?? "")}
            maxLength={14}
            onInputChange={(val) => {
              const raw = val.replace(/\D/g, "");
              setClient((prev) => ({ ...prev, cpf: raw }));
              if (raw.length === 11) fetchClientData(raw);
            }}
            disabled={isEditing}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2.5 }}>
          <TextInput
            fullWidth
            label="Celular"
            name="phone"
            maxLength={15}
            value={formatPhone(client.phone ?? "")}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              setClient((prev) => ({ ...prev, phone: raw }));
            }}
            disabled={isEditing}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2.2 }}>
          <PlateSearchInput
            fullWidth
            label="Placa"
            name="plate"
            maxLength={8}
            value={simulation.plate ?? ""}
            onChange={(e) =>
              setSimulation({ ...simulation, plate: e.target.value ?? "" })
            }
            onSearch={handleFetchVehicleData}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3.5 }}>
          <SelectInput
            fullWidth
            label="Tipo de Veículo"
            name="vehicle_type_id"
            value={
              vehicleType.some((cat) => cat.id === simulation.vehicle_type_id)
                ? simulation.vehicle_type_id
                : ""
            }
            onChange={(e) => {
              const selectedId = parseInt(e.target.value);
              const selectedOption = vehicleType.find(
                (cat) => cat.id === selectedId
              );
              if (selectedOption) {
                setSimulation({
                  ...simulation,
                  vehicle_type_id: selectedOption.id,
                  vehicle_type_fipeCode: selectedOption.fipeCode,
                  aggregates: null,
                  fipeValue: null,
                  protectedValue: null,
                  monthlyFee: null,
                  brand_id: "",
                  model_id: "",
                  year: "",
                  price_table_id: "",
                });
              }
            }}
            options={vehicleType.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2.5 }}>
          <AutoCompleteInput
            fullWidth
            label="Marca"
            value={simulation.brand_id ?? ""}
            options={brand}
            onChange={(val) =>
              setSimulation({
                ...simulation,
                brand_id: Number(val),
                model_id: "",
                year: "",
              })
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AutoCompleteInput
            fullWidth
            label="Modelo"
            value={simulation.model_id ?? ""}
            options={model}
            onChange={(val) =>
              setSimulation({
                ...simulation,
                model_id: Number(val),
                year: "",
                price_table_id: null,
                plan_id: null,
              })
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2.5 }}>
          <AutoCompleteInput
            fullWidth
            label="Ano Modelo"
            value={simulation.year ?? ""}
            options={year}
            onChange={(val) => {
              const selected = year.find(
                (y) => y.value === val || y.label === val
              );
              setSimulation({
                ...simulation,
                year: Number(selected?.value || ""),
                modelYearLabel: selected?.label || "",
                fuel: selected?.fuel ?? "",
              });
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AutoCompleteInput
            fullWidth
            label="Tabela de Preço"
            value={simulation.price_table_id}
            options={priceTableNames}
            onChange={(val) =>
              setSimulation({
                ...simulation,
                price_table_id: Number(val),
              })
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3.5 }} mb={0.5}>
          <InputLabel className="mb-1">Valor Protegido</InputLabel>
          <CurrencyInput
            fullWidth
            name="protectedValue"
            value={
              simulation.protectedValue ??
              (simulation.fipeValue
                ? Number(simulation.fipeValue).toFixed(2)
                : "")
            }
            onChange={(floatValue) =>
              setSimulation({
                ...simulation,
                protectedValue: floatValue ?? "",
              })
            }
            required
          />
        </Grid>
      </Grid>
    </Card>
  );
}

export default ClientVehicleForm;
