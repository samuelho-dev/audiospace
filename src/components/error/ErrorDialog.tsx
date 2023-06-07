import React from "react";

interface ErrorDialogProps {
  errorState: string | null;
}

function ErrorDialog({ errorState }: ErrorDialogProps) {
  return (
    <dialog
      open={!!errorState}
      className="sticky top-0 w-full rounded-sm bg-zinc-800 opacity-90"
    >
      <h1>Oops!</h1>
      <p className="text-red-400">{errorState}</p>
    </dialog>
  );
}

export default ErrorDialog;
