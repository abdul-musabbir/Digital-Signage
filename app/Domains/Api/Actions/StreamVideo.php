<?php

declare(strict_types=1);

namespace App\Domains\Api\Actions;

use App\Services\GoogleDriveService;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Lorisleiva\Actions\Concerns\AsAction;
use Lorisleiva\Actions\Concerns\AsController;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StreamVideo
{
    use AsAction;
    use AsController;

    public GoogleDriveService $drive;

    public function __construct(GoogleDriveService $drive)
    {
        $this->drive = $drive;
    }

    public function handle(string $id, Request $request): StreamedResponse
    {
        DB::disconnect();
        session()->save();
        session_write_close();

        // Get Google Drive file info to validate it exists
        $fileInfo = $this->drive->getFileInfo($id);
        if (! $fileInfo) {
            abort(404, 'Video not found');
        }

        // Build Google Drive API URL for media download
        $url = "https://www.googleapis.com/drive/v3/files/{$id}?alt=media";

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
