import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";

interface NewFileDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (path: string, template: string) => void;
}

interface Template {
  name: string;
  path: string;
}

export default function NewFileDialog({
  open,
  onClose,
  onSubmit,
}: NewFileDialogProps) {
  const [path, setPath] = useState("");
  const [template, setTemplate] = useState<string>();
  const ref = useRef<HTMLInputElement>();
  const [options, setOptions] = useState<Template[]>([]);

  useEffect(() => {
    // Timeout is necessary as a workaround: https://github.com/mui/material-ui/issues/1594#issuecomment-272547735
    const timeout = setTimeout(() => {
      if (open) {
        ref.current.focus();
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [open]);

  useEffect(() => {
    async function listTemplates() {
      const templates = await window.electronAPI.listTemplates();
      setOptions(templates);
    }
    if (open) {
      listTemplates();
    }
  }, [open]);

  const handleKeyUp: KeyboardEventHandler = (e) => {
    if (e.key === "Enter") {
      onSubmit(path, template);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} onKeyUp={handleKeyUp}>
      <DialogTitle>Create new file</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={ref}
          autoFocus
          margin="dense"
          id="prompt"
          label="Relative path"
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          fullWidth
          variant="standard"
        />
        <Select
          onChange={(e) => setTemplate(e.target.value as string)}
          value={""}
        >
          {options.map((option) => (
            <MenuItem key={option.path} value={option.path}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSubmit(path, template)}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
