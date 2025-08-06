import FileUploader from './components/file-uploader';
import ProfessionalFileCards from './components/menu-files';
import { UsersDialogs } from './components/users-dialogs';
import UsersProvider from './context/users-context';
import { AuthenticatedLayout } from '@/layouts';
import { usePage } from '@inertiajs/react';

import { Main } from '@/components/layout/main';

export default function Menu() {
    // Parse user list
    const { menus } = usePage().props;

    return (
        <UsersProvider>
            <AuthenticatedLayout title={'Menu'}>
                <Main>
                    <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Menu</h2>
                            <p className="text-muted-foreground">Manage your menu here.</p>
                        </div>
                        {/* <UsersPrimaryButtons /> */}
                    </div>
                    <div>
                        <FileUploader />
                    </div>
                    <div className="flex flex-col gap-10">
                        {menus.map((menu, index) => (
                            <ProfessionalFileCards key={index} menu={menu} />
                        ))}
                    </div>
                </Main>

                <UsersDialogs />
            </AuthenticatedLayout>
        </UsersProvider>
    );
}
