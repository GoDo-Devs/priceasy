import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";
import TextInput from "@/components/Form/TextInput.jsx";
import SelectInput from "@/components/Form/SelectInput.jsx";
import CheckBoxInput from "@/components/Form/CheckBoxInput.jsx";
import useHttp from "@/services/useHttp.js";

function ProductModal({
  open,
  product,
  setProduct,
  showNewGroupInput,
  handleGroupChange,
  onClose,
}) {
  const [groups, setGroups] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState({
    all: [],
    selected: [],
  });

  useEffect(() => {
    useHttp
      .get("/vehicle-types")
      .then((res) =>
        setVehicleTypes({
          all: res.data.vehicleTypes,
          selected: [],
        })
      )
      .catch((err) => console.error("Erro ao carregar grupos:", err));
  }, []);

  useEffect(() => {
    if (open) {
      useHttp
        .get("/product-groups")
        .then((res) => setGroups(res.data.productsGroups))
        .catch((err) => console.error("Erro ao carregar grupos:", err));
    }
  }, [open]);

  useEffect(() => {
    if (open && product.id) {
      useHttp
        .get(`/product-vehicle-types/${product.id}`)
        .then((res) => {
          const selectedTypes = Array.isArray(res.data) ? res.data : [];
          setVehicleTypes((prev) => ({
            ...prev,
            selected: selectedTypes,
          }));
        })
        .catch((err) => {
          console.error("Erro ao carregar tipos de veículo selecionados:", err);
          setVehicleTypes((prev) => ({
            ...prev,
            selected: [],
          }));
        });
    } else if (!product.id) {
      setVehicleTypes((prev) => ({
        ...prev,
        selected: [],
      }));
    }
  }, [open, product.id]);

  const handleVehicleTypeChange = (e) => {
    setVehicleTypes((prev) => ({
      ...prev,
      selected: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: product.name?.trim(),
      price: Number(product.price),
      product_group_id: product.product_group_id,
      vehicle_type_ids: vehicleTypes.selected,
    };

    if (showNewGroupInput && product.group_name?.trim()) {
      payload.group_name = product.group_name.trim();
    }

    try {
      if (product.id) {
        await useHttp.patch(`/products/${product.id}`, payload);
        console.log("Produto atualizado:", payload);
      } else {
        await useHttp.post("/products/create/", payload);
        console.log("Produto criado:", payload);
      }

      onClose();
    } catch (error) {
      console.error("Erro ao salvar o produto:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 8, padding: 1.5 } }}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <TextInput
          label="Nome do Produto"
          name="name"
          className="mb-5"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          required
        ></TextInput>
        <TextInput
          label="Preço"
          name="price"
          className="mb-5"
          type="number"
          value={product.price || ""}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          required
        ></TextInput>
        <SelectInput
          label="Selecione um Grupo de Produtos"
          name="product_group_id"
          className="mb-5"
          value={product.product_group_id}
          onChange={handleGroupChange}
          options={[
            { value: "Nenhum", label: "Nenhum" },
            { value: "new", label: "Criar novo Grupo de Produtos" },
            ...groups.map((g) => ({
              value: g.id,
              label: g.name,
            })),
          ]}
        />
        {showNewGroupInput && (
          <TextInput
            label="Novo Grupo de Produto"
            name="group_name"
            className="mb-5"
            value={product.group_name}
            onChange={(e) =>
              setProduct({
                ...product,
                group_name: e.target.value,
              })
            }
          />
        )}
        <CheckBoxInput
          label="Selecione um Tipo de Veículo"
          name="vehicle_type_ids"
          value={vehicleTypes.selected}
          onChange={handleVehicleTypeChange}
          options={vehicleTypes.all.map((g) => ({
            value: g.id,
            label: g.name,
          }))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          disabled={!product.name || !product.price}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductModal;
