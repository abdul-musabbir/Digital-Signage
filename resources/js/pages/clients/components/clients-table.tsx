import { columns } from './clients-columns';
import { usePage } from '@inertiajs/react';

import { DataTable } from '@/components/table/data-table';

export default function ClientsTable() {
    const props = usePage().props as any; // Quick type assertion
    const {
        clients: {
            paginatedResults: { data, links, total, current_page, per_page },
            activeFilters,
        },
    } = props;

    return (
        <div>
            <DataTable
                data={data}
                columns={columns}
                initialFilters={activeFilters}
                meta={{
                    links,
                    total,
                    current_page,
                    per_page,
                }}
                facetedFilter={{
                    filterInput: {
                        column: 'name',
                        title: 'Filter by name',
                        placeholder: 'Search by name',
                    },
                    filter: [
                        // {
                        //     column: '',
                        //     options: [
                        //         {
                        //             label: '',
                        //             value: '',
                        //             icon: User,
                        //         },
                        //     ],
                        //     title: '',
                        // },
                    ],
                }}
            />
        </div>
    );
}
