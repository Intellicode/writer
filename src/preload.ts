// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  listFiles: () => ipcRenderer.invoke("files:list"),
  openFile: (path: string) => ipcRenderer.invoke("files:open", path),
  saveFile: (path: string, content: string) =>
    ipcRenderer.invoke("files:save", path, content),
  newFile: (path: string) => ipcRenderer.invoke("files:new", path),
  generateOllamaText: function generateOllamaText(
    text: string,
    onText: (text: string) => void
  ) {
    ipcRenderer.send("ollama:generateText", text);

    ipcRenderer.on(
      "ollama:generatedText",
      (event: IpcRendererEvent, text: string) => {
        console.log(text);
        text === "--end--" ? unSubscribe() : onText(text);
      }
    );
    const unSubscribe = () => {
      console.log("removed event listeners");
      ipcRenderer.removeAllListeners("ollama:generatedText");
    };
  },
  generateOpenAIText: () => ipcRenderer.invoke("openai:generateText"),
});
