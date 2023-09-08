import { TreeItem, TreeView } from "@mui/lab";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

interface FileTreeItem {
  path: string;
  name: string;
  isDirectory: boolean;
  entries: FileTreeItem[];
}

interface DirectoryProps {
  item: FileTreeItem;
  onSelect: (path: string) => void;
}

function Directory({ item, onSelect }: DirectoryProps) {
  return (
    <TreeItem
      nodeId={item.path}
      label={item.name}
      onClick={() => !item.isDirectory && onSelect && onSelect(item.path)}
      key={item.path}
    >
      {item.entries.map((item) => {
        if (item.isDirectory) {
          return <Directory item={item} onSelect={onSelect} key={item.path} />;
        }

        return (
          <TreeItem
            nodeId={item.path}
            label={item.name}
            key={item.path}
            onClick={() => onSelect && onSelect(item.path)}
          ></TreeItem>
        );
      })}
    </TreeItem>
  );
}

interface FileExplorerProps {
  onSelect: (path: string) => void;
}

export function FileExplorer({ onSelect }: FileExplorerProps) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function getFiles() {
      const files = await window.electronAPI.listFiles();
      setFiles(files);
    }
    const refresh = setInterval(getFiles, 3000);
    return () => clearInterval(refresh);
  }, []);

  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<CaretDown />}
      defaultExpandIcon={<CaretRight />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
    >
      {files.map((item) => (
        <Directory item={item} onSelect={onSelect} key={item.path} />
      ))}
    </TreeView>
  );
}
