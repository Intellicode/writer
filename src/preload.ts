// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  listFiles: () => ipcRenderer.invoke("files:list"),
  openFile: (path: string) => ipcRenderer.invoke("files:open", path),
  saveFile: (path: string, content: string) =>
    ipcRenderer.invoke("files:save", path, content),
});
