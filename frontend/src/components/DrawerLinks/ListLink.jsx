import { ListItem, ListItemButton, ListItemText, Box } from "@mui/material";
import { NavLink } from "react-router-dom";

function ListLink({ Icon, path, title }) {
  const handleClick = (e) => {
    if (path === "/cotacao") {
      e.preventDefault();
      window.location.href = path;
    }
  };

  return (
    <NavLink
      to={path}
      end={false}
      style={{ textDecoration: "none", width: "100%", display: "block" }}
      onClick={handleClick}
    >
      {({ isActive }) => (
        <ListItem sx={{ px: 1, py: 0.25 }} disablePadding>
          <ListItemButton
            sx={{
              position: "relative",
              borderRadius: 2,
              gap: 1.5,
              py: 1,
              pl: 2,
              color: isActive ? "secondary.main" : "text.secondary",
              backgroundColor: isActive
                ? "rgba(127,201,168,0.12)"
                : "transparent",
              pointerEvents: isActive ? "none" : "auto",
              "&:hover": {
                backgroundColor: isActive
                  ? "rgba(127,201,168,0.12)"
                  : "rgba(44,74,107,0.35)",
                color: isActive ? "secondary.main" : "text.primary",
              },
              "&::before": isActive
                ? {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 8,
                    bottom: 8,
                    width: 3,
                    borderRadius: 3,
                    backgroundColor: "secondary.main",
                  }
                : {},
            }}
          >
            <Box
              component={Icon}
              sx={{ fontSize: 20, color: "inherit" }}
            />
            <ListItemText
              primary={title}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
              }}
            />
          </ListItemButton>
        </ListItem>
      )}
    </NavLink>
  );
}

export default ListLink;
