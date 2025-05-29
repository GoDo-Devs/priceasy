import { Tooltip, Fab } from "@mui/material";

function ButtonFab({ title, onClick, Icon }) {
  return (
    <Tooltip title={title}>
      <Fab
        color="primary"
        aria-label={title}
        onClick={onClick}
        sx={{
          height: 50,
          width: 50,
          position: "fixed",
          bottom: 6,
          right: 7,
          zIndex: 1000,
        }}
      >
        <Icon />
      </Fab>
    </Tooltip>
  );
}

export default ButtonFab;
