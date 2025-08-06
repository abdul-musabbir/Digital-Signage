import ContentSection from '../components/content-section';
import { DisplayForm } from './display-form';
import { SettingLayout } from '@/layouts';

export default function SettingsDisplay() {
    return (
        <SettingLayout title={'Display Settings'}>
            <ContentSection title="Display" desc="Turn items on or off to control what's displayed in the app.">
                <DisplayForm />
            </ContentSection>
        </SettingLayout>
    );
}
