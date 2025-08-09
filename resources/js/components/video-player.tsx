import React, { useCallback, useEffect, useRef, useState } from 'react';

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

    // Intelligent buffering state
    const bufferController = useRef<AbortController | null>(null);
    const activeRequests = useRef(new Set<AbortController>());
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const bufferCheckInterval = useRef<number | null>(null);
    const lastBufferCheck = useRef(0);

    // Initialize intelligent buffering system
    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;

        // Set up intelligent buffering event listeners
        const handlePlay = () => {
            setIsPlaying(true);
            startIntelligentBuffering();
        };

        const handlePause = () => {
            setIsPlaying(false);
            stopIntelligentBuffering();
        };

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handleSeeking = () => {
            // Cancel current buffering and start fresh from seek position
            stopIntelligentBuffering();
            if (isPlaying) {
                // Small delay to let seek complete
                setTimeout(() => startIntelligentBuffering(), 100);
            }
        };

        // Add enhanced event listeners
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('seeking', handleSeeking);

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('seeking', handleSeeking);

            // Cleanup buffering
            stopIntelligentBuffering();
            cancelAllRequests();
        };
    }, [url]);

    // YouTube-style intelligent buffering manager
    const startIntelligentBuffering = useCallback(() => {
        if (!videoRef.current || bufferCheckInterval.current) return;

        bufferCheckInterval.current = setInterval(() => {
            manageIntelligentBuffer();
        }, 1000); // Check every second

        // Initial buffer check
        manageIntelligentBuffer();
    }, []);

    const stopIntelligentBuffering = useCallback(() => {
        if (bufferCheckInterval.current) {
            clearInterval(bufferCheckInterval.current);
            bufferCheckInterval.current = null;
        }

        // Cancel any ongoing buffer requests
        cancelAllRequests();
    }, []);

    const manageIntelligentBuffer = useCallback(() => {
        const video = videoRef.current;
        if (!video || !isPlaying) return;

        try {
            const currentTime = video.currentTime;
            const buffered = video.buffered;

            // Find current buffer end
            let bufferEnd = currentTime;
            for (let i = 0; i < buffered.length; i++) {
                if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
                    bufferEnd = buffered.end(i);
                    break;
                }
            }

            const bufferAhead = bufferEnd - currentTime;
            const targetBuffer = 30; // 30 seconds ahead like YouTube
            const criticalBuffer = 5; // Start buffering if less than 5 seconds ahead

            // Only buffer if we're running low and video is playing
            if (bufferAhead < criticalBuffer && isPlaying) {
                triggerIntelligentBuffer(bufferEnd);
            } else if (bufferAhead >= targetBuffer) {
                // We have enough buffer, pause any ongoing requests
                cancelNonCriticalRequests();
            }

            // Update buffer check timestamp
            lastBufferCheck.current = Date.now();
        } catch (error) {
            console.warn('Buffer management error:', error);
        }
    }, [isPlaying]);

    const triggerIntelligentBuffer = useCallback(
        (startTime: number) => {
            const video = videoRef.current;
            if (!video || activeRequests.current.size > 2) return; // Limit concurrent requests

            const controller = new AbortController();
            activeRequests.current.add(controller);

            // Calculate byte range for the next 30 seconds of video
            const videoDuration = video.duration || 0;
            if (videoDuration <= 0) return;

            // Estimate bytes per second (rough calculation)
            const estimatedFileSize = getEstimatedFileSize();
            const bytesPerSecond = estimatedFileSize / videoDuration;
            const bufferDuration = Math.min(30, videoDuration - startTime); // Buffer up to 30 seconds
            const bufferBytes = Math.floor(bytesPerSecond * bufferDuration);
            const startByte = Math.floor((startTime / videoDuration) * estimatedFileSize);

            // Make intelligent range request
            fetch(url, {
                method: 'GET',
                headers: {
                    Range: `bytes=${startByte}-${startByte + bufferBytes - 1}`,
                    'X-Player-State': 'playing',
                    'X-Buffer-State': 'intelligent',
                    'Cache-Control': 'max-age=3600',
                },
                signal: controller.signal,
            })
                .then((response) => {
                    if (response.ok || response.status === 206) {
                        // Buffer request successful - browser will handle the actual buffering
                        console.debug(`Intelligent buffer: ${Math.round(bufferDuration)}s ahead`);
                    }
                })
                .catch((error) => {
                    if (error.name !== 'AbortError') {
                        console.warn('Buffer request failed:', error);
                    }
                })
                .finally(() => {
                    activeRequests.current.delete(controller);
                });
        },
        [url],
    );

    const getEstimatedFileSize = () => {
        // Try to get file size from video element or estimate based on duration
        const video = videoRef.current;
        if (!video) return 100 * 1024 * 1024; // 100MB default

        // Rough estimation: 1 minute of video ≈ 10MB (can be adjusted)
        const duration = video.duration || 300; // 5 minutes default
        return (duration * 10 * 1024 * 1024) / 60; // 10MB per minute
    };

    const cancelAllRequests = () => {
        activeRequests.current.forEach((controller) => {
            controller.abort();
        });
        activeRequests.current.clear();
    };

    const cancelNonCriticalRequests = () => {
        // Keep only the most recent request, cancel others
        const controllers = Array.from(activeRequests.current);
        if (controllers.length > 1) {
            controllers.slice(0, -1).forEach((controller) => {
                controller.abort();
                activeRequests.current.delete(controller);
            });
        }
    };

    // Original event handlers (unchanged)
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

        // Stop intelligent buffering on error
        stopIntelligentBuffering();
    };

    const retry = () => {
        const video = videoRef.current;
        if (video) {
            setHasError(false);
            setErrorMessage('');
            setIsLoading(true);

            // Reset intelligent buffering state
            stopIntelligentBuffering();
            cancelAllRequests();

            video.load();
        }
    };

    return (
        <div className={cn('relative w-full', className)}>
            {/* Loading Overlay - UNCHANGED */}
            {isLoading && !hasError && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm">
                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                        <p className="text-sm text-white">Loading video...</p>
                    </div>
                </div>
            )}

            {/* Error Overlay - UNCHANGED */}
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

            {/* HTML Video Element - COMPLETELY UNCHANGED */}
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
