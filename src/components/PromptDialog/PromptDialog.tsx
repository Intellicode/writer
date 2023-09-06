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

interface PromptDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export default function PromptDialog({
  open,
  onClose,
  onSubmit,
}: PromptDialogProps) {
  const [prompt, setPrompt] = useState("");
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
      onSubmit(prompt);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} onKeyUp={handleKeyUp}>
      <DialogTitle>Generate text</DialogTitle>
      <DialogContent>
        <DialogContentText>What should the AI do for you?</DialogContentText>
        <TextField
          inputRef={ref}
          autoFocus
          margin="dense"
          id="prompt"
          label="Prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSubmit(prompt)}>Generate</Button>
      </DialogActions>
    </Dialog>
  );
}
