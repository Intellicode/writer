// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  listFiles: () => ipcRenderer.invoke("files:list"),
  openFile: (path: string) => ipcRenderer.invoke("files:open", path),
  saveFile: (path: string, content: string) =>
    ipcRenderer.invoke("files:save", path, content),
  newFile: (path: string, templatePath: string) =>
    ipcRenderer.invoke("files:new", path, templatePath),
  generateOllamaText: function generateOllamaText(
    text: string,
    onText: (text: string) => void
  ) {
    ipcRenderer.send("ollama:generateText", text);

    ipcRenderer.on(
      "ollama:generatedText",
      (event: IpcRendererEvent, text: string) => {
        text === "--end--" ? unSubscribe() : onText(text);
      }
    );
    const unSubscribe = () => {
      ipcRenderer.removeAllListeners("ollama:generatedText");
    };
  },
  generateOpenAIText: () => ipcRenderer.invoke("openai:generateText"),
  listTemplates: () => ipcRenderer.invoke("templates:list"),
  loadTemplate: (path: string) => ipcRenderer.invoke("templates:load", path),
});
