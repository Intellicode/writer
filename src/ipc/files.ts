import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import os from "os";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { IpcMainInvokeEvent } from "electron";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function walk(dirPath: string): Promise<any> {
  return Promise.all(
    await readdir(dirPath, { withFileTypes: true }).then((entries) =>
      entries.map(async (entry) => {
        const childPath = join(dirPath, entry.name);
        return entry.isDirectory()
          ? {
              name: entry.name,
              path: childPath,
              entries: await walk(childPath),
              dir: dirPath,
              isDirectory: true,
            }
          : {
              name: entry.name,
              path: childPath,
              entries: [],
              dir: dirPath,
              isDirectory: false,
            };
      })
    )
  );
}

const directoryPath = path.join(os.homedir(), "/Notes");

export function handleRequestFiles() {
  return walk(directoryPath);
}

export async function handleOpenFile(event: IpcMainInvokeEvent, path: string) {
  const result = await fs.readFile(path, "utf-8");

  return result;
}

export async function handleSaveFile(
  event: IpcMainInvokeEvent,
  path: string,
  content: string
) {
  try {
    const result = await fs.writeFile(path, content, { encoding: "utf-8" });
    console.log("saved!");
    return result;
  } catch (e) {
    console.log(e);
  }
}

export async function handleNewFile(
  event: IpcMainInvokeEvent,
  filePath: string
) {
  try {
    const newFilePath = path.join(directoryPath, filePath);
    await fs.mkdir(path.dirname(newFilePath), { recursive: true });
    const result = await fs.writeFile(newFilePath, "", { encoding: "utf-8" });
    return result;
  } catch (e) {
    console.log(e);
  }
}
