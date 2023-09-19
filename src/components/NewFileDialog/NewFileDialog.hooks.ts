import { useState, useCallback } from "react";

export function useNewFileDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = useCallback(
    () => setDialogOpen(true),
    [setDialogOpen]
  );

  const handleDialogClose = useCallback(
    () => setDialogOpen(false),
    [setDialogOpen]
  );
  const handleSubmti = useCallback((text: string, template: string) => {
    window.electronAPI.newFile(text, template);
    setDialogOpen(false);
  }, []);

  return {
    open: dialogOpen,
    openDialog: handleDialogOpen,
    onClose: handleDialogClose,
    onSubmit: handleSubmti,
  };
}
