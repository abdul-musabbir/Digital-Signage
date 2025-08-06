import { ClientsDialogs } from './components/clients-dialogs';
import { ClientsPrimaryButtons } from './components/clients-primary-buttons';
import ClientsTable from './components/clients-table';
import { ClientsProvider } from './context/clients-context';
import { AuthenticatedLayout } from '@/layouts';

import { Main } from '@/components/layout/main';

export default function Clients() {
    return (
        <ClientsProvider>
            <AuthenticatedLayout title={'Clients'}>
                <Main>
                    <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Client List</h2>
                            <p className="text-muted-foreground">Manage your clients and their roles here.</p>
                        </div>
                        <ClientsPrimaryButtons />
                    </div>
                    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                        {/* <UsersTable data={userList} columns={columns} /> */}
                        <ClientsTable />
                    </div>
                </Main>

                <ClientsDialogs />
            </AuthenticatedLayout>
        </ClientsProvider>
    );
}
