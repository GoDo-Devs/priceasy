import { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  InputBase,
  IconButton,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

function SidebarLinks({ options = [], onSelect }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [search, setSearch] = useState("");
  const [triggeredSearch, setTriggeredSearch] = useState("");

  const handleSelect = (item) => {
    setSelectedValue(item.value);
    onSelect(item);
  };

  const handleSearch = () => {
    setTriggeredSearch(search);
  };

  const handleClear = () => {
    setSearch("");
    setTriggeredSearch("");
  };

  const filteredOptions = options.filter((item) =>
    item.label.toLowerCase().includes(triggeredSearch.toLowerCase())
  );

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
      <Box p={1}>
        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "transparent",
            borderBottom: "1px solid",
            borderColor: (theme) => theme.palette.divider,
            pl: 1,
            pr: 1,
            borderRadius: 0,
          }}
        >
          <InputBase
            placeholder="Pesquisar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: 1,
              color: "inherit",
            }}
          />
          {search && (
            <IconButton onClick={handleClear} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            onClick={handleSearch}
            type="submit"
            sx={{ color: "primary.main" }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      <List>
        {filteredOptions.map((item) => {
          const isSelected = item.value === selectedValue;
          return (
            <ListItemButton
              key={item.value}
              onClick={() => handleSelect(item)}
              sx={{
                height: "30px",
                backgroundColor: isSelected ? "primary.main" : "transparent",
                pointerEvents: isSelected ? "none" : "auto",
                borderRadius: "20px 0px 0px 20px",
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
