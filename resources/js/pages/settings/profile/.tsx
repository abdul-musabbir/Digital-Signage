import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormGroup } from '@/components/form/form';
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
            if (!file || file.length === 0) return true; // Optional field
            return file[0]?.size <= 5000000; // 5MB
        }, 'File size must be less than 5MB')
        .refine((file) => {
            if (!file || file.length === 0) return true;
            return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file[0]?.type);
        }, 'Only .jpg, .jpeg, .png and .webp files are accepted.'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
    user?: {
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
        },
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const getInitials = (email: string) => {
        return email.split('@')[0].slice(0, 2).toUpperCase();
    };

    return (
        <Form
            form={form}
            onSubmit={{
                url: route('profile.update'),
                method: 'post',
            }}
        >
            {(isLoading: boolean) => (
                <>
                    <FormGroup control={form.control} name="profile_image" label="Profile Image">
                        {({ field: { onChange, value, ...rest } }) => (
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
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            onChange(e.target.files);
                                                            handleImageChange(e);
                                                        }}
                                                        className="hidden"
                                                        id="profile-image"
                                                        {...rest}
                                                    />
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
                                                </div>
                                            </FormControl>
                                            <p className="mt-2 text-xs text-gray-500">JPG, PNG or WEBP (max. 5MB)</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </FormGroup>

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
