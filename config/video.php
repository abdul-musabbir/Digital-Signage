<?php

// config/video.php - Add this configuration file

return [
    /*
    |--------------------------------------------------------------------------
    | Video Streaming Settings
    |--------------------------------------------------------------------------
    */

    'streaming' => [
        // Chunk size for video streaming (in bytes)
        'chunk_size' => env('VIDEO_CHUNK_SIZE', 2 * 1024 * 1024), // 2MB

        // Maximum file size for streaming (in bytes)
        'max_file_size' => env('VIDEO_MAX_FILE_SIZE', 2 * 1024 * 1024 * 1024), // 2GB

        // Cache duration for video metadata (in seconds)
        'metadata_cache_duration' => env('VIDEO_METADATA_CACHE', 3600), // 1 hour

        // Enable/disable range requests
        'enable_range_requests' => env('VIDEO_ENABLE_RANGE', true),

        // Buffer size for streaming
        'buffer_size' => env('VIDEO_BUFFER_SIZE', 8192), // 8KB
    ],

    /*
    |--------------------------------------------------------------------------
    | Supported Video Formats
    |--------------------------------------------------------------------------
    */

    'supported_formats' => [
        // Primary streaming formats
        'video/mp4' => [
            'extension' => 'mp4',
            'streaming' => true,
            'quality_levels' => ['1080p', '720p', '480p', '360p'],
        ],
        'video/webm' => [
            'extension' => 'webm',
            'streaming' => true,
            'quality_levels' => ['1080p', '720p', '480p'],
        ],
        'video/ogg' => [
            'extension' => 'ogv',
            'streaming' => true,
            'quality_levels' => ['720p', '480p'],
        ],

        // Additional formats
        'video/quicktime' => [
            'extension' => 'mov',
            'streaming' => true,
            'quality_levels' => ['1080p', '720p', '480p'],
        ],
        'video/x-msvideo' => [
            'extension' => 'avi',
            'streaming' => true,
            'quality_levels' => ['720p', '480p'],
        ],
        'video/x-ms-wmv' => [
            'extension' => 'wmv',
            'streaming' => false, // Limited browser support
            'quality_levels' => ['480p'],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Quality Settings
    |--------------------------------------------------------------------------
    */

    'quality_levels' => [
        '1080p' => [
            'width' => 1920,
            'height' => 1080,
            'bitrate' => '5000k',
            'label' => 'Full HD (1080p)',
        ],
        '720p' => [
            'width' => 1280,
            'height' => 720,
            'bitrate' => '2500k',
            'label' => 'HD (720p)',
        ],
        '480p' => [
            'width' => 854,
            'height' => 480,
            'bitrate' => '1000k',
            'label' => 'SD (480p)',
        ],
        '360p' => [
            'width' => 640,
            'height' => 360,
            'bitrate' => '500k',
            'label' => 'Low (360p)',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Player Settings
    |--------------------------------------------------------------------------
    */

    'player' => [
        // Default player options
        'default_options' => [
            'autoplay' => false,
            'controls' => true,
            'loop' => false,
            'muted' => false,
            'preload' => 'metadata', // none, metadata, auto
        ],

        // Plyr.js specific settings
        'plyr_options' => [
            'speed' => [
                'selected' => 1,
                'options' => [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
            ],
            'quality' => [
                'default' => 720,
                'options' => [1080, 720, 480, 360],
            ],
            'keyboard' => [
                'focused' => true,
                'global' => true,
            ],
            'fullscreen' => [
                'enabled' => true,
                'fallback' => true,
                'iosNative' => true,
            ],
            'storage' => [
                'enabled' => true,
                'key' => 'plyr_settings',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Security Settings
    |--------------------------------------------------------------------------
    */

    'security' => [
        // Enable CORS for video streaming
        'enable_cors' => env('VIDEO_ENABLE_CORS', true),

        // Allowed origins for CORS
        'cors_origins' => env('VIDEO_CORS_ORIGINS', '*'),

        // Enable access logs
        'enable_logging' => env('VIDEO_ENABLE_LOGGING', true),

        // Rate limiting (requests per minute)
        'rate_limit' => env('VIDEO_RATE_LIMIT', 60),

        // Enable IP-based access control
        'ip_whitelist' => env('VIDEO_IP_WHITELIST', null),
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance Settings
    |--------------------------------------------------------------------------
    */

    'performance' => [
        // Enable gzip compression for metadata responses
        'enable_compression' => env('VIDEO_ENABLE_COMPRESSION', true),

        // CDN settings
        'cdn' => [
            'enabled' => env('VIDEO_CDN_ENABLED', false),
            'base_url' => env('VIDEO_CDN_BASE_URL', ''),
            'cache_duration' => env('VIDEO_CDN_CACHE_DURATION', 86400), // 24 hours
        ],

        // Thumbnail generation
        'thumbnails' => [
            'enabled' => env('VIDEO_THUMBNAILS_ENABLED', true),
            'sizes' => ['small' => '160x90', 'medium' => '320x180', 'large' => '640x360'],
            'format' => 'webp', // webp, jpg, png
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Analytics Settings
    |--------------------------------------------------------------------------
    */

    'analytics' => [
        // Track video views
        'track_views' => env('VIDEO_TRACK_VIEWS', true),

        // Track playback events
        'track_events' => env('VIDEO_TRACK_EVENTS', false),

        // Analytics provider (google, custom, none)
        'provider' => env('VIDEO_ANALYTICS_PROVIDER', 'none'),

        // Google Analytics tracking ID
        'google_analytics_id' => env('VIDEO_GA_TRACKING_ID', ''),
    ],
];
