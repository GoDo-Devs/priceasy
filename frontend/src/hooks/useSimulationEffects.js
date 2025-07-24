import { useEffect, useState } from "react";
import useHttp from "@/services/useHttp.js";
import { useSimulation } from "@/contexts/SimulationContext.jsx";
import { useSearchParams } from "react-router";

export default function useSimulationEffects() {
  const { simulation, setSimulation, client, setClient } = useSimulation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(true);

  const [vehicleType, setVehicleType] = useState([]);
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [year, setYear] = useState([]);
  const [priceTableNames, setPriceTableNames] = useState([]);
  const [plans, setPlans] = useState([]);
  const [rangeDetails, setRangeDetails] = useState({});

  useEffect(() => {
    useHttp
      .get(`/vehicle-types`)
      .then((res) => setVehicleType(res.data.vehicleTypes))
      .catch((err) =>
        console.error("Erro ao carregar categorias do veículo:", err)
      );
  }, []);

  useEffect(() => {
    setBrand([]);
    setModel([]);
    setYear([]);

    if (simulation.vehicle_type_id && simulation.vehicle_type_id !== 4) {
      useHttp
        .post(`/fipe/brands`, { vehicleType: simulation.vehicle_type_id })
        .then((res) => {
          const options = res.data.brands.map((brand) => ({
            value: brand.id,
            label: brand.name,
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
    setSimulation((prev) => ({ ...prev, model_id: "", year: "" }));

    if (
      simulation.vehicle_type_id &&
      simulation.brand_id &&
      simulation.vehicle_type_id !== 4
    ) {
      useHttp
        .post(`/fipe/models`, {
          vehicleType: simulation.vehicle_type_id,
          brandCode: simulation.brand_id,
        })
        .then((res) => {
          const options = res.data.models.map((model) => ({
            value: model.id,
            label: model.name,
          }));
          setModel(options);
        })
        .catch((err) =>
          console.error("Erro ao carregar modelos do veículo:", err)
        );
    }
  }, [simulation.brand_id]);

  useEffect(() => {
    setYear([]);
    setSimulation((prev) => ({ ...prev, year: "" }));

    if (
      simulation.vehicle_type_id &&
      simulation.brand_id &&
      simulation.model_id &&
      simulation.vehicle_type_id !== 4
    ) {
      useHttp
        .post(`/fipe/years`, {
          vehicleType: simulation.vehicle_type_id,
          brandCode: simulation.brand_id,
          modelCode: simulation.model_id,
        })
        .then((res) => {
          const options = res.data.years.map((year) => ({
            value: year.year,
            label: year.year === "32000" ? "Zero KM" : year.year,
            fuel: year.fuel,
          }));
          setYear(options);
        })
        .catch((err) =>
          console.error("Erro ao carregar anos do veículo:", err)
        );
    }
  }, [simulation.model_id]);

  useEffect(() => {
    const { brand_id, model_id, year, fuel, vehicle_type_id } = simulation;

    if (!brand_id || !model_id || !year || vehicle_type_id === 4) {
      setSimulation((prev) => ({
        ...prev,
        protectedValue: "",
      }));
      return;
    }

    if (brand_id && model_id && year && fuel && vehicle_type_id !== 4) {
      useHttp
        .post(`/fipe/price`, {
          vehicleType: Number(vehicle_type_id),
          brandCode: Number(brand_id),
          modelCode: Number(model_id),
          modelYear: Number(year),
          fuelType: Number(fuel),
        })
        .then((res) => {
          const rawValue = res.data.consultResult.Valor;
          const numericValue = Number(
            rawValue
              .replace("R$", "")
              .replace(/\./g, "")
              .replace(",", ".")
              .trim()
          );

          setSimulation((prev) => ({
            ...prev,
            protectedValue: numericValue,
            fipeValue: numericValue,
            fipeCode: res.data.consultResult.CodigoFipe,
            name: res.data.consultResult.Modelo,
          }));
        })
        .catch((err) => {
          console.error("Erro ao carregar o preço do veículo:", err);
          setSimulation((prev) => ({
            ...prev,
            protectedValue: "",
          }));
        });
    }
  }, [
    simulation.brand_id,
    simulation.model_id,
    simulation.year,
    simulation.fuel,
  ]);

  useEffect(() => {
    if (simulation.vehicle_type_id === 4) {
      useHttp
        .post("/price-tables/filter", { vehicle_type_id: 4 })
        .then((res) => {
          const options = (res.data.priceTables || []).map((table) => ({
            value: table.id,
            label: table.name,
          }));
          setPriceTableNames(options);
        })
        .catch(console.error);
    } else if (simulation.model_id) {
      useHttp
        .post("/price-tables/filter", { model: simulation.model_id })
        .then((res) => {
          const options = (res.data.priceTables || []).map((table) => ({
            value: table.id,
            label: table.name,
          }));
          setPriceTableNames(options);
        })
        .catch(console.error);
    } else {
      setPriceTableNames([]);
    }
  }, [simulation.model_id, simulation.vehicle_type_id]);

  useEffect(() => {
    if (
      simulation.fipeValue &&
      (simulation.protectedValue === undefined ||
        simulation.protectedValue === "")
    ) {
      setSimulation((prev) => ({
        ...prev,
        protectedValue: simulation.fipeValue,
      }));
    }
  }, [simulation.fipeValue]);

  useEffect(() => {
    if (
      simulation.price_table_id !== null &&
      simulation.price_table_id !== undefined &&
      simulation.protectedValue
    ) {
      if (simulation.vehicle_type_id === 4) {
        const vehiclePriceNumber =
          typeof simulation.protectedValue === "number"
            ? simulation.protectedValue
            : Number(
                String(simulation.protectedValue)
                  .replace(/[^\d,.-]/g, "")
                  .replace(".", "")
                  .replace(",", ".")
              );

        const payload = {
          price_table_id: simulation.price_table_id,
          vehiclePrice: vehiclePriceNumber,
          vehicle_type_id: simulation.vehicle_type_id,
        };

        useHttp
          .post("/price-tables/plans", payload)
          .then((res) => {
            setPlans(res.data.plans || []);
            setRangeDetails(res.data.rangeDetails || {});
          })
          .catch((err) => console.error("Erro ao carregar planos:", err));
      } else {
        if (simulation.model_id && simulation.year && simulation.brand_id) {
          const vehiclePriceNumber =
            typeof simulation.protectedValue === "number"
              ? simulation.protectedValue
              : Number(
                  String(simulation.protectedValue)
                    .replace(/[^\d,.-]/g, "")
                    .replace(".", "")
                    .replace(",", ".")
                );

          const payload = {
            price_table_id: simulation.price_table_id,
            vehiclePrice: vehiclePriceNumber,
            model_id: simulation.model_id,
            vehicle_type_id: simulation.vehicle_type_id,
          };

          useHttp
            .post("/price-tables/plans", payload)
            .then((res) => {
              setPlans(res.data.plans || []);
              setRangeDetails(res.data.rangeDetails || {});
            })
            .catch((err) => console.error("Erro ao carregar planos:", err));
        } else {
          setPlans([]);
        }
      }
    } else {
      setPlans([]);
    }
  }, [
    simulation.price_table_id,
    simulation.protectedValue,
    simulation.model_id,
    simulation.year,
    simulation.brand_id,
    simulation.vehicle_type_id,
  ]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await useHttp.get(`/simulations/${id}`);
        const sim = res.data;

        const selectedProducts = Array.isArray(sim.selectedProducts)
          ? Object.fromEntries(
              sim.selectedProducts.map((p) => [p.product_id, p.quantity])
            )
          : {};

        setSimulation({
          user_id: sim.user_id,
          id: sim.id,
          fipeCode: sim.fipeCode,
          fipeValue: sim.fipeValue,
          name: sim.name,
          vehicle_type_id: sim.vehicle_type_id,
          brand_id: sim.brand_id,
          model_id: sim.model_id,
          year: sim.year,
          price_table_id: sim.price_table_id,
          protectedValue: sim.protectedValue,
          selectedProducts,
          plan_id: sim.plan_id,
          monthlyFee: sim.monthlyFee,
          implementList: sim.implementList || [],
          discountedAccession: sim.discountedAccession,
          discountedAccessionCouponId: sim.discountedAccessionCouponId,
          discountedMonthlyFee: sim.discountedMonthlyFee,
          discountedMonthlyFeeCouponId: sim.discountedMonthlyFeeCouponId,
          discountedInstallationPrice: sim.discountedInstallationPrice,
          discountedInstallationPriceCouponId:
            sim.discountedInstallationPriceCouponId,
          valueSelectedProducts: sim.valueSelectedProducts ?? null,
        });

        if (sim.client_id) {
          const resClient = await useHttp.get(`/clients/${sim.client_id}`);
          setClient({
            name: resClient.data.name,
            cpf: resClient.data.cpf,
            phone: resClient.data.phone,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar simulação:", err);
        setLoading(false);
      }
    })();
  }, [id]);

  const saveSimulation = async (simulation, rangeDetails) => {
    try {
      let clientId = null;

      const { name, cpf, phone } = client || {};
      if (!name || !cpf || !phone) {
        throw new Error(
          "Dados do cliente incompletos. Preencha nome, CPF e telefone."
        );
      }

      if (!simulation.id) {
        try {
          const { data } = await useHttp.post("/clients/cpf", { cpf });
          clientId = data.id;
        } catch (err) {
          if (err.response?.status === 404) {
            const { data } = await useHttp.post("/clients/create", {
              name,
              cpf,
              phone,
            });
            clientId = data.client.id;
            await new Promise((r) => setTimeout(r, 200));
          } else {
            throw err;
          }
        }
      }

      const selectedProductsArray = Object.entries(
        simulation.selectedProducts || {}
      ).map(([product_id, quantity]) => ({
        product_id: Number(product_id),
        quantity,
      }));

      const simulationPayload = {
        user_id: simulation.user_id,
        fipeCode: simulation.fipeCode,
        fipeValue: simulation.fipeValue,
        name: simulation.name,
        vehicle_type_id: simulation.vehicle_type_id,
        brand_id: Number(simulation.brand_id),
        model_id: Number(simulation.model_id),
        year: Number(simulation.year),
        price_table_id: simulation.price_table_id,
        protectedValue: simulation.protectedValue,
        plan_id: simulation.plan_id,
        monthlyFee: simulation.monthlyFee,
        selectedProducts: selectedProductsArray,
        implementList: simulation.implementList || [],
        discountedAccession: simulation.discountedAccession,
        discountedAccessionCouponId: simulation.discountedAccessionCouponId,
        discountedMonthlyFee: simulation.discountedMonthlyFee,
        discountedMonthlyFeeCouponId: simulation.discountedMonthlyFeeCouponId,
        discountedInstallationPrice: simulation.discountedInstallationPrice,
        discountedInstallationPriceCouponId:
          simulation.discountedInstallationPriceCouponId,
        valueSelectedProducts: simulation.valueSelectedProducts ?? null,
      };

      if (!simulation.id) {
        simulationPayload.client_id = clientId;
        const { data } = await useHttp.post(
          "/simulations/create",
          simulationPayload
        );
        return data;
      } else {
        await useHttp.put(`/simulations/${simulation.id}`, simulationPayload);
        return { id: simulation.id };
      }
    } catch (err) {
      console.error("Erro ao salvar a simulação:", err);
      return false;
    }
  };

  return {
    vehicleType,
    brand,
    model,
    year,
    priceTableNames,
    plans,
    rangeDetails,
    saveSimulation,
    loading,
    client,
  };
}
