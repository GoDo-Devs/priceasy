import { Box, Autocomplete, TextField, InputLabel } from "@mui/material";
import { useState, useEffect } from "react";
import TextInput from "@/components/Form/TextInput.jsx";
import SelectInput from "@/components/Form/SelectInput.jsx";
import AutoCompleteInput from "@/components/Form/AutoCompleteInput.jsx";
import useHttp from "@/services/useHttp.js";
import PageTitle from "../../components/PageTitle/PageTitle";

function SimulationContent({
  client,
  setClient,
  simulation,
  setSimulation,
  priceTable,
}) {
  const [vehicleType, setVehicleType] = useState([]);
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [year, setYear] = useState([]);

  useEffect(() => {
    useHttp
      .get(`/vehicle-types`)
      .then((res) => {
        setVehicleType(res.data.vehicleTypes);
      })
      .catch((err) =>
        console.error("Erro ao carregar categorias do veículo:", err)
      );
  }, []);

  useEffect(() => {
    setBrand([]);
    setModel([]);
    setYear([]);
    setSimulation((prev) => ({
      ...prev,
      brand: "",
      model: "",
      year: "",
      vehicle_type_id: prev.vehicle_type_id,
    }));

    if (simulation.vehicle_type_id && simulation.vehicle_type_id !== 4) {
      useHttp
        .post(`/fipe/brands`, { vehicleType: simulation.vehicle_type_id })
        .then((res) => {
          const options = res.data.brands.map((brand) => ({
            value: brand.Value,
            label: brand.Label,
          }));
          setBrand(options);
        })
        .catch((err) =>
          console.error("Erro ao carregar marcas do veículo:", err)
        );
    }
  }, [simulation.vehicle_type_id]);

  useEffect(() => {
    setModel([]);
    setYear([]);
    setSimulation((prev) => ({ ...prev, model: "", year: "" }));

    if (
      simulation.vehicle_type_id &&
      simulation.brand &&
      simulation.vehicle_type_id !== 4
    ) {
      useHttp
        .post(`/fipe/models`, {
          vehicleType: simulation.vehicle_type_id,
          brandCode: parseInt(simulation.brand),
        })
        .then((res) => {
          const options = res.data.models.map((model) => ({
            value: model.Value,
            label: model.Label,
          }));
          setModel(options);
        })
        .catch((err) =>
          console.error("Erro ao carregar modelos do veículo:", err)
        );
    }
  }, [simulation.brand]);

  useEffect(() => {
    setYear([]);
    setSimulation((prev) => ({ ...prev, year: "" }));

    if (
      simulation.vehicle_type_id &&
      simulation.brand &&
      simulation.model &&
      simulation.vehicle_type_id !== 4
    ) {
      useHttp
        .post(`/fipe/years`, {
          vehicleType: simulation.vehicle_type_id,
          brandCode: parseInt(simulation.brand),
          modelCode: simulation.model,
        })
        .then((res) => {
          const options = res.data.years.map((year) => ({
            value: year.value,
            label:
              year.anoModelo === 32000 ? "Zero KM" : year.anoModelo.toString(),
            tipoCombustivel: year.tipoCombustivel,
          }));
          setYear(options);
        })
        .catch((err) =>
          console.error("Erro ao carregar anos do veículo:", err)
        );
    }
  }, [simulation.model]);

  useEffect(() => {
    if (
      simulation.vehicle_type_id &&
      simulation.brand &&
      simulation.model &&
      simulation.year &&
      simulation.vehicle_type_id !== 4
    ) {
      const [yearValue, fuelType] = simulation.year.split("-");

      useHttp
        .post(`/fipe/price`, {
          vehicleType: simulation.vehicle_type_id,
          brandCode: simulation.brand,
          modelCode: simulation.model,
          modelYear: yearValue,
          fuelType: parseInt(fuelType),
        })
        .then((res) => {
          setSimulation((prev) => {
            const updated = {
              ...prev,
              fuelType: parseInt(fuelType),
              modelYear: parseInt(yearValue),
              fipeCode: res.data.consultResult.CodigoFipe,
              price: res.data.consultResult.Valor,
              name: res.data.consultResult.Modelo
            };
            console.log("Simulation atualizado:", updated);
            return updated;
          });
        })
        .catch((err) =>
          console.error("Erro ao carregar o preço do veículo:", err)
        );
    }
  }, [simulation.year]);

  return (
    <Box
      padding={3}
      sx={{
        width: "70%",
        height: "90vh",
        borderRadius: "8px",
        overflowY: "auto",
        border: "1px solid #ccc",
        paddingRight: 1,
      }}
    >
      <PageTitle title="Cotação" />
      <Box display="flex" flexWrap="wrap" gap={2} mt={2} mb={2}>
        <TextInput
          label="Nome para contato"
          name="name"
          value={client.name ?? ""}
          onChange={(e) => setClient({ ...client, name: e.target.value })}
          required
          style={{ width: "33%" }}
        />
        <TextInput
          label="CPF"
          name="cpf"
          value={client.cpf ?? ""}
          onChange={(e) => setClient({ ...client, cpf: e.target.value })}
          required
          style={{ width: "20%" }}
        />
        <TextInput
          label="Celular"
          name="phone"
          value={client.phone ?? ""}
          onChange={(e) => setClient({ ...client, phone: e.target.value })}
          required
          style={{ width: "20%" }}
        />
        <SelectInput
          label="Tipo de Veículo"
          name="vehicle_type_id"
          value={simulation.vehicle_type_id ?? ""}
          onChange={(e) =>
            setSimulation({
              ...simulation,
              vehicle_type_id: parseInt(e.target.value),
              brand: "",
              model: "",
              year: "",
            })
          }
          options={vehicleType.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
          style={{ width: "20%" }}
        />
        <AutoCompleteInput
          label="Marca"
          value={simulation.brand}
          options={brand}
          onChange={(val) =>
            setSimulation({
              ...simulation,
              brand: val,
              model: "",
              year: "",
            })
          }
          width="25%"
        />
        <AutoCompleteInput
          label="Modelo"
          value={simulation.model}
          options={model}
          onChange={(val) =>
            setSimulation({
              ...simulation,
              model: val,
              year: "",
            })
          }
          width="50%"
        />
        <AutoCompleteInput
          label="Ano Modelo"
          value={simulation.year}
          options={year}
          onChange={(val) =>
            setSimulation({
              ...simulation,
              year: val,
            })
          }
          width="20%"
        />
      </Box>
    </Box>
  );
}

export default SimulationContent;
