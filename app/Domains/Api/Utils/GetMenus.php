<?php

declare(strict_types=1);

namespace App\Domains\Api\Utils;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetMenus
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $menus = $user->menus()
            ->select('id', 'name', 'type', 'google_drive_id', 'mime_type', 'size', 'thumbnail')
            ->orderBy('name', 'asc')
            ->get()
            ->map(fn($menu) => $this->formatMenu($menu));

        return response()->json(['menus' => $menus]);
    }

    private function formatMenu($menu): array
    {
        // Set thumbnail based on type - USE THE ACTUAL MENU'S google_drive_id
        $thumbnail = match ($menu->type) {
            'image' => route('api.preview.image', ['fileId' => $menu->google_drive_id]), // Fixed: use actual fileId
            'video' => route('api.preview.image', ['fileId' => $menu->thumbnail]),
            default => 'https://img.freepik.com/premium-vector/digital-restaurant-menu-horizontal-format_23-2148655475.jpg?semt=ais_hybrid&w=740&q=80'
        };

        return [
            'id' => $menu->id,
            'title' => $menu->name,
            'type' => strtoupper($menu->type),
            'format' => strtoupper(str_replace('video/', '', $menu->mime_type)),
            'duration' => '10:34', // You might replace this with actual duration if available
            'fileSize' => $this->formatSize($menu->size),
            'resolution' => '1920x1080', // Replace if you have dynamic resolution
            'thumbnail' => $thumbnail,
            'videoUrl' => route('api.stream.video', $menu->google_drive_id) ?? '',
            'description' => $menu->type === 'video' ? 'A short computer-animated comedy film featuring Big Buck Bunny.' : null,
            'fileId' => $menu->google_drive_id,
        ];
    }

    private function formatSize(?int $sizeInBytes): string
    {
        if (! $sizeInBytes) return 'Unknown';
        $sizeInMB = $sizeInBytes / 1024 / 1024;
        return number_format($sizeInMB, 2) . ' MB';
    }
}
