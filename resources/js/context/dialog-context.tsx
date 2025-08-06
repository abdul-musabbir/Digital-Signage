import React, { createContext, useContext, useState } from 'react';
import useDialogState from '@/hooks/use-dialog-state';

// Generic dialog context type
interface DialogContextType<TDialogType extends string, TRowType> {
    open: TDialogType | null;
    setOpen: (str: TDialogType | null) => void;
    currentRow: TRowType | null;
    setCurrentRow: React.Dispatch<React.SetStateAction<TRowType | null>>;
}

// Generic dialog provider props
interface DialogProviderProps {
    children: React.ReactNode;
}

// Factory function to create dialog context and provider
export function createDialogContext<TDialogType extends string, TRowType>(contextName: string = 'Dialog') {
    const DialogContext = createContext<DialogContextType<TDialogType, TRowType> | null>(null);

    function DialogProvider({ children }: DialogProviderProps) {
        const [open, setOpen] = useDialogState<TDialogType>(null);
        const [currentRow, setCurrentRow] = useState<TRowType | null>(null);

        return <DialogContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</DialogContext.Provider>;
    }

    function useDialog() {
        const dialogContext = useContext(DialogContext);

        if (!dialogContext) {
            throw new Error(`useDialog has to be used within <${contextName}Provider>`);
        }

        return dialogContext;
    }

    return {
        DialogProvider,
        useDialog,
        DialogContext,
    };
}
