import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  Snackbar,
  TextField,
  styled,
} from "@mui/material";
import { Header } from "../../components/Header/Header";
import { KeyboardEvent, useState } from "react";

import { FileExplorer } from "../../components/FileExplorer/FileExplorer";
import "./Main.css";
import PromptDialog from "../../components/PromptDialog/PromptDialog";

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
  const doAction = async (prompt: string) => {
    const result = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      body: JSON.stringify({
        model: "llama2",
        prompt,
      }),
    });
    const td = new TextDecoder("utf-8");
    const reader = result.body.getReader();
    console.log("got result");
    while (true) {
      const { done, value } = await reader.read();
      try {
        const json = JSON.parse(td.decode(value));
        if (json["response"] !== undefined) {
          insertText(json["response"]);
          console.log("inserting");
        }
      } catch (e) {
        // nothing
        console.log("error");
      }

      if (done) {
        // Do something with last chunk of data then exit reader
        return;
      }
      // Otherwise do something here to process current chunk
    }
  };

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
  const [showSaved, setShowSaved] = useState(false);
  const handleSaveNotificationClose = () => {
    setShowSaved(false);
  };

  const insertText = (text: string) => {
    if (monacoInstance) {
      const selection = monacoInstance.getSelection();
      const id = { major: 1, minor: 1 };
      const op = {
        identifier: id,
        range: {
          startLineNumber: selection?.selectionStartLineNumber || 1,
          startColumn: selection?.selectionStartColumn || 1,
          endLineNumber: selection?.endLineNumber || 1,
          endColumn: selection?.endColumn || 1,
        },
        text,
        forceMoveMarkers: true,
      };
      monacoInstance.executeEdits("my-source", [op]);
    }
  };

  const handleInsertText = () => {
    setDialogOpen(true);
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => setDialogOpen(false);

  const handlePrompt = (prompt: string) => {
    setDialogOpen(false);
    doAction(prompt);
  };

  return (
    <Box className="container">
      <Header
        onSave={handleSave}
        title={filePath}
        unsaved={originalValue !== value}
        onInsertText={handleInsertText}
      />
      <PromptDialog
        onClose={handleDialogClose}
        open={dialogOpen}
        onSubmit={handlePrompt}
      />
      <Snackbar
        open={showSaved}
        autoHideDuration={6000}
        onClose={handleSaveNotificationClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleSaveNotificationClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Saved!
        </Alert>
      </Snackbar>
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
        open={true}
      >
        <DrawerHeader />
        <FileExplorer onSelect={handleSelect} />
      </Drawer>
      <MainContainer open={true} onKeyDown={handleKeyDown}>
        <DrawerHeader />
      </MainContainer>
    </Box>
  );
}
