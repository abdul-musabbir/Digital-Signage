import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit3, LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import UpdateMenu from '@/lib/wayfinder/actions/App/Domains/Menu/Actions/UpdateMenu';

import { Form, FormGroup } from '@/components/form/form';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
    title: z.string().min(1, 'Title field is require'),
});

type MenuForm = z.infer<typeof formSchema>;

export default function EditMenu({ title, id }: { title: string; id: number }) {
    const [open, isOpen] = useState<boolean>(false);
    const form = useForm<MenuForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: title || '',
        },
    });

    return (
        <Dialog open={open} onOpenChange={isOpen}>
            <DialogTrigger asChild className="w-full">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-lg px-2 text-xs font-medium transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                    <Edit3 className="mr-1 h-3.5 w-3.5" />
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit menu</DialogTitle>
                    <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
                </DialogHeader>

                <Form
                    form={form}
                    onSubmit={{
                        url: UpdateMenu.url(id),
                        method: UpdateMenu(id).method,
                        onSuccess: function () {
                            isOpen(false);
                        },
                    }}
                >
                    {(isLoading: boolean) => (
                        <div>
                            <FormGroup control={form.control} name="title" label="Title">
                                {({ field }) => <Input {...field} />}
                            </FormGroup>

                            <DialogFooter className="mt-6">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">{isLoading ? <LoaderCircle className="animate-spin" /> : 'Update'}</Button>
                            </DialogFooter>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
