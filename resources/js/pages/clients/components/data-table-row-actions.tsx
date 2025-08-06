import { useClients } from '../context/clients-context';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { IconEdit, IconTrash } from '@tabler/icons-react';

import DeleteClient from '@/lib/wayfinder/actions/App/Domains/Clients/Actions/DeleteClient';

import { ConfirmDialog, createDeleteActionConfig, useConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function DataTableRowActions({ row }: { row: any }) {
    const { dialogProps, openDialog } = useConfirmDialog();
    const { setOpen, setCurrentRow } = useClients();

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(row.original);
                            setOpen('edit');
                        }}
                    >
                        Edit
                        <DropdownMenuShortcut>
                            <IconEdit size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openDialog()} className="!text-red-500">
                        Delete
                        <DropdownMenuShortcut>
                            <IconTrash size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {row.original && (
                <>
                    <ConfirmDialog
                        {...dialogProps}
                        title="Delete Category"
                        desc={
                            <>
                                You are about to delete the note titled <strong>"{row.original.name}"</strong>
                                . <br />
                                This action cannot be undone.
                            </>
                        }
                        confirmText="Delete"
                        destructive
                        action={createDeleteActionConfig({
                            url: DeleteClient.url(row.original.id),
                            successMessage: 'Client deleted successfully',
                            errorMessage: 'Failed to delete client',
                        })}
                    />
                </>
            )}
        </>
    );
}
