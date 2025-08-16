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

        $menus = $user->menus()->select('id', 'name', 'type', 'google_drive_id as fileId', 'mime_type', 'size')->get();

        return response()->json([
            'menus' => $menus,
        ]);
    }
}
