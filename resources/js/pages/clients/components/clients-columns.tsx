import { User } from '../data/schema';
import DataTableRowActions from './data-table-row-actions';
import { ColumnDef } from '@tanstack/react-table';
import { User2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';

import LongText from '@/components/long-text';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';

export const userTypes = [
    {
        value: 'customer',
        label: 'Customer',
        icon: User2Icon,
    },
    {
        value: 'admin',
        label: 'Admin',
        icon: User2Icon,
    },
];

export const columns: ColumnDef<User>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        meta: {
            className: cn(
                'sticky left-0 z-10 rounded-tl md:table-cell',
                'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
            ),
        },
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => {
            return <LongText className="max-w-36">{row.getValue('name')}</LongText>;
        },
        meta: { className: 'w-36' },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
        cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'phoneNumber',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Phone Number" />,
        cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
        enableSorting: false,
    },
    {
        accessorKey: 'role',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
        cell: ({ row }) => {
            const role = row.getValue('role') as string;
            const userType = userTypes.find(({ value }) => value === role);

            if (!userType) return null;

            return (
                <div className="flex items-center gap-x-2">
                    {userType.icon && <userType.icon size={16} className="text-muted-foreground" />}
                    <span className="text-sm capitalize">{userType.label}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'address',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
        cell: ({ row }) => {
            return <div className="flex space-x-2">{row.getValue('address')}</div>;
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableHiding: false,
        enableSorting: false,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
