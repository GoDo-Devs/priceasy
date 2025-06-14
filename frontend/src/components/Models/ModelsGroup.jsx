import {
  Box,
  FormControlLabel,
  Checkbox,
  FormGroup,
  CircularProgress,
} from "@mui/material";

function ModelsGroup({ models = [], priceTable, setPriceTable, loading }) {
  const modelsFromTable = priceTable.models || [];
  const modelsValue = modelsFromTable.map((b) => Number(b.Value));

  const handleCheckboxChange = (event) => {
    const checkboxValue = Number(event.target.value);
    const { checked } = event.target;

    let updatedModels;

    if (checked) {
      const selected = models.find(
        (model) => Number(model.Value) === checkboxValue
      );
      updatedModels = [...modelsFromTable, selected].filter(
        (model, index, self) =>
          index === self.findIndex((m) => m.Value === model.Value)
      );
    } else {
      updatedModels = modelsFromTable.filter(
        (model) => Number(model.Value) !== checkboxValue
      );
    }

    setPriceTable((prev) => ({
      ...prev,
      models: updatedModels,
    }));
  };

  const handleSelectAllChange = (event) => {
    let updatedModels;

    if (event.target.checked) {
      updatedModels = [...modelsFromTable, ...models].filter(
        (model, index, self) =>
          index === self.findIndex((m) => m.Value === model.Value)
      );
    } else {
      const currentModelValues = models.map((m) => m.Value);
      updatedModels = modelsFromTable.filter(
        (model) => !currentModelValues.includes(model.Value)
      );
    }

    setPriceTable((prev) => ({
      ...prev,
      models: updatedModels,
    }));
  };

  const allSelected =
    models.length > 0 &&
    models.every((model) =>
      modelsFromTable.some((m) => m.Value === model.Value)
    );

  const isIndeterminate =
    models.length > 0 &&
    models.some((model) =>
      modelsFromTable.some((m) => m.Value === model.Value)
    ) &&
    !allSelected;

  return (
    <Box
      sx={{
        width: "100%",
        height: "65vh",
        borderRadius: "8px",
        overflowY: "scroll",
        bgcolor: "transparent",
        left: "50vw",
        top: 200,
      }}
    >
      {loading ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={100} />
        </Box>
      ) : (
        <>
          <FormControlLabel
            control={
              <Checkbox
                checked={allSelected}
                indeterminate={isIndeterminate}
                onChange={handleSelectAllChange}
              />
            }
            label="Selecionar todos"
          />
          <FormGroup sx={{ flexDirection: "column" }}>
            {models.map((model) => (
              <FormControlLabel
                key={model.Value}
                control={
                  <Checkbox
                    value={model.Value}
                    checked={modelsValue.includes(Number(model.Value))}
                    onChange={handleCheckboxChange}
                  />
                }
                label={model.Label}
                sx={{ width: "100%" }}
              />
            ))}
          </FormGroup>
        </>
      )}
    </Box>
  );
}

export default ModelsGroup;
