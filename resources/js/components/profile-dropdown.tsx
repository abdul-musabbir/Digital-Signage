import { Link, usePage } from '@inertiajs/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ProfileDropdown() {
    const { auth }: { auth: any } = usePage().props;
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={auth?.user?.avatar} alt={`@${auth?.user?.name}`} />
                        <AvatarFallback>
                            {auth?.user?.name
                                ? auth?.user?.name
                                      .split(' ')
                                      .slice(0, 2)
                                      .map((word: string) => word[0].toUpperCase())
                                      .join('')
                                : 'CN'}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{auth?.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{auth?.user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/settings">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/settings">Settings</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link className="block w-full text-left" href={route('logout')} method="post" as="button">
                        Log out
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
