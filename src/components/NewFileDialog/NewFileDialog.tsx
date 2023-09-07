import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";

interface NewFileDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export default function NewFileDialog({
  open,
  onClose,
  onSubmit,
}: NewFileDialogProps) {
  const [path, setPath] = useState("");
  const ref = useRef<HTMLInputElement>();

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

  const handleKeyUp: KeyboardEventHandler = (e) => {
    if (e.key === "Enter") {
      onSubmit(path);
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSubmit(path)}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
