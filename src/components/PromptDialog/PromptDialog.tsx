import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";

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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Generate text</DialogTitle>
      <DialogContent>
        <DialogContentText>What should the AI do for you?</DialogContentText>
        <TextField
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
