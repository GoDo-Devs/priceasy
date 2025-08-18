import {
  Box,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import useGroupedModels from "@/hooks/useGroupedModels";

function ModelsGroup({ models = [], priceTable, setPriceTable, loading }) {
  const groupedModels = useGroupedModels(models);
  const modelsFromTable = priceTable.models || [];
  const modelsValue = modelsFromTable.map((b) => Number(b.id));
  const [openGroups, setOpenGroups] = useState({});
  const [allGroupsExpanded, setAllGroupsExpanded] = useState(false);

  const toggleGroup = (groupName) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const toggleAllGroups = () => {
    const newState = !allGroupsExpanded;
    const newOpenGroups = {};
    Object.keys(groupedModels).forEach((group) => {
      newOpenGroups[group] = newState;
    });
    setOpenGroups(newOpenGroups);
    setAllGroupsExpanded(newState);
  };

  const isModelSelected = (value) => modelsValue.includes(Number(value));

  const handleCheckboxChange = (event) => {
    const checkboxValue = Number(event.target.value);
    const { checked } = event.target;

    let updatedModels;

    if (checked) {
      const selected = models.find(
        (model) => Number(model.id) === checkboxValue
      );
      updatedModels = [...modelsFromTable, selected].filter(
        (model, index, self) =>
          index === self.findIndex((m) => m.id === model.id)
      );
    } else {
      updatedModels = modelsFromTable.filter(
        (model) => Number(model.id) !== checkboxValue
      );
    }

    setPriceTable((prev) => ({
      ...prev,
      models: updatedModels,
    }));
  };

  const handleSelectGroupChange = (groupName, groupModels, checked) => {
    let updatedModels;

    if (checked) {
      updatedModels = [...modelsFromTable, ...groupModels].filter(
        (model, index, self) =>
          index === self.findIndex((m) => m.id === model.id)
      );
    } else {
      const groupValues = groupModels.map((m) => m.id);
      updatedModels = modelsFromTable.filter(
        (model) => !groupValues.includes(model.id)
      );
    }

    setPriceTable((prev) => ({
      ...prev,
      models: updatedModels,
    }));
  };

  const handleSelectAll = (checked) => {
    const allModels = models;
    const updatedModels = checked
      ? [
          ...modelsFromTable,
          ...allModels.filter(
            (model) => !modelsFromTable.some((m) => m.id === model.id)
          ),
        ]
      : modelsFromTable.filter(
          (model) => !allModels.some((m) => m.id === model.id)
        );

    setPriceTable((prev) => ({
      ...prev,
      models: updatedModels,
    }));
  };

  return (
    <Box
      pt={1}
      sx={{
        width: "100%",
        height: "65vh",
        borderRadius: "8px",
        overflowY: "auto",
        bgcolor: "transparent",
        paddingRight: 1,
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
          {models.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid",
                borderColor: (theme) => theme.palette.divider,
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton size="small" onClick={toggleAllGroups}>
                  {allGroupsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <Typography variant="subtitle1">Selecionar todos</Typography>
              </Box>

              <Checkbox
                checked={
                  modelsFromTable.length > 0 &&
                  models.every((model) => isModelSelected(model.id))
                }
                indeterminate={
                  models.some((model) => isModelSelected(model.id)) &&
                  !models.every((model) => isModelSelected(model.id))
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </Box>
          )}

          {Object.entries(groupedModels).map(([groupName, groupModels]) => {
            const total = groupModels.length;
            const selectedCount = groupModels.filter((model) =>
              isModelSelected(model.id)
            ).length;

            const allGroupSelected = selectedCount === total;
            const someSelected = selectedCount > 0 && selectedCount < total;

            return (
              <Box
                key={groupName}
                sx={{
                  mb: 1,
                  borderBottom: "1px solid",
                  borderColor: (theme) => theme.palette.divider,
                  padding: 0,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Box
                    onClick={() => toggleGroup(groupName)}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <IconButton size="small">
                      {openGroups[groupName] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {groupName} ({selectedCount}/{total})
                    </Typography>
                  </Box>
                  <Checkbox
                    checked={allGroupSelected}
                    indeterminate={someSelected}
                    onChange={(e) =>
                      handleSelectGroupChange(
                        groupName,
                        groupModels,
                        e.target.checked
                      )
                    }
                  />
                </Box>
                <Collapse in={openGroups[groupName]}>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    {groupModels.map((model) => (
                      <FormControlLabel
                        key={model.id}
                        control={
                          <Checkbox
                            value={model.id}
                            checked={isModelSelected(model.id)}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label={model.name}
                        sx={{
                          width: "48%",
                          ml: 0,
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.85rem",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </>
      )}
    </Box>
  );
}

export default ModelsGroup;
