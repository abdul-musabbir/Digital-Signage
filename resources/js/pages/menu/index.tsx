import React from 'react';
import FileUploader from './components/file-uploader';
import ProfessionalFileCards from './components/menu-files';
import { AuthenticatedLayout } from '@/layouts';
import { usePage } from '@inertiajs/react';

import { Main } from '@/components/layout/main';

// Type definitions
interface FileItem {
    id: string | number;
    name: string;
    type: 'image' | 'video' | 'file';
    google_drive_url?: string;
    google_drive_id: string;
    size: number;
    created_at: string;
    extension?: string;
}

interface Menu {
    id: string | number;
    name: string;
    menus: FileItem[];
}

interface User {
    id: number;
    name: string;
    email: string;
    [key: string]: any;
}

interface PageProps extends Record<string, any> {
    auth: {
        user: User;
    };
    menus: Menu[];
}

const Menu: React.FC = () => {
    // Parse user list with proper typing
    const { menus } = usePage<PageProps>().props;

    return (
        <AuthenticatedLayout title="Menu">
            <Main>
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Menu</h2>
                        <p className="text-muted-foreground">Manage your menu here.</p>
                    </div>
                </div>
                <div>
                    <FileUploader />
                </div>
                <div className="flex flex-col gap-10">
                    {menus.map((menu) => (
                        <ProfessionalFileCards key={menu.id} menu={menu} />
                    ))}
                </div>
            </Main>
        </AuthenticatedLayout>
    );
};

export default Menu;
