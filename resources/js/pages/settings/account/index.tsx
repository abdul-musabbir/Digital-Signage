import ContentSection from '../components/content-section';
import { AccountForm } from './account-form';
import { SettingLayout } from '@/layouts';

export default function SettingsAccount() {
    return (
        <>
            <SettingLayout title="Account Settings">
                <ContentSection
                    title="Account"
                    desc="Update your account settings. Set your preferred language and
              timezone."
                >
                    <AccountForm />
                </ContentSection>
            </SettingLayout>
        </>
    );
}
