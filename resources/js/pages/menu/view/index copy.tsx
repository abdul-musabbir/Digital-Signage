import { useState } from 'react';
import { AuthenticatedLayout } from '@/layouts';

import { Main } from '@/components/layout/main';
import VideoPlayer from '@/components/video-player';

interface VideoData {
    id: string;
    name: string;
    mimeType: string;
    size: number;
    streamingUrl: string;
    publicUrl: string;
    downloadUrl: string;
}

interface VideoPlayerProps {
    video: VideoData | null;
    error?: string;
}

export default function Index({ video, error }: VideoPlayerProps) {
    const [retryCount, setRetryCount] = useState(0);

    // Format file size
    const formatFileSize = (bytes: number): string => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Byte';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
    };

    // Error component
    const ErrorMessage = ({ message }: { message: string }) => (
        <div className="flex h-64 items-center justify-center rounded-xl border border-red-500 bg-red-900/20">
            <div className="text-center">
                <div className="mb-4 text-4xl">⚠️</div>
                <p className="mb-6 max-w-md text-red-300">{message}</p>
                <div className="flex justify-center gap-3">
                    {retryCount < 3 && (
                        <button className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-all hover:scale-105 hover:bg-blue-700">
                            Retry
                        </button>
                    )}
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-lg bg-gray-600 px-6 py-2 font-semibold text-white transition-all hover:scale-105 hover:bg-gray-700"
                    >
                        Refresh
                    </button>
                </div>
                {video?.publicUrl && (
                    <div className="mt-4">
                        <a href={video.publicUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">
                            Open in Google Drive
                        </a>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout title="Video Player">
            <Main>
                <div className="mx-auto w-full max-w-7xl px-4 py-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-5xl font-bold text-transparent">
                            {video?.name || 'Video Player'}
                        </h1>
                    </div>

                    {/* Video Player Container */}
                    <div className="relative mb-8">
                        {!video ? (
                            <ErrorMessage message="No video found" />
                        ) : (
                            <div className="relative overflow-hidden rounded-2xl bg-black shadow-2xl">
                                {/* Video Element */}
                                <VideoPlayer url={video?.streamingUrl} mimeType={video?.mimeType} autoPlay={true} controls={true} />
                            </div>
                        )}
                    </div>

                    {/* Video Information */}
                    {video && !error && (
                        <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-xl">
                            <h2 className="mb-6 text-2xl font-bold text-white">Video Information</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <span className="text-sm uppercase tracking-wider text-gray-400">File Name</span>
                                    <p className="break-all font-medium text-white">{video.name}</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-sm uppercase tracking-wider text-gray-400">File Size</span>
                                    <p className="font-medium text-white">{formatFileSize(video.size)}</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-sm uppercase tracking-wider text-gray-400">Format</span>
                                    <p className="font-medium text-white">{video.mimeType}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-wrap gap-4">
                                <a
                                    href={video.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700"
                                >
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Download
                                </a>
                                <a
                                    href={video.publicUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-green-700"
                                >
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                    Open in Drive
                                </a>
                                {navigator.share && (
                                    <button
                                        onClick={() =>
                                            navigator.share({
                                                title: video.name,
                                                url: window.location.href,
                                            })
                                        }
                                        className="inline-flex items-center rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-purple-700"
                                    >
                                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                                            />
                                        </svg>
                                        Share
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Main>
        </AuthenticatedLayout>
    );
}
