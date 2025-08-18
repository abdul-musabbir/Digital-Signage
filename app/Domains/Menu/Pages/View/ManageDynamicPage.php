<?php

declare(strict_types=1);

namespace App\Domains\Menu\Pages\View;

use App\Models\Menu;
use App\Services\GoogleDriveService;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ManageDynamicPage
{
    private GoogleDriveService $drive;

    public function __construct(GoogleDriveService $drive)
    {
        $this->drive = $drive;
    }

    // public function index(Menu $menu): \Inertia\Response
    // {
    //     $googleDriveId = $menu->google_drive_id;

    //     // Fetch video info with caching (remove Cache::rememberForever if you want no cache)
    //     $video = Cache::rememberForever("instant_video_{$googleDriveId}", function () use ($googleDriveId) {
    //         try {
    //             $fileInfo = $this->drive->getFileInfo($googleDriveId);

    //             if (! $fileInfo) {
    //                 return null;
    //             }

    //             return [
    //                 'id'           => $googleDriveId,
    //                 'name'         => $fileInfo->name,
    //                 'size'         => (int) $fileInfo->size,
    //                 'mimeType'     => $fileInfo->mimeType ?? 'video/mp4',
    //                 'streamingUrl' => route('menu.stream', ['menu' => $googleDriveId]),
    //                 'instantReady' => true,
    //             ];
    //         } catch (\Throwable) {
    //             return null;
    //         }
    //     });

    //     return inertia('menu/view/index', [
    //         'video'       => $video,
    //         'error'       => $video ? null : 'Video not found',
    //         'instantPlay' => (bool) $video,
    //     ]);
    // }

    public function index(Menu $menu)
    {
        $id = $menu->google_drive_id;

        try {
            $info = $this->drive->getFileInfo($id);

            if (! $info) {
                return inertia('menu/view/index', [
                    'video' => null,
                    'error' => 'Video not found',
                    'instantPlay' => false,
                ]);
            }

            $video = [
                'id' => $id,
                'name' => $info->name,
                'size' => (int) $info->size,
                'mimeType' => $info->mimeType ?? 'video/mp4',
                'streamingUrl' => route('menu.stream', ['menu' => $id]),
                'instantReady' => true,
            ];

            return inertia('menu/view/index', [
                'video' => $video,
                'error' => null,
                'instantPlay' => true,
            ]);
        } catch (\Throwable $e) {
            return inertia('menu/view/index', [
                'video' => null,
                'error' => 'Video not found',
                'instantPlay' => false,
            ]);
        }
    }

    public function stream(Request $request, Menu $menu): StreamedResponse
    {
        DB::disconnect();
        session()->save();
        session_write_close();

        // Get Google Drive file info to validate it exists
        $fileInfo = $this->drive->getFileInfo($menu->google_drive_id);
        if (! $fileInfo) {
            abort(404, 'Video not found');
        }

        // Build Google Drive API URL for media download
        $url = "https://www.googleapis.com/drive/v3/files/{$menu->google_drive_id}?alt=media";

        $client = new Client;

        // Get fresh access token for authentication
        $accessToken = $this->drive->getAccessToken();

        $headers = [
            'Authorization' => "Bearer {$accessToken}",
        ];

        // Add Range header if present in request
        if ($request->hasHeader('Range')) {
            $headers['Range'] = $request->header('Range');
        }

        $response = $client->get($url, [
            'stream' => true,
            'headers' => $headers,
        ]);

        $statusCode = $headers === [] ? Response::HTTP_OK : Response::HTTP_PARTIAL_CONTENT;

        $body = $response->getBody();

        return response()->stream(function () use ($body) {
            while (! $body->eof()) {
                echo $body->read(length: 1024 * 1024 * 2);
                ob_flush();
                flush();
            }
        }, status: $statusCode, headers: [
            'Content-Type' => 'video/mp4',
            'Accept-Ranges' => 'bytes',
            'X-Accel-Buffering' => 'no',
            'Content-Length' => $response->getHeaderLine('Content-Length'),
            'Content-Range' => $response->getHeaderLine('Content-Range'),
        ]);
    }
}
