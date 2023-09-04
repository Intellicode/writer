import {
  Box,
  Divider,
  Drawer,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { Header } from "../../components/header/Header";
import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import "./Main.css";
import { FileExplorer } from "../../components/file-explorer/FileExplorer";
const drawerWidth = 240;

const MainContainer = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
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
  const theme = useTheme();

  useEffect(() => {
    const doAction = async () => {
      const result = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify({
          model: "llama2",
          prompt:
            "Write a blog post in English about something interesting from wikipedia, use markdown for formatting",
        }),
      });
      const td = new TextDecoder("utf-8");
      const reader = result.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        try {
          const json = JSON.parse(td.decode(value));
          if (json["response"] !== undefined)
            setValue((v) => v + json["response"]);
        } catch (e) {
          // nothing
        }

        if (done) {
          // Do something with last chunk of data then exit reader
          return;
        }
        // Otherwise do something here to process current chunk
      }
    };
    //  doAction();
  }, []);

  const handleSelect = async (path) => {
    const text = await window.electronAPI.openFile(path);
    setFilePath(path);
    setValue(text);
  };

  const handleSave = () => {
    window.electronAPI.saveFile(filePath, value);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Header />
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
        <button onClick={handleSave}>Save</button>
        <FileExplorer onSelect={handleSelect} />
      </Drawer>
      <MainContainer open={true}>
        <DrawerHeader />
        <MDEditor
          className="editor"
          hideToolbar={true}
          value={value}
          preview="edit"
          onChange={setValue}
          height="100%"
        />
      </MainContainer>
    </Box>
  );
}
