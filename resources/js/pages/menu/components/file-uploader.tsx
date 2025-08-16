// resources/js/Pages/VideoUploader.tsx
import { usePage } from '@inertiajs/react';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { useForm } from 'react-hook-form';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';

import { useCallback, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { FilePond, registerPlugin } from 'react-filepond';
import z from 'zod';

import UploadFiles from '@/lib/wayfinder/actions/App/Domains/Menu/Actions/UploadFiles';

import { Form, FormGroup } from '@/components/form/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

registerPlugin(FilePondPluginFileValidateSize, FilePondPluginFileValidateType, FilePondPluginImagePreview);

// Define FilePondFile type since it's not exported
interface FilePondFile {
    filename: string;
    serverId?: string;
    [key: string]: any;
}

type Client = {
    id: string;
    name: string;
};

const formSchema = z.object({
    client: z.string().min(1, 'Client is required.'),
    videos: z
        .array(
            z.object({
                name: z.string(),
                path: z.string(),
            }),
        )
        .min(1, 'At least one file is required.'),
});

type FileForm = z.infer<typeof formSchema>;

export default function VideoUploader() {
    const { clients } = usePage().props as { clients?: Client[] };

    const form = useForm<FileForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client: '',
            videos: [],
        },
    });

    const [filePondFiles, setFilePondFiles] = useState<any[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<{ name: string; path: string }[]>([]);

    // Update form when uploadedFiles changes
    useEffect(() => {
        form.setValue('videos', uploadedFiles, { shouldValidate: true });
    }, [uploadedFiles, form]);

    const handleFilePondUpdate = useCallback((fileItems: any[]) => {
        setFilePondFiles(fileItems);
    }, []);

    const handleFileProcess = useCallback((error: any, file: FilePondFile) => {
        if (error) {
            console.error('Upload error:', error);
            return;
        }

        const serverId = file.serverId;
        const name = file.filename;

        if (serverId) {
            setUploadedFiles((prev) => {
                // Avoid duplicates
                const exists = prev.some((f) => f.path === serverId);
                if (exists) return prev;

                return [...prev, { name, path: serverId }];
            });
        }
    }, []);

    const handleFileRemove = useCallback((error: any, file: FilePondFile) => {
        if (file.serverId) {
            setUploadedFiles((prev) => prev.filter((f) => f.path !== file.serverId));
        }
    }, []);

    const handleFormSuccess = useCallback(() => {
        toast({
            title: 'Upload Successfully',
            description: 'description',
            variant: 'default',
        });
        // Reset form and clear files on success
        form.reset();
        setFilePondFiles([]);
        setUploadedFiles([]);
    }, [form]);

    return (
        <Card className="mx-auto max-w-4xl space-y-6 rounded-xl p-6">
            <CardHeader>
                <CardTitle>
                    <h1 className="text-3xl font-bold dark:text-white">🎥 Upload Your Video</h1>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form
                    form={form}
                    onSubmit={{
                        url: UploadFiles().url,
                        method: UploadFiles().method,
                        onSuccess: handleFormSuccess, // <-- Correctly call reset on success
                    }}
                >
                    {(isLoading: boolean) => (
                        <div className="space-y-6">
                            <FormGroup control={form.control} name="client" label="Select Client">
                                {({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Clients</SelectLabel>
                                                {!clients || clients.length === 0 ? (
                                                    <SelectItem value="no-clients-found" disabled>
                                                        No clients found
                                                    </SelectItem>
                                                ) : (
                                                    clients.map((client) => (
                                                        <SelectItem key={client.id} value={client.id}>
                                                            {client.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            </FormGroup>

                            <FormGroup control={form.control} name="videos" label="Upload Files">
                                {({ field }) => (
                                    <FilePond
                                        files={filePondFiles}
                                        onupdatefiles={handleFilePondUpdate}
                                        disabled={isLoading}
                                        allowFileTypeValidation={true}
                                        acceptedFileTypes={[
                                            // Video formats
                                            'video/mp4',
                                            'video/mov',
                                            'video/avi',
                                            'video/mpeg',
                                            'video/mpg',
                                            'video/mkv',
                                            'video/webm',
                                            'video/wmv',
                                            'video/flv',
                                            'video/3gp',
                                            'video/m4v',
                                            'video/quicktime',
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
                                        allowMultiple={true}
                                        server={{
                                            url: '/filepond',
                                            headers: {
                                                'X-CSRF-TOKEN':
                                                    document.head?.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                            },
                                        }}
                                        onprocessfile={handleFileProcess}
                                        onremovefile={handleFileRemove}
                                        labelIdle='📤 Drag & Drop or <span class="filepond--label-action text-blue-600 underline">Browse</span> your files'
                                    />
                                )}
                            </FormGroup>

                            <Button type="submit" disabled={isLoading || uploadedFiles.length === 0} className="w-full">
                                {isLoading ? <LoaderCircle className="animate-spin" /> : 'Upload Video'}
                            </Button>
                        </div>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
