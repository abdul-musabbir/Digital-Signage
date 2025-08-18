import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import UpdateProfile from '@/lib/wayfinder/actions/App/Domains/Profile/Actions/UpdateProfile';

import { Form, FormGroup, FormGroupRaw } from '@/components/form/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const profileFormSchema = z.object({
    email: z
        .string({
            required_error: 'Please enter your email.',
        })
        .email('Please enter a valid email address.'),
    profile_image: z
        .any()
        .optional()
        .refine((file) => {
            if (!file || (file instanceof FileList && file.length === 0)) return true; // Optional field
            const actualFile = file instanceof FileList ? file[0] : file;
            return actualFile?.size <= 5000000; // 5MB
        }, 'File size must be less than 5MB')
        .refine((file) => {
            if (!file || (file instanceof FileList && file.length === 0)) return true;
            const actualFile = file instanceof FileList ? file[0] : file;
            return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(actualFile?.type);
        }, 'Only .jpg, .jpeg, .png and .webp files are accepted.'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
    user?: {
        id?: number;
        email?: string;
        profile_image?: string;
    };
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(user?.profile_image || null);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        mode: 'onChange',
        defaultValues: {
            email: user?.email || '',
            profile_image: undefined,
        },
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file size before processing
            if (file.size > 5000000) {
                form.setError('profile_image', { message: 'File size must be less than 5MB' });
                return;
            }

            // Validate file type
            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                form.setError('profile_image', { message: 'Only .jpg, .jpeg, .png and .webp files are accepted.' });
                return;
            }

            // Clear any previous errors
            form.clearErrors('profile_image');

            // Set form value
            form.setValue('profile_image', event.target.files, { shouldValidate: true });

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            // Clear everything if no file selected
            form.setValue('profile_image', undefined);
            setPreviewImage(user?.profile_image || null);
        }
    };

    const getInitials = (email: string) => {
        return email.split('@')[0].slice(0, 2).toUpperCase();
    };

    const handleRemoveImage = () => {
        form.setValue('profile_image', undefined);
        setPreviewImage(null);

        // Reset the file input
        const fileInput = document.getElementById('profile-image') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    console.log(form.getValues('profile_image'));

    return (
        <Form
            form={form}
            onSubmit={{
                url: UpdateProfile().url,
                method: UpdateProfile().method,
            }}
        >
            {(isLoading: boolean) => (
                <>
                    <FormGroupRaw control={form.control} name="profile_image">
                        {({ field: { onChange, value, ...rest }, fieldState: { error } }) => (
                            <Card className="mx-auto w-fit">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="relative">
                                            <Avatar className="h-24 w-24">
                                                <AvatarImage src={previewImage || undefined} alt="Profile" />
                                                <AvatarFallback className="text-lg">
                                                    {user?.email ? getInitials(user.email) : <Camera className="h-8 w-8" />}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>

                                        <div className="text-center">
                                            <FormControl>
                                                <div>
                                                    <Input
                                                        type="file"
                                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                                        onChange={(e) => {
                                                            onChange(e);
                                                            handleImageChange(e);
                                                        }}
                                                        className="hidden"
                                                        id="profile-image"
                                                        {...rest}
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => document.getElementById('profile-image')?.click()}
                                                            className="gap-2"
                                                            disabled={isLoading}
                                                        >
                                                            <Upload className="h-4 w-4" />
                                                            Choose Image
                                                        </Button>

                                                        {previewImage && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={handleRemoveImage}
                                                                disabled={isLoading}
                                                            >
                                                                Remove
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <p className="mt-2 text-xs text-gray-500">JPG, PNG or WEBP (max. 5MB)</p>
                                            {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </FormGroupRaw>

                    <FormGroup control={form.control} name="email" label="Email">
                        {({ field }) => <Input type="email" placeholder="Enter your email" disabled={isLoading} {...field} />}
                    </FormGroup>

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? 'Updating...' : 'Update Profile'}
                    </Button>
                </>
            )}
        </Form>
    );
}
