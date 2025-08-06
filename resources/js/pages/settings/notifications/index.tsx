import ContentSection from '../components/content-section';
import { NotificationsForm } from './notifications-form';
import { SettingLayout } from '@/layouts';

export default function SettingsNotifications() {
    return (
        <SettingLayout title={'Notifications Settings'}>
            <ContentSection title="Notifications" desc="Configure how you receive notifications.">
                <NotificationsForm />
            </ContentSection>
        </SettingLayout>
    );
}
