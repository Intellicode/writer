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
  useTheme,
} from "@mui/material";
import { Header } from "../../components/header/Header";
import { KeyboardEvent, useEffect, useState } from "react";
import * as monaco from "monaco-editor";
import Editor, { loader } from "@monaco-editor/react";

import { FileExplorer } from "../../components/file-explorer/FileExplorer";
import "./Main.css";

loader.config({ monaco });
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

function setEditorTheme(monaco: any) {
  monaco.editor.defineTheme("onedark", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {},
  });
}

export function Main() {
  const [value, setValue] = useState("");
  const [filePath, setFilePath] = useState("");
  const [originalValue, setOriginalValue] = useState("");
  const doAction = async () => {
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

  const [monacoInstance, setMonacoInstance] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleOnMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    setMonacoInstance(editor);
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
  const [prompt, setPrompt] = useState("");
  const handleDialogClose = () => setDialogOpen(false);

  const handlePrompt = () => {
    setDialogOpen(false);
    doAction();
    setPrompt("");
  };

  return (
    <Box className="container">
      <Header
        onSave={handleSave}
        title={filePath}
        unsaved={originalValue !== value}
        onInsertText={handleInsertText}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Generate text</DialogTitle>
        <DialogContent>
          <DialogContentText>What should the AI do for you?</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="prompt"
            label="Prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handlePrompt}>Generate</Button>
        </DialogActions>
      </Dialog>
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
        <Box className="editor">
          <Editor
            defaultLanguage="markdown"
            defaultValue="// some comment"
            value={value}
            onChange={setValue}
            theme="onedark"
            options={{
              automaticLayout: true,
              fontFamily: "Monaco",
              fontSize: 16,
              wordWrap: "on",
            }}
            beforeMount={setEditorTheme}
            onMount={handleOnMount}
          />
        </Box>
      </MainContainer>
    </Box>
  );
}
