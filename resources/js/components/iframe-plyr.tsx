import React from 'react';

import { cn } from '@/lib/utils';

interface IframePlyrProps {
    fieldId: number | string;
    className?: string;
}

const IframePlyr: React.FC<IframePlyrProps> = ({ fieldId, className }) => {
    if (!fieldId) return null;

    const iframeSrc = `https://drive.google.com/file/d/${fieldId}/preview`;

    return <iframe className={cn('aspect-video', className)} src={iframeSrc} allow="autoplay" allowFullScreen />;
};

export default IframePlyr;
