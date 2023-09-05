import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import { Toolbar, IconButton, Typography, Box } from "@mui/material";
import { Circle, File, FloppyDisk, Stack } from "@phosphor-icons/react";
import "./Header.css";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export function Header({ onSave, title, unsaved }) {
  return (
    <>
      <AppBar position="fixed" open={true} className="header">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onSave}
            edge="start"
          >
            <FloppyDisk size={16} />
          </IconButton>

          <Typography variant="body2" color="black">
            {title}
          </Typography>
          {unsaved && <Circle size={12} weight="fill" />}
        </Toolbar>
      </AppBar>
      {/* <Box className="header">
        <Stack direction="row">
          <File />
        </Stack>
      </Box>
      <Box className="header-spacer"></Box> */}
    </>
  );
}
