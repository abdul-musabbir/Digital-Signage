<?php

declare(strict_types=1);

use App\Domains\Api\Actions\StreamVideo;
use App\Models\User;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

Route::middleware(['auth:sanctum'])->group(function () {
    // get the user
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');

    // get single client files
    Route::get('/menus', function (Request $request) {
        $user = $request->user();
        if (! $user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $menus = $user->menus()->select('id', 'name', 'type', 'google_drive_id as fileId', 'mime_type', 'size')->get();

        return response()->json([
            'menus' => $menus,
        ]);
    })->middleware('auth:sanctum');

    // streaming endpoint
    // Route::get('/stream/{menu:google_drive_id}', function (string $id, Request $request): StreamedResponse {
    //     DB::disconnect();
    //     session()->save();
    //     session_write_close();

    //     // Get Google Drive file info to validate it exists
    //     $fileInfo = $this->drive->getFileInfo($id);
    //     if (! $fileInfo) {
    //         abort(404, 'Video not found');
    //     }

    //     // Build Google Drive API URL for media download
    //     $url = "https://www.googleapis.com/drive/v3/files/{$id}?alt=media";

    //     $client = new Client;

    //     // Get fresh access token for authentication
    //     $accessToken = $this->drive->getAccessToken();

    //     $headers = [
    //         'Authorization' => "Bearer {$accessToken}",
    //     ];

    //     // Add Range header if present in request
    //     if ($request->hasHeader('Range')) {
    //         $headers['Range'] = $request->header('Range');
    //     }

    //     $response = $client->get($url, [
    //         'stream' => true,
    //         'headers' => $headers,
    //     ]);

    //     $statusCode = $headers === [] ? Response::HTTP_OK : Response::HTTP_PARTIAL_CONTENT;

    //     $body = $response->getBody();

    //     return response()->stream(function () use ($body) {
    //         while (! $body->eof()) {
    //             echo $body->read(length: 1024 * 1024 * 2);
    //             ob_flush();
    //             flush();
    //         }
    //     }, status: $statusCode, headers: [
    //         'Content-Type' => 'video/mp4',
    //         'Accept-Ranges' => 'bytes',
    //         'X-Accel-Buffering' => 'no',
    //         'Content-Length' => $response->getHeaderLine('Content-Length'),
    //         'Content-Range' => $response->getHeaderLine('Content-Range'),
    //     ]);
    // });

    Route::get('/stream/{menu:google_drive_id}', StreamVideo::class);

    // CORS preflight for streaming
    Route::options('/stream/{menu:google_drive_id}', function () {
        return response('', 200, [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers' => 'Range, If-Range, Cache-Control, Content-Type',
            'Access-Control-Expose-Headers' => 'Accept-Ranges, Content-Length, Content-Range',
            'Access-Control-Max-Age' => '86400',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    });
});

// login method
Route::post('/login', function (Request $request) {
    // ✅ Correct validation rules
    $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
        'device_name' => ['required'], // fixed: was 'require'
    ]);

    // Find user by email
    $user = User::where('email', $request->email)->first();

    // Check password
    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    // Return user token
    return response()->json([
        'token' => $user->createToken($request->device_name)->plainTextToken,
    ]);
});
