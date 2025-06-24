import { useState } from "react";
import { Box, List, ListItemButton, ListItemText } from "@mui/material";

function SidebarLinks({ options = [], onSelect }) {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleSelect = (item) => {
    setSelectedValue(item.value);
    onSelect(item);
  };

  return (
    <Box
      sx={{
        width: 250,
        height: "65vh",
        borderRadius: "8px",
        overflowY: "scroll",
        bgcolor: "transparent",
        left: "25vw",
        top: 200,
      }}
    >
      <List>
        {options.map((item) => {
          const isSelected = item.value === selectedValue;
          return (
            <ListItemButton
              key={item.value}
              onClick={() => handleSelect(item)}
              sx={{
                height: "30px",
                backgroundColor: isSelected ? "primary.main" : "transparent",
                pointerEvents: isSelected ? "none" : "auto",
                borderRadius: isSelected ? "20px 0px 0px 20px" : "20px 0px 0px 20px",
                color: isSelected ? "white" : "inherit",
                mb: 1,
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

export default SidebarLinks;
