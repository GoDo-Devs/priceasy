import { ListItem, ListItemButton, ListItemText, Stack } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

function ListLink({ Icon, path, title }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (path === "/cotacao") {
      e.preventDefault(); 
      window.location.href = path; 
    }
  };

  return (
    <Stack direction="row">
      <NavLink
        to={path}
        end={false}
        style={({ isActive }) => ({
          textDecoration: "none",
          width: "100%",
        })}
        onClick={handleClick}
      >
        {({ isActive }) => (
          <ListItem
            sx={
              isActive
                ? {
                    backgroundColor: "primary.main",
                    pointerEvents: "none",
                    borderRadius: "20px 0px 0px 20px",
                  }
                : undefined
            }
            className="my-1"
            disablePadding
          >
            <ListItemButton sx={{ borderRadius: "20px 0px 0px 20px" }}>
              <div className="flex justify-between items-center">
                <Icon
                  color={isActive ? "white" : "primary"}
                  className="mt-0.5 me-3"
                />
                <ListItemText primary={title} />
              </div>
            </ListItemButton>
          </ListItem>
        )}
      </NavLink>
    </Stack>
  );
}

export default ListLink;
