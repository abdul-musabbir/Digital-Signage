import { useClients } from '../context/clients-context';
import { ClientsActionDialog } from './clients-action-dialog';

export function ClientsDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useClients();
    return (
        <>
            <ClientsActionDialog key="user-add" open={open === 'add'} onOpenChange={() => setOpen('add')} />

            {currentRow && (
                <>
                    <ClientsActionDialog
                        key={`user-edit-${currentRow.id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit');
                            setTimeout(() => {
                                setCurrentRow(null);
                            }, 500);
                        }}
                        currentRow={currentRow}
                    />
                </>
            )}
        </>
    );
}
