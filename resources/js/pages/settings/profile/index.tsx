import ContentSection from '../components/content-section';
import ProfileForm from './profile-form';
import { SettingLayout } from '@/layouts';
import { usePage } from '@inertiajs/react';

export default function SettingsProfile() {
    const {
        auth: { user },
    }: {
        auth: { user: any };
    } = usePage().props;
    return (
        <SettingLayout title={'User profile'}>
            <ContentSection title="Profile" desc="This is how others will see you on the site.">
                <ProfileForm
                    user={{
                        id: user?.id,
                        email: user?.email,
                        profile_image: user?.avatar,
                    }}
                />
            </ContentSection>
        </SettingLayout>
    );
}
