import React, { useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface VideoPlayerProps {
    url: string;
    mimeType?: string;
    poster?: string;
    autoPlay?: boolean;
    controls?: boolean;
    rounded?: boolean;
    preloadUrl?: string;
    onError?: (error: string) => void;
    className?: string;
}

export default function VideoPlayer({
    url,
    mimeType = 'video/mp4',
    poster,
    autoPlay = false,
    controls = true,
    rounded = true,
    preloadUrl,
    onError,
    className,
}: VideoPlayerProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleLoadStart = () => {
        setIsLoading(true);
        setHasError(false);
        setErrorMessage('');
    };

    const handleCanPlay = () => {
        setIsLoading(false);
    };

    const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        const video = e.currentTarget;
        let message = 'Video playback failed';

        if (video.error) {
            switch (video.error.code) {
                case 1:
                    message = 'Video loading was aborted';
                    break;
                case 2:
                    message = 'Network error occurred';
                    break;
                case 3:
                    message = 'Video format not supported';
                    break;
                case 4:
                    message = 'Video source not available';
                    break;
                default:
                    message = 'Unknown video error';
            }
        }

        setIsLoading(false);
        setHasError(true);
        setErrorMessage(message);
        onError?.(message);
    };

    const retry = () => {
        const video = videoRef.current;
        if (video) {
            setHasError(false);
            setErrorMessage('');
            setIsLoading(true);
            video.load();
        }
    };

    return (
        <div className={cn('relative w-full', className)}>
            {/* Loading Overlay */}
            {isLoading && !hasError && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm">
                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                        <p className="text-sm text-white">Loading video...</p>
                    </div>
                </div>
            )}

            {/* Error Overlay */}
            {hasError && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm">
                    <div className="p-6 text-center">
                        <div className="mb-4 text-4xl text-red-400">⚠️</div>
                        <h3 className="mb-2 text-lg font-semibold text-white">Video Error</h3>
                        <p className="mb-4 text-sm text-gray-300">{errorMessage}</p>
                        <button
                            onClick={retry}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* HTML Video Element */}
            <video
                ref={videoRef}
                className={cn('aspect-video w-full bg-black object-contain', {
                    'rounded-lg': rounded,
                })}
                controls={controls}
                autoPlay={autoPlay}
                loop
                preload="metadata"
                playsInline
                poster={poster}
                onLoadStart={handleLoadStart}
                onCanPlay={handleCanPlay}
                onError={handleError}
                controlsList="nodownload"
                disablePictureInPicture
            >
                <source src={url} type={mimeType} />
                {preloadUrl && <link rel="preload" href={preloadUrl} as="video" />}
                <p className="text-gray-400">
                    Your browser does not support the video tag.
                    <a href={url} className="ml-1 text-blue-400 underline hover:text-blue-300">
                        Download the video instead
                    </a>
                </p>
            </video>
        </div>
    );
}
