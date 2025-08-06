// context/clients-context.tsx

import { Client } from '../types/client';
import { createDialogContext } from '@/context/dialog-context';

export type ClientDialogType = 'invite' | 'add' | 'edit' | 'delete';

const { DialogProvider: ClientsProvider, useDialog: useClients } = createDialogContext<ClientDialogType, Client>('Clients');

export { ClientsProvider, useClients };
