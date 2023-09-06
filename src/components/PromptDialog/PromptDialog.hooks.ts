import { useState, useCallback } from "react";

export function usePromptDialog(onSubmit: (text: string) => void) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = useCallback(
    () => setDialogOpen(true),
    [setDialogOpen]
  );

  const handleDialogClose = useCallback(
    () => setDialogOpen(false),
    [setDialogOpen]
  );
  const handleSubmti = useCallback(
    (text: string) => {
      onSubmit(text);
      setDialogOpen(false);
    },
    [onSubmit]
  );

  return {
    open: dialogOpen,
    openDialog: handleDialogOpen,
    onClose: handleDialogClose,
    onSubmit: handleSubmti,
  };
}
