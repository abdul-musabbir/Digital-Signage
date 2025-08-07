import Plyr from 'plyr-react';

function App() {
    const videoSrc = {
        type: 'video' as const,
        sources: [
            {
                src: 'https://drive.google.com/file/d/1itVIZs-xTUXkSCe5HuAk9ivpOuRMxT8G/preview',
                type: 'video/mp4',
                size: 1080,
            },
            {
                src: 'https://drive.google.com/file/d/1itVIZs-xTUXkSCe5HuAk9ivpOuRMxT8G/preview',
                type: 'video/mp4',
                size: 720,
            },
            {
                src: 'https://drive.google.com/file/d/1itVIZs-xTUXkSCe5HuAk9ivpOuRMxT8G/preview',
                type: 'video/mp4',
                size: 576,
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
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-4xl">
                <h1 className="mb-6 text-center text-3xl font-bold text-white">Video Player Demo</h1>
                <div className="aspect-video overflow-hidden rounded-lg bg-black shadow-2xl">
                    <Plyr source={videoSrc} options={plyrOptions} />
                </div>
                <p className="mt-4 text-center text-gray-400">Demo video: "View From A Blue Moon" trailer</p>
            </div>

            <iframe
                className="aspect-video"
                src="https://drive.google.com/file/d/10W8ou8R0EascVkunOEQglEybcZSJJIEt/preview"
                width="640"
                height="480"
                allow="autoplay"
                allowFullScreen
            ></iframe>
        </div>
    );
}
export default App;
