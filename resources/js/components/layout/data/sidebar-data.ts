import { type SidebarData } from '../types';
import { IconChartBar, IconLayoutDashboard, IconSettings, IconUserCog, IconUsers } from '@tabler/icons-react';
import { TvMinimalPlayIcon } from 'lucide-react';

export const sidebarData: SidebarData = {
    teams: {
        name: 'Digital Signage',
        logo: TvMinimalPlayIcon,
        plan: 'Brandly',
    },

    navGroups: [
        {
            title: 'General',
            items: [
                {
                    title: 'Dashboard',
                    url: '/dashboard',
                    icon: IconLayoutDashboard,
                },
                {
                    title: 'Menu',
                    url: '/dashboard/menu',
                    icon: IconChartBar,
                },
                {
                    title: 'Clients',
                    url: '/dashboard/clients',
                    icon: IconUsers,
                },
            ],
        },
        {
            title: 'Other',
            items: [
                {
                    title: 'Settings',
                    icon: IconSettings,
                    items: [
                        {
                            title: 'Profile',
                            url: '/dashboard/settings',
                            icon: IconUserCog,
                        },
                        // {
                        //     title: 'Account',
                        //     url: '/dashboard/settings/account',
                        //     icon: IconTool,
                        // },
                        // {
                        //     title: 'Appearance',
                        //     url: '/dashboard/settings/appearance',
                        //     icon: IconPalette,
                        // },
                        // {
                        //     title: 'Notifications',
                        //     url: '/dashboard/settings/notifications',
                        //     icon: IconNotification,
                        // },
                        // {
                        //     title: 'Display',
                        //     url: '/dashboard/settings/display',
                        //     icon: IconBrowserCheck,
                        // },
                    ],
                },
            ],
        },
    ],
};
