import { ReactNode, useCallback, useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { toast } from '@/hooks/use-toast';
import { Method, VisitHelperOptions } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import { ControllerProps, DefaultValues, FieldPath, FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';

// Enhanced type definitions for better error handling
export type InertiaErrors = Record<string, string | string[]>;

export type FieldMapping<TFieldValues extends FieldValues> = Record<string, FieldPath<TFieldValues>>;

export type ErrorHandlingConfig<TFieldValues extends FieldValues> = {
    fieldMapping?: FieldMapping<TFieldValues>;
    showToastOnFieldErrors?: boolean;
    showToastOnNoErrors?: boolean;
    defaultErrorMessage?: string;
};

export type SubmitCallbackParam<TFieldValues extends FieldValues> = {
    values: TFieldValues;
    setErrors: (errors: InertiaErrors) => void;
    setLoading: (loading: boolean) => void;
};

export type SubmitConfig<TFieldValues extends FieldValues = FieldValues> = VisitHelperOptions & {
    url: string;
    method: Method;
    transform?: (data: TFieldValues) => any;
    errorHandling?: ErrorHandlingConfig<TFieldValues>;
};

type FormSubmitHandler<TFieldValues extends FieldValues> = SubmitConfig<TFieldValues> | ((props: SubmitCallbackParam<TFieldValues>) => void);

type FormProps<TFieldValues extends FieldValues> = {
    form: UseFormReturn<TFieldValues>;
    onSubmit: FormSubmitHandler<TFieldValues>;
    children: ReactNode | ((loading: boolean) => ReactNode);
    className?: string;
    errorHandling?: ErrorHandlingConfig<TFieldValues>;
    id?: string;
};

type FormGroupProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = Omit<
    ControllerProps<TFieldValues, TName>,
    'render' | 'control'
> & {
    label: string;
    control: NonNullable<ControllerProps<TFieldValues, TName>['control']>;
    children: ControllerProps<TFieldValues, TName>['render'];
};

type FormGroupRawProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = Omit<
    FormGroupProps<TFieldValues, TName>,
    'label'
>;

/**
 * Enhanced Form component with professional error handling and loading state
 * - Field-specific errors are shown inline with proper mapping
 * - General/server errors are shown as toast notifications
 * - Supports data transformation before submission
 * - Handles both frontend validation and backend server errors
 * - Provides comprehensive error logging for debugging
 * - Includes loading state management for submit buttons
 */
export function Form<TFieldValues extends FieldValues = FieldValues>({
    form,
    onSubmit,
    children,
    className,
    errorHandling = {},
    id,
}: FormProps<TFieldValues>) {
    const {
        fieldMapping = {},
        showToastOnFieldErrors = false,
        showToastOnNoErrors = true,
        defaultErrorMessage = 'Please check the form for errors and try again.',
    } = errorHandling;

    // Loading state for form submission
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Professional error handling function for Inertia.js responses
     * Handles both field-specific and general errors with proper type safety
     */
    const handleInertiaErrors = useCallback(
        (errors: InertiaErrors) => {
            // Clear all previous server errors to prevent stale error states
            Object.keys(form.formState.errors).forEach((key) => {
                const error = form.formState.errors[key as FieldPath<TFieldValues>];
                if (error?.type === 'server') {
                    form.clearErrors(key as FieldPath<TFieldValues>);
                }
            });

            // Separate field-specific errors from general errors
            const fieldErrors: Record<string, string> = {};
            const generalErrors: string[] = [];
            const unknownErrors: string[] = [];

            Object.entries(errors).forEach(([serverKey, value]) => {
                const errorMessage = Array.isArray(value) ? value[0] : value;

                // Check if this server key maps to a form field
                const formFieldKey = fieldMapping[serverKey];
                const formValues = form.getValues();

                if (formFieldKey && formFieldKey in formValues) {
                    // This is a field-specific error with explicit mapping
                    fieldErrors[formFieldKey] = errorMessage;
                    form.setError(formFieldKey, {
                        type: 'server',
                        message: errorMessage,
                    });
                } else if (serverKey in formValues) {
                    // Direct field match (server key matches form field)
                    fieldErrors[serverKey] = errorMessage;
                    form.setError(serverKey as FieldPath<TFieldValues>, {
                        type: 'server',
                        message: errorMessage,
                    });
                } else if (serverKey === 'message' || serverKey === 'error') {
                    // General error message
                    generalErrors.push(errorMessage);
                } else {
                    // Unknown error, treat as general but preserve context
                    unknownErrors.push(`${serverKey}: ${errorMessage}`);
                }
            });

            // Combine general and unknown errors
            const allGeneralErrors = [...generalErrors, ...unknownErrors];

            // Toast notification logic
            if (allGeneralErrors.length > 0) {
                toast({
                    title: 'Error',
                    description: allGeneralErrors.join(', '),
                    variant: 'destructive',
                });
            } else if (Object.keys(fieldErrors).length === 0 && showToastOnNoErrors) {
                // No field errors and no general errors - show default message
                toast({
                    title: 'Validation Error',
                    description: defaultErrorMessage,
                    variant: 'destructive',
                });
            } else if (Object.keys(fieldErrors).length > 0 && showToastOnFieldErrors) {
                // Show toast even when field errors exist
                toast({
                    title: 'Validation Error',
                    description: 'Please correct the highlighted fields and try again.',
                    variant: 'destructive',
                });
            }
        },
        [form, fieldMapping, showToastOnFieldErrors, showToastOnNoErrors, defaultErrorMessage],
    );

    /**
     * Enhanced form submission handler with comprehensive error handling and loading state
     */
    const handleFormSubmit = useCallback(
        (values: TFieldValues) => {
            if (typeof onSubmit === 'object') {
                const { url, method, transform, onError, onSuccess, onStart, onFinish, errorHandling: submitErrorHandling, ...options } = onSubmit;

                // Transform data if transform function is provided
                const submissionData = transform ? transform(values) : values;

                // Merge error handling configurations
                const mergedErrorHandling = {
                    ...errorHandling,
                    ...submitErrorHandling,
                };

                router[method](url, submissionData, {
                    ...options,
                    onStart: (visit) => {
                        setIsLoading(true);
                        onStart?.(visit);
                    },
                    onSuccess: (page) => {
                        setIsLoading(false);
                        // Clear any lingering server errors on successful submission
                        Object.keys(form.formState.errors).forEach((key) => {
                            const error = form.formState.errors[key as FieldPath<TFieldValues>];
                            if (error?.type === 'server') {
                                form.clearErrors(key as FieldPath<TFieldValues>);
                            }
                        });
                        onSuccess?.(page);
                    },
                    onError: (errors) => {
                        setIsLoading(false);
                        // Use the enhanced error handling
                        const tempErrorHandling = {
                            ...errorHandling,
                            ...mergedErrorHandling,
                        };
                        const tempHandleErrors = (errors: InertiaErrors) => {
                            // Clear previous server errors
                            Object.keys(form.formState.errors).forEach((key) => {
                                const error = form.formState.errors[key as FieldPath<TFieldValues>];
                                if (error?.type === 'server') {
                                    form.clearErrors(key as FieldPath<TFieldValues>);
                                }
                            });

                            const fieldErrors: Record<string, string> = {};
                            const generalErrors: string[] = [];
                            const unknownErrors: string[] = [];

                            Object.entries(errors).forEach(([serverKey, value]) => {
                                const errorMessage = Array.isArray(value) ? value[0] : value;
                                const formFieldKey = (tempErrorHandling.fieldMapping || {})[serverKey];
                                const formValues = form.getValues();

                                if (formFieldKey && formFieldKey in formValues) {
                                    fieldErrors[formFieldKey] = errorMessage;
                                    form.setError(formFieldKey, {
                                        type: 'server',
                                        message: errorMessage,
                                    });
                                } else if (serverKey in formValues) {
                                    fieldErrors[serverKey] = errorMessage;
                                    form.setError(serverKey as FieldPath<TFieldValues>, {
                                        type: 'server',
                                        message: errorMessage,
                                    });
                                } else if (serverKey === 'message' || serverKey === 'error') {
                                    generalErrors.push(errorMessage);
                                } else {
                                    unknownErrors.push(`${serverKey}: ${errorMessage}`);
                                }
                            });

                            const allGeneralErrors = [...generalErrors, ...unknownErrors];

                            if (allGeneralErrors.length > 0) {
                                toast({
                                    title: 'Error',
                                    description: allGeneralErrors.join(', '),
                                    variant: 'destructive',
                                });
                            } else if (Object.keys(fieldErrors).length === 0 && (tempErrorHandling.showToastOnNoErrors ?? true)) {
                                toast({
                                    title: 'Validation Error',
                                    description: tempErrorHandling.defaultErrorMessage || defaultErrorMessage,
                                    variant: 'destructive',
                                });
                            } else if (Object.keys(fieldErrors).length > 0 && (tempErrorHandling.showToastOnFieldErrors ?? false)) {
                                toast({
                                    title: 'Validation Error',
                                    description: 'Please correct the highlighted fields and try again.',
                                    variant: 'destructive',
                                });
                            }
                        };

                        tempHandleErrors(errors);
                        onError?.(errors);
                    },
                    onFinish: (visit) => {
                        setIsLoading(false);
                        onFinish?.(visit);
                    },
                });
            } else {
                // Custom submit handler
                setIsLoading(true);
                onSubmit({
                    values,
                    setErrors: handleInertiaErrors,
                    setLoading: setIsLoading,
                });
            }
        },
        [onSubmit, handleInertiaErrors, form, errorHandling, defaultErrorMessage],
    );

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className={cn('space-y-6', className)} id={id}>
                {typeof children === 'function' ? children(isLoading) : children}
            </form>
        </FormProvider>
    );
}

/**
 * FormGroup component with label and automatic error display
 * Shows field-specific validation errors inline with proper styling
 */
export function FormGroup<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
    label,
    children,
    ...props
}: FormGroupProps<TFieldValues, TName>) {
    return (
        <FormField
            {...props}
            render={({ field, fieldState, formState }) => (
                <FormItem>
                    <FormLabel className={cn('font-medium', fieldState.error && 'text-destructive')}>{label}</FormLabel>
                    <FormControl>{children({ field, fieldState, formState })}</FormControl>
                    <FormMessage className="text-sm" />
                </FormItem>
            )}
        />
    );
}

/**
 * FormGroupRaw component without label
 * Useful for custom form layouts and complex field arrangements
 */
export function FormGroupRaw<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
    children,
    ...props
}: FormGroupRawProps<TFieldValues, TName>) {
    return <FormField {...props} render={({ field, fieldState, formState }) => <FormItem>{children({ field, fieldState, formState })}</FormItem>} />;
}

/**
 * Utility function to create form submission config with error handling
 * Provides type safety and consistent configuration
 */
export function createSubmitConfig<TFieldValues extends FieldValues>(config: SubmitConfig<TFieldValues>): SubmitConfig<TFieldValues> {
    return config;
}

/**
 * Professional hook for advanced form operations
 * Provides utilities for form state management and error handling
 */
export function useFormHelpers<TFieldValues extends FieldValues>(form: UseFormReturn<TFieldValues>) {
    const clearServerErrors = useCallback(() => {
        Object.keys(form.formState.errors).forEach((key) => {
            const error = form.formState.errors[key as FieldPath<TFieldValues>];
            if (error?.type === 'server') {
                form.clearErrors(key as FieldPath<TFieldValues>);
            }
        });
    }, [form]);

    const clearAllErrors = useCallback(() => {
        Object.keys(form.formState.errors).forEach((key) => {
            form.clearErrors(key as FieldPath<TFieldValues>);
        });
    }, [form]);

    const hasServerErrors = useCallback(() => {
        return Object.values(form.formState.errors).some((error) => error?.type === 'server');
    }, [form.formState.errors]);

    const hasValidationErrors = useCallback(() => {
        return Object.values(form.formState.errors).some((error) => error?.type !== 'server');
    }, [form.formState.errors]);

    const getErrorSummary = useCallback(() => {
        const errors = form.formState.errors;
        const serverErrors: string[] = [];
        const validationErrors: string[] = [];

        Object.entries(errors).forEach(([field, error]) => {
            if (error?.message) {
                if (error.type === 'server') {
                    serverErrors.push(`${field}: ${error.message}`);
                } else {
                    validationErrors.push(`${field}: ${error.message}`);
                }
            }
        });

        return {
            serverErrors,
            validationErrors,
            totalErrors: serverErrors.length + validationErrors.length,
        };
    }, [form.formState.errors]);

    const resetWithDefaults = useCallback(
        (defaults: Partial<TFieldValues>) => {
            form.reset(defaults as DefaultValues<TFieldValues>);
        },
        [form],
    );

    return {
        clearServerErrors,
        clearAllErrors,
        hasServerErrors,
        hasValidationErrors,
        getErrorSummary,
        resetWithDefaults,
    };
}

/**
 * Type-safe field mapping creator
 * Helps create field mappings with proper TypeScript support
 */
export function createFieldMapping<TFieldValues extends FieldValues>(mapping: FieldMapping<TFieldValues>): FieldMapping<TFieldValues> {
    return mapping;
}

/**
 * Error handling configuration creator
 * Provides type-safe error handling configuration
 */
export function createErrorHandlingConfig<TFieldValues extends FieldValues>(
    config: ErrorHandlingConfig<TFieldValues>,
): ErrorHandlingConfig<TFieldValues> {
    return config;
}
