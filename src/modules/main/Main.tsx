import { Box, Drawer, styled } from "@mui/material";
import { Header } from "../../components/Header/Header";
import { KeyboardEvent, useContext, useState } from "react";

import { FileExplorer } from "../../components/FileExplorer/FileExplorer";
import "./Main.css";
import PromptDialog from "../../components/PromptDialog/PromptDialog";
import { usePromptDialog } from "../../components/PromptDialog/PromptDialog.hooks";
import SaveNotification from "../../components/Notifications/SaveNotification";
import Editor from "../../components/Editor/Editor";
import { useGenerateText } from "../../hooks/ai";
import { EditorContext } from "../../components/Editor/EditorContext";

const drawerWidth = 240;

const MainContainer = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  border: "none",
  boxShadow: "none",
  justifyContent: "flex-end",
  height: "48px",
}));

export function Main() {
  const [value, setValue] = useState("");
  const [filePath, setFilePath] = useState("");
  const [originalValue, setOriginalValue] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const { insertTextAtCursor } = useContext(EditorContext);

  const { generateText } = useGenerateText(insertTextAtCursor);

  const handleSelect = async (path: string) => {
    const text = await window.electronAPI.openFile(path);
    setFilePath(path);
    setValue(text);
    setOriginalValue(text);
  };

  const handleSave = () => {
    window.electronAPI.saveFile(filePath, value);
    setShowSaved(true);
    setOriginalValue(value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "s" && e.metaKey) {
      handleSave();
    }
  };

  const handleSaveNotificationClose = () => {
    setShowSaved(false);
  };

  const {
    open: dialogOpen,
    openDialog,
    onClose,
    onSubmit,
  } = usePromptDialog(generateText);

  const handleInsertText = () => {
    openDialog();
  };

  const [sideBarOpen, setSideBarOpen] = useState(true);

  return (
    <Box className="container">
      <Header
        onSave={handleSave}
        title={filePath}
        unsaved={originalValue !== value}
        onInsertText={handleInsertText}
        open={sideBarOpen}
        onSideBarToggle={() => setSideBarOpen((prev) => !prev)}
      />
      <PromptDialog onClose={onClose} open={dialogOpen} onSubmit={onSubmit} />
      <SaveNotification
        open={showSaved}
        onClose={handleSaveNotificationClose}
      />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={sideBarOpen}
      >
        <DrawerHeader />
        <FileExplorer onSelect={handleSelect} />
      </Drawer>
      <MainContainer open={sideBarOpen} onKeyDown={handleKeyDown}>
        <DrawerHeader />
        <Editor content={value} onChange={setValue} />
      </MainContainer>
    </Box>
  );
}
