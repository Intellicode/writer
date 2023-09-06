import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { Toolbar, IconButton, Typography } from "@mui/material";
import { Circle, FloppyDisk, Sidebar, TextAa } from "@phosphor-icons/react";
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

interface HeaderProps {
  onSave: () => void;
  onInsertText: () => void;
  title: string;
  unsaved: boolean;
  open: boolean;
  onSideBarToggle: () => void;
}

export function Header({
  onSave,
  title,
  unsaved,
  onInsertText,
  open,
  onSideBarToggle,
}: HeaderProps) {
  return (
    <>
      <AppBar position="fixed" open={open} className="header">
        <Toolbar>
          <IconButton color="inherit" onClick={onSideBarToggle} edge="start">
            <Sidebar size={16} />
          </IconButton>
          <IconButton color="inherit" onClick={onSave} edge="start">
            <FloppyDisk size={16} />
          </IconButton>
          <IconButton color="inherit" onClick={onInsertText} edge="start">
            <TextAa size={16} />
          </IconButton>

          <Typography variant="body2" color="black">
            {title}
          </Typography>
          {unsaved && <Circle size={12} weight="fill" />}
        </Toolbar>
      </AppBar>
    </>
  );
}
