import { createRoot } from "react-dom/client";
import { Main } from "./modules/main/Main";
import { IconContext } from "@phosphor-icons/react";
import { CssBaseline } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import React from "react";
import "./utils/monacoFix";
import EditorContextProvider from "./components/Editor/EditorContext";
const domNode = document.getElementById("root");
const root = createRoot(domNode);

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <EditorContextProvider>
        <IconContext.Provider
          value={{
            color: "darkgray",
            size: 16,
            weight: "regular",
            mirrored: false,
          }}
        >
          <CssBaseline />
          <Main />
        </IconContext.Provider>
      </EditorContextProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
