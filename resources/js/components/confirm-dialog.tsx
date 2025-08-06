import { useCallback, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { VisitHelperOptions } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

import { cn } from '@/lib/utils';

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

// Enhanced type definitions for better error handling
export type InertiaErrors = Record<string, string | string[]>;

export type DeleteActionConfig = {
    url: string;
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: () => void;
    onError?: (errors: InertiaErrors) => void;
} & VisitHelperOptions;

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: React.ReactNode;
    desc: React.JSX.Element | string;
    cancelBtnText?: string;
    confirmText?: React.ReactNode;
    destructive?: boolean;
    className?: string;
    children?: React.ReactNode;

    // Enhanced action configuration
    action: DeleteActionConfig | (() => void | Promise<void>);

    // Optional override for external loading state
    disabled?: boolean;
}

/**
 * Enhanced ConfirmDialog component with professional error handling
 * - Integrates with Inertia.js router.delete method
 * - Shows success toast on successful deletion
 * - Handles server errors with detailed toast notifications
 * - Provides comprehensive error logging for debugging
 * - Includes loading state management
 * - Auto-closes dialog on success
 */
export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    desc,
    cancelBtnText = 'Cancel',
    confirmText = 'Continue',
    destructive = false,
    className,
    children,
    action,
    disabled = false,
}: ConfirmDialogProps) {
    // Internal loading state for the confirmation action
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Enhanced error handling function for Inertia.js responses
     * Handles server errors with detailed toast notifications
     */
    const handleInertiaErrors = useCallback((errors: InertiaErrors, errorMessage?: string) => {
        // Parse errors and create user-friendly messages
        const errorMessages: string[] = [];

        Object.entries(errors).forEach(([key, value]) => {
            const message = Array.isArray(value) ? value[0] : value;

            if (key === 'message' || key === 'error') {
                errorMessages.push(message);
            } else {
                errorMessages.push(`${key}: ${message}`);
            }
        });

        // Show error toast
        const finalErrorMessage =
            errorMessages.length > 0 ? errorMessages.join(', ') : errorMessage || 'An unexpected error occurred. Please try again.';

        toast({
            title: 'Error',
            description: finalErrorMessage,
            variant: 'destructive',
        });
    }, []);

    /**
     * Enhanced confirmation handler with comprehensive error handling
     */
    const handleConfirm = useCallback(async () => {
        if (typeof action === 'function') {
            // Custom action handler
            try {
                setIsLoading(true);
                await action();

                // Close dialog on success (assuming success if no error thrown)
                onOpenChange(false);
            } catch (error) {
                // Handle custom action errors
                const errorMessage = error instanceof Error ? error.message : 'An error occurred';
                toast({
                    title: 'Error',
                    description: errorMessage,
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        } else {
            // Inertia.js router.delete action
            const {
                url,
                successMessage = 'Action completed successfully',
                errorMessage = 'An error occurred while processing your request',
                onSuccess: customOnSuccess,
                onError: customOnError,
                onStart: customOnStart,
                onFinish: customOnFinish,
                ...inertiaOptions
            } = action;

            router.delete(url, {
                ...inertiaOptions,
                onStart: (visit) => {
                    setIsLoading(true);
                    customOnStart?.(visit);
                },
                onSuccess: (page) => {
                    setIsLoading(false);

                    // Show success toast
                    // toast({
                    //   title: "Success",
                    //   description: successMessage,
                    //   variant: "default",
                    // });

                    sonnerToast.success(successMessage || '');

                    // Close dialog
                    onOpenChange(false);

                    // Call custom success handler
                    customOnSuccess?.();
                },
                onError: (errors) => {
                    setIsLoading(false);

                    // Use enhanced error handling
                    handleInertiaErrors(errors, errorMessage);

                    // Call custom error handler
                    customOnError?.(errors);
                },
                onFinish: (visit) => {
                    setIsLoading(false);
                    customOnFinish?.(visit);
                },
            });
        }
    }, [action, onOpenChange, handleInertiaErrors]);

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className={cn(className)}>
                <AlertDialogHeader className="text-left">
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div>{desc}</div>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {children}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading || disabled}>{cancelBtnText}</AlertDialogCancel>
                    <Button variant={destructive ? 'destructive' : 'default'} onClick={handleConfirm} disabled={disabled || isLoading}>
                        {isLoading ? <LoaderCircle className="animate-spin" /> : confirmText}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

/**
 * Utility function to create delete action config with type safety
 */
export function createDeleteActionConfig(config: DeleteActionConfig): DeleteActionConfig {
    return config;
}

/**
 * Hook for managing confirm dialog state
 */
export function useConfirmDialog() {
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = useCallback(() => setIsOpen(true), []);
    const closeDialog = useCallback(() => setIsOpen(false), []);
    const toggleDialog = useCallback(() => setIsOpen((prev) => !prev), []);

    return {
        isOpen,
        openDialog,
        closeDialog,
        toggleDialog,
        dialogProps: {
            open: isOpen,
            onOpenChange: setIsOpen,
        },
    };
}

// Example usage types for better developer experience
export type DeleteUserActionConfig = DeleteActionConfig & {
    url: `/users/${number}`;
};

export type DeletePostActionConfig = DeleteActionConfig & {
    url: `/posts/${number}`;
};

// Usage Examples:

/*
  // Example 1: Simple delete with router.delete
  const { dialogProps, openDialog } = useConfirmDialog();
  
  <ConfirmDialog
    {...dialogProps}
    title="Delete User"
    desc="Are you sure you want to delete this user? This action cannot be undone."
    destructive
    action={createDeleteActionConfig({
      url: `/users/${userId}`,
      successMessage: "User deleted successfully",
      errorMessage: "Failed to delete user",
      onSuccess: () => {
        // Refresh the page or update state
        router.reload();
      }
    })}
  />
  
  // Example 2: Custom action with async function
  <ConfirmDialog
    {...dialogProps}
    title="Custom Action"
    desc="Are you sure you want to perform this action?"
    action={async () => {
      await customApiCall();
      // Handle success/error as needed
    }}
  />
  
  // Example 3: With additional options
  <ConfirmDialog
    {...dialogProps}
    title="Delete Post"
    desc={
      <div>
        <p>Are you sure you want to delete this post?</p>
        <p className="text-sm text-muted-foreground mt-2">
          This will also delete all associated comments and likes.
        </p>
      </div>
    }
    confirmText="Delete Post"
    destructive
    action={createDeleteActionConfig({
      url: `/posts/${postId}`,
      successMessage: "Post deleted successfully",
      errorMessage: "Failed to delete post. Please try again.",
      preserveScroll: true,
      onSuccess: () => {
        // Navigate back or refresh
        router.visit('/dashboard');
      },
      onError: (errors) => {
        console.log("Additional error handling:", errors);
      }
    })}
  >
    <div className="bg-destructive/10 p-3 rounded-md">
      <p className="text-sm text-destructive">
        Warning: This action is permanent and cannot be undone.
      </p>
    </div>
  </ConfirmDialog>
  */
