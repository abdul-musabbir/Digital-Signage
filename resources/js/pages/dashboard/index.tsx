import { AuthenticatedLayout } from '@/layouts';

import { Main } from '@/components/layout/main';

export default function Dashboard() {
    return (
        <>
            <AuthenticatedLayout title="Dashboard">
                <Main>
                    <div className="mb-2 flex items-center justify-between space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    </div>
                </Main>
            </AuthenticatedLayout>
        </>
    );
}
