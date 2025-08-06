import { useEffect } from 'react';
import { Client } from '../types/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import CreateClient from '@/lib/wayfinder/actions/App/Domains/Clients/Actions/CreateClient';
import UpdateClient from '@/lib/wayfinder/actions/App/Domains/Clients/Actions/UpdateClient';

import { Form, FormGroup } from '@/components/form/form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// ========== Zod schema ==========
const formSchema = z
    .object({
        name: z.string().min(1, { message: 'Name is required.' }),
        phoneNumber: z.string().min(1, { message: 'Phone number is required.' }),
        email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Email is invalid.' }),
        password: z.string().transform((pwd) => pwd.trim()),
        confirmPassword: z.string().transform((pwd) => pwd.trim()),
        address: z.string().min(1, { message: 'Name is required.' }),
        isEdit: z.boolean(),
    })
    .superRefine(({ isEdit, password, confirmPassword }, ctx) => {
        if (!isEdit || (isEdit && password !== '')) {
            if (password === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Password is required.',
                    path: ['password'],
                });
            }

            if (password.length < 8) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Password must be at least 8 characters long.',
                    path: ['password'],
                });
            }

            if (!password.match(/[a-z]/)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Password must contain at least one lowercase letter.',
                    path: ['password'],
                });
            }

            if (!password.match(/\d/)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Password must contain at least one number.',
                    path: ['password'],
                });
            }

            if (password !== confirmPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Passwords don't match.",
                    path: ['confirmPassword'],
                });
            }
        }
    });

type ClientForm = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentRow?: Client | null;
}

export function ClientsActionDialog({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow;

    const getDefaultValues = (): ClientForm => ({
        name: currentRow?.name || '',
        phoneNumber: currentRow?.phoneNumber || '',
        email: currentRow?.email || '',
        password: '',
        confirmPassword: '',
        address: currentRow?.address || '',
        isEdit: isUpdate,
    });

    const form = useForm<ClientForm>({
        resolver: zodResolver(formSchema),
        defaultValues: getDefaultValues(),
    });

    const { reset } = form;

    useEffect(() => {
        if (open) {
            reset(getDefaultValues());
        } else {
            reset({
                name: '',
                phoneNumber: '',
                email: '',
                password: '',
                confirmPassword: '',
                address: '',
                isEdit: false,
            });
        }
    }, [open, currentRow, reset]);

    const handleDialogOpenChange = (isOpen: boolean) => {
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-y-auto">
                <DialogHeader className="text-left">
                    <DialogTitle>{isUpdate ? 'Update Client' : 'Add Client'}</DialogTitle>
                    <DialogDescription>
                        {isUpdate
                            ? "Update the client details below and click save when you're done."
                            : 'Fill in the client details below and click save to create a new client.'}
                    </DialogDescription>
                </DialogHeader>

                <Form
                    id="client-form"
                    form={form}
                    onSubmit={{
                        url: isUpdate ? UpdateClient.url(currentRow?.id) : CreateClient().url,
                        method: isUpdate ? 'put' : CreateClient().method,
                        onSuccess: () => {
                            handleDialogOpenChange(false);
                        },
                    }}
                >
                    {(isLoading: boolean) => (
                        <>
                            <div className="grid grid-cols-1 gap-5">
                                <FormGroup control={form.control} name="name" label="Name *">
                                    {({ field }) => <Input {...field} placeholder="Enter name" disabled={isLoading} className="h-10 !outline-none" />}
                                </FormGroup>

                                <FormGroup control={form.control} name="phoneNumber" label="Phone Number *">
                                    {({ field }) => <Input {...field} placeholder="Enter phone number" disabled={isLoading} className="h-10" />}
                                </FormGroup>

                                <FormGroup control={form.control} name="email" label="Email *">
                                    {({ field }) => (
                                        <Input {...field} type="email" placeholder="Enter email address" disabled={isLoading} className="h-10" />
                                    )}
                                </FormGroup>

                                {!isUpdate && (
                                    <>
                                        <FormGroup control={form.control} name="password" label="Password *">
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="Enter password"
                                                    disabled={isLoading}
                                                    className="h-10"
                                                />
                                            )}
                                        </FormGroup>

                                        <FormGroup control={form.control} name="confirmPassword" label="Confirm Password *">
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="Confirm password"
                                                    disabled={isLoading}
                                                    className="h-10"
                                                />
                                            )}
                                        </FormGroup>
                                    </>
                                )}

                                <FormGroup control={form.control} name="address" label="Address *">
                                    {({ field }) => (
                                        <Textarea {...field} placeholder="Enter address" disabled={isLoading} className="h-10 !outline-none" />
                                    )}
                                </FormGroup>
                            </div>

                            <DialogFooter className="pt-4">
                                <DialogClose asChild>
                                    <Button variant="outline" type="button" disabled={isLoading}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <LoaderCircle className="animate-spin" /> : isUpdate ? 'Update' : 'Save'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
