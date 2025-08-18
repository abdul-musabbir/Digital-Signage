import { Eye } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export function PreviewImage({ id }: { id: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'h-9 rounded-lg px-2 text-xs font-medium transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700',
                    )}
                >
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    View
                </Button>
            </DialogTrigger>
            <DialogContent className="p-0 sm:max-w-4xl">
                <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
                    <img src={route('preview.image', id)} alt="Preview" className="max-h-[80vh] max-w-full rounded object-contain" />
                </div>
            </DialogContent>
        </Dialog>
    );
}
