<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class Menu extends Model
{
    use HasApiTokens, SoftDeletes;

    protected $table = 'menus';

    protected $fillable = [
        'client_id',
        'created_by',
        'name',
        'type',
        'local_path',
        'google_drive_id',
        'google_drive_url',
        'mime_type',
        'size',
        'description',
        'uploaded_at',
        'created_at',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function getRouteKeyName(): string
    {
        return 'google_drive_id';
    }
}
