import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { NavLink, useLocation } from "react-router";

function ListLink({ Icon, path, title }) {
  const router = useLocation();

  const active = path === router.pathname;

  return (
    <Stack direction="row">
      <ListItem
        sx={
          active && {
            backgroundColor: "primary.main",
            pointerEvents: "none",
            borderRadius: "20px 0px 0px 20px",
          }
        }
        className="my-1"
        key={path}
        disablePadding
      >
        <ListItemButton
          component={NavLink}
          to={path}
          sx={{ borderRadius: "20px 0px 0px 20px" }}
        >
          <div className="flex">
            <Icon
              color={active ? "white" : "primary"}
              className="mt-0.5 me-3"
            />
            <ListItemText primary={title} />
          </div>
        </ListItemButton>
      </ListItem>
    </Stack>
  );
}

export default ListLink;
