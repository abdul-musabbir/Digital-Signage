import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { router } from '@inertiajs/react';
import { Loader2, Trash2 } from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteMenuComponentProps {
    action: string;
    itemName?: string;
    itemType?: 'file' | 'menu' | 'item';
    onSuccess?: () => void;
    onError?: (error: any) => void;
    variant?: 'button' | 'icon';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const DeleteMenuComponent: React.FC<DeleteMenuComponentProps> = ({
    action,
    itemName,
    itemType = 'item',
    onSuccess,
    onError,
    variant = 'button',
    size = 'sm',
    className = '',
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleDelete = async () => {
        if (!action) {
            console.error('Delete action URL is required');
            toast({
                title: 'Error',
                description: 'Delete action is not properly configured.',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);

        router.delete(action, {
            preserveScroll: true,
            preserveState: true,

            onSuccess: (page) => {
                setLoading(false);
                setIsOpen(false);

                toast({
                    title: 'Success',
                    description: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} has been deleted successfully.`,
                    variant: 'default',
                });

                // Call custom onSuccess callback if provided
                if (onSuccess) {
                    onSuccess();
                }
            },

            onError: (errors) => {
                setLoading(false);
                console.error('Delete operation failed:', errors);

                const errorMessage = errors?.message || Object.values(errors)?.[0] || `Failed to delete ${itemType}. Please try again.`;

                toast({
                    title: 'Error',
                    description: typeof errorMessage === 'string' ? errorMessage : `Failed to delete ${itemType}. Please try again.`,
                    variant: 'destructive',
                });

                // Call custom onError callback if provided
                if (onError) {
                    onError(errors);
                }
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    const getButtonContent = () => {
        if (loading) {
            return (
                <>
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                    Deleting...
                </>
            );
        }

        if (variant === 'icon') {
            return <Trash2 className="h-3.5 w-3.5" />;
        }

        return (
            <>
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Delete
            </>
        );
    };

    const getButtonSize = () => {
        switch (size) {
            case 'md':
                return 'h-10 px-3';
            case 'lg':
                return 'h-11 px-4';
            default:
                return 'h-9 px-2';
        }
    };

    const getDialogTitle = () => {
        if (itemName) {
            return `Delete "${itemName}"?`;
        }
        return `Delete ${itemType}?`;
    };

    const getDialogDescription = () => {
        const itemDisplayName = itemName || itemType;
        return `This action cannot be undone. This will permanently delete "${itemDisplayName}" and remove all associated data from the system.`;
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    className={` ${getButtonSize()} rounded-lg text-xs font-medium transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:ring-2 focus:ring-red-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className} `}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                >
                    {getButtonContent()}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="sm:max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <Trash2 className="h-5 w-5 text-red-600" />
                        </div>
                        {getDialogTitle()}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="mt-2 text-sm text-gray-600">{getDialogDescription()}</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="gap-2 sm:gap-2">
                    <AlertDialogCancel disabled={loading} className="mt-0 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete {itemType}
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteMenuComponent;
