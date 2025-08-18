import { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { Edit3, LoaderCircle } from 'lucide-react';
import { FilePond, registerPlugin } from 'react-filepond';
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

registerPlugin(FilePondPluginFileValidateSize, FilePondPluginFileValidateType, FilePondPluginImagePreview);

// Define FilePondFile type since it's not exported
interface FilePondFile {
    filename: string;
    serverId?: string;
    [key: string]: any;
}

const formSchema = z.object({
    title: z.string().min(1, 'Title field is require'),
    image: z
        .object({
            name: z.string(),
            path: z.string(),
        })
        .optional(), // Made optional since user might not upload a new image
});

type MenuForm = z.infer<typeof formSchema>;

export default function EditMenu({ title, id, type }: { title: string; id: number; type: string }) {
    const [open, isOpen] = useState<boolean>(false);
    const form = useForm<MenuForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: title || '',
            image: undefined, // Start with undefined for new uploads
        },
    });

    const [filePondFiles, setFilePondFiles] = useState<any[]>([]);
    const [uploadedFile, setUploadedFile] = useState<{ name: string; path: string } | null>(null);

    // Update form when uploadedFile changes
    useEffect(() => {
        if (uploadedFile) {
            form.setValue('image', uploadedFile, { shouldValidate: true });
        }
    }, [uploadedFile, form]);

    const handleFilePondUpdate = useCallback(
        (fileItems: any[]) => {
            setFilePondFiles(fileItems);

            // If no files, clear the uploaded file
            if (fileItems.length === 0) {
                setUploadedFile(null);
                form.setValue('image', undefined);
            }
        },
        [form],
    );

    const handleFileProcess = useCallback((error: any, file: FilePondFile) => {
        if (error) {
            console.error('Upload error:', error);
            return;
        }

        const serverId = file.serverId;
        const name = file.filename;

        if (serverId) {
            setUploadedFile({ name, path: serverId });
        }
    }, []);

    const handleFileRemove = useCallback(
        (error: any, file: FilePondFile) => {
            setUploadedFile(null);
            form.setValue('image', undefined);
        },
        [form],
    );

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

            <DialogContent className="sm:max-w-lg">
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
                        preserveScroll: true,
                        preserveState: true,
                    }}
                >
                    {(isLoading: boolean) => (
                        <div>
                            <FormGroup control={form.control} name="title" label="Title">
                                {({ field }) => <Input {...field} />}
                            </FormGroup>

                            {type !== 'image' && type === 'video' && (
                                <FormGroup control={form.control} name="image" label="Upload Image">
                                    {({ field }) => (
                                        <FilePond
                                            files={filePondFiles}
                                            onupdatefiles={handleFilePondUpdate}
                                            disabled={isLoading}
                                            allowFileTypeValidation={true}
                                            acceptedFileTypes={[
                                                // Image formats
                                                'image/jpeg',
                                                'image/jpg',
                                                'image/png',
                                                'image/gif',
                                                'image/webp',
                                                'image/svg+xml',
                                                'image/bmp',
                                                'image/tiff',
                                                'image/tif',
                                                'image/ico',
                                                'image/heic',
                                                'image/heif',
                                                'image/avif',
                                            ]}
                                            allowImagePreview={true}
                                            allowFileSizeValidation={true}
                                            maxFileSize="1024MB"
                                            labelMaxFileSizeExceeded="File is too large (max 1024MB)"
                                            chunkUploads={true}
                                            chunkSize={5 * 1024 * 1024}
                                            chunkRetryDelays={[2000, 5000, 10000]}
                                            allowMultiple={false} // Changed to false for single file
                                            maxFiles={1} // Added to enforce single file limit
                                            server={{
                                                url: '/filepond',
                                                headers: {
                                                    'X-CSRF-TOKEN':
                                                        document.head?.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                },
                                            }}
                                            onprocessfile={handleFileProcess}
                                            onremovefile={handleFileRemove}
                                            labelIdle='📤 Drag & Drop or <span class="filepond--label-action text-blue-600 underline">Browse</span> your image'
                                        />
                                    )}
                                </FormGroup>
                            )}

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
