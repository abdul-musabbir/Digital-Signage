<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();

            $table->foreignId('client_id')
                ->constrained('users')
                ->onDelete('cascade')
                ->comment('Client/User who owns this menu item');

            // The user who created/uploaded this menu item; nullable and set null on user deletion
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->comment('User ID who uploaded this menu item');

            // Original filename, sufficient length to cover most filenames
            $table->string('name', 255)
                ->comment('Original filename of the uploaded file');

            // File type/category, e.g. video, image, document
            $table->string('type', 50)
                ->comment('File type/category');

            // Local disk storage path relative to storage/app/public; nullable in case file not stored locally
            $table->string('local_path', 1024)
                ->nullable()
                ->comment('Local storage path relative to storage disk');

            // Google Drive file ID, unique for each file
            $table->string('google_drive_id', 128)
                ->unique()
                ->comment('Google Drive unique file ID');

            // Public Google Drive URL, url length increased to accommodate long URLs
            $table->string('google_drive_url', 2048)
                ->comment('Public Google Drive URL');

            // MIME content type of the uploaded file, nullable if unknown
            $table->string('mime_type', 100)
                ->nullable()
                ->comment('MIME content type');

            // File size in bytes, nullable if unknown
            $table->unsignedBigInteger('size')
                ->nullable()
                ->comment('File size in bytes');

            // Optional description or additional notes about this menu item
            $table->text('description')
                ->nullable()
                ->comment('Additional description or notes');

            // Timestamp of when the file was uploaded
            $table->timestamp('uploaded_at')
                ->nullable()
                ->comment('Timestamp when file was uploaded');

            // Standard Laravel timestamps (created_at, updated_at)
            $table->timestamps();

            // Add indexes for optimized queries on foreign keys
            $table->index('client_id');
            $table->index('created_by');

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
