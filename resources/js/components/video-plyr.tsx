import Plyr from 'plyr-react';

import 'plyr-react/plyr.css';

interface VideoPlyrProps {
    src: string;
}

export default function VideoPlyr({ src }: VideoPlyrProps) {
    const videoSrc = {
        type: 'video' as const,
        sources: [
            {
                src: src,
                type: 'video/mp4',
                size: 720,
            },
        ],
        poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
    };

    const plyrOptions = {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
        settings: ['captions', 'quality', 'speed', 'loop'],
        quality: {
            default: 720,
            options: [1080, 720, 576],
        },
    };

    return (
        <div className="aspect-video overflow-hidden rounded-lg shadow-2xl">
            <Plyr source={videoSrc} options={plyrOptions} />
        </div>
    );
}
