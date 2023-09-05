import { createRoot } from "react-dom/client";
import { Main } from "./modules/main/Main";
import { IconContext } from "@phosphor-icons/react";
import { CssBaseline } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import React from "react";
import "./utils/monacoFix";
const domNode = document.getElementById("root");
const root = createRoot(domNode);

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
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
    </StyledEngineProvider>
  </React.StrictMode>
);
