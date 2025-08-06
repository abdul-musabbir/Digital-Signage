import { useClients } from '../context/clients-context';
import { IconUserPlus } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';

export function ClientsPrimaryButtons() {
    const { setOpen } = useClients();
    return (
        <div className="flex gap-2">
            {/* <Button variant="outline" className="space-x-1" onClick={() => setOpen('invite')}>
                <span>Invite User</span> <IconMailPlus size={18} />
            </Button> */}
            <Button className="space-x-1" onClick={() => setOpen('add')}>
                <span>Add Client</span> <IconUserPlus size={18} />
            </Button>
        </div>
    );
}
