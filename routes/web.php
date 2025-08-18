<?php

declare(strict_types=1);

use App\Domains\Api\Lib\ServeImage;
use App\Domains\Dashboard\Pages\ManageDashboardPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use RahulHaque\Filepond\Facades\Filepond;

Route::redirect('/', '/login');
// Route::get('/', fn() => inertia('welcome'));

Route::get('/sign-in', fn() => Inertia::render('auth/sign-in/index'));
Route::get('/sign-up', fn() => Inertia::render('auth/sign-up/index'));
Route::get('/forgot-pass', fn() => Inertia::render('auth/forgot-password/index'));
Route::get('/otp', fn() => Inertia::render('auth/otp/index'));
Route::get('/401', fn() => Inertia::render('errors/unauthorized-error'));
Route::get('/403', fn() => Inertia::render('errors/forbidden'));
Route::get('/404', fn() => Inertia::render('errors/not-found-error'));
Route::get('/500', fn() => Inertia::render('errors/general-error'));
Route::get('/503', fn() => Inertia::render('errors/maintenance-error'));

Route::post('/videos/store', function (Request $request) {
    try {
        // Validate the incoming request
        $request->validate([
            'videos' => 'required|array|min:1',
            'videos.*.path' => 'required|string',
            'videos.*.name' => 'required|string',
        ]);

        $processedVideos = [];
        $errors = [];

        // Create a unique batch identifier to prevent conflicts
        $batchId = time() . '_' . uniqid();

        foreach ($request->videos as $index => $video) {
            try {
                // Create a unique directory for each file to prevent overwrites
                $uniqueId = $index . '_' . microtime(true) . '_' . uniqid();
                $targetDirectory = 'videos_' . $batchId . '/' . $uniqueId;

                Log::info('Processing video', [
                    'index' => $index,
                    'video_name' => $video['name'],
                    'video_path' => $video['path'],
                    'target_directory' => $targetDirectory,
                ]);

                // Process each filepond upload using the serverId (path)
                $fileInfo = Filepond::field($video['path'])
                    ->moveTo($targetDirectory);

                if (! $fileInfo || empty($fileInfo['location'])) {
                    $error = "Failed to process video: {$video['name']} (FilePond processing failed)";
                    $errors[] = $error;
                    Log::error('FilePond processing failed', [
                        'video_name' => $video['name'],
                        'video_path' => $video['path'],
                        'target_directory' => $targetDirectory,
                    ]);

                    continue;
                }

                // Get the correct file extension from the original filename
                $originalExtension = pathinfo($video['name'], PATHINFO_EXTENSION);
                $expectedFileName = $targetDirectory;

                // If the fileInfo doesn't include extension, we need to find the actual file
                $storagePath = storage_path('app/public/');
                $possiblePaths = [
                    $storagePath . $fileInfo['location'],
                    $storagePath . $fileInfo['location'] . '.' . $originalExtension,
                    $storagePath . $targetDirectory . '.' . $originalExtension,
                ];

                // Also check if the file was stored with the original name
                if (is_dir($storagePath . dirname($fileInfo['location']))) {
                    $files = glob($storagePath . dirname($fileInfo['location']) . '/*');
                    $possiblePaths = array_merge($possiblePaths, $files);
                }

                $fullPath = null;
                foreach ($possiblePaths as $path) {
                    if (file_exists($path) && is_file($path)) {
                        $fullPath = $path;
                        // Update the location to match the actual file path
                        $fileInfo['location'] = str_replace($storagePath, '', $fullPath);
                        break;
                    }
                }

                // If still not found, try to find any file in the target directory
                if (! $fullPath) {
                    $targetDir = $storagePath . dirname($fileInfo['location']);
                    if (is_dir($targetDir)) {
                        $files = array_diff(scandir($targetDir), ['.', '..']);
                        if (! empty($files)) {
                            $fileName = reset($files);
                            $fullPath = $targetDir . '/' . $fileName;
                            $fileInfo['location'] = str_replace($storagePath, '', $fullPath);
                        }
                    }
                }

                if (! $fullPath || ! file_exists($fullPath)) {
                    // Last attempt: check what FilePond actually created
                    Log::error('Debugging file location', [
                        'fileInfo' => $fileInfo,
                        'storage_path' => $storagePath,
                        'target_directory' => $targetDirectory,
                        'checked_paths' => $possiblePaths,
                        'directory_contents' => is_dir($storagePath . dirname($fileInfo['location'])) ?
                            scandir($storagePath . dirname($fileInfo['location'])) : 'Directory not found',
                    ]);

                    $error = "Video file not found after upload: {$video['name']}";
                    $errors[] = $error;

                    continue;
                }

                // Get file information
                $fileSize = filesize($fullPath);
                $mimeType = mime_content_type($fullPath);

                $processedVideos[] = [
                    'original_name' => $video['name'],
                    'stored_path' => $fileInfo['location'],
                    'full_path' => $fullPath,
                    'size' => $fileSize,
                    'mime_type' => $mimeType,
                    'url' => Storage::url($fileInfo['location']),
                ];

                Log::info('Video processed successfully', [
                    'index' => $index,
                    'original_name' => $video['name'],
                    'stored_path' => $fileInfo['location'],
                    'actual_path' => $fullPath,
                    'size' => $fileSize,
                    'mime_type' => $mimeType,
                ]);
            } catch (\Exception $e) {
                $error = "Error processing video {$video['name']}: " . $e->getMessage();
                $errors[] = $error;

                Log::error('Exception while processing video', [
                    'index' => $index,
                    'video_name' => $video['name'],
                    'video_path' => $video['path'],
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        }

        // Log processing summary
        Log::info('Video processing summary', [
            'total_requested' => count($request->videos),
            'successfully_processed' => count($processedVideos),
            'errors_count' => count($errors),
        ]);

        // Check if any videos were processed successfully
        if (empty($processedVideos) && ! empty($errors)) {
            return back()->withErrors([
                'filepond' => 'No videos could be processed. Errors: ' . implode(', ', $errors),
            ]);
        }

        // Here you can save video information to database
        // Example:
        // foreach ($processedVideos as $videoData) {
        //     Video::create([
        //         'user_id' => auth()->id(),
        //         'original_name' => $videoData['original_name'],
        //         'file_path' => $videoData['stored_path'],
        //         'file_size' => $videoData['size'],
        //         'mime_type' => $videoData['mime_type'],
        //     ]);
        // }

        $totalVideos = count($request->videos);
        $successfulVideos = count($processedVideos);

        if ($successfulVideos === $totalVideos) {
            $successMessage = "{$successfulVideos} file(s) uploaded successfully";
        } else {
            $successMessage = "{$successfulVideos} out of {$totalVideos} file(s) uploaded successfully";
            if (! empty($errors)) {
                $successMessage .= '. Some files had errors: ' . implode(', ', $errors);
            }
        }

        return back()->with('success', $successMessage);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return back()->withErrors($e->errors());
    } catch (\Exception $e) {
        Log::error('Unexpected error in video upload', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        return back()->withErrors([
            'filepond' => 'An unexpected error occurred during upload. Please try again.',
        ]);
    }
})->middleware('auth');

Route::group(['prefix' => '/dashboard', 'middleware' => ['auth', 'verified']], function () {
    Route::get('/preview/{fileId}', ServeImage::class)
        ->name('preview.image');
    require __DIR__ . '/dashboard.php';
});

require base_path('vendor/rahulhaque/laravel-filepond/routes/web.php');

Route::fallback(function (): Response {
    return Inertia::render('errors/not-found-error');
});

// require __DIR__.'/auth.php';
