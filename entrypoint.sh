#!/bin/bash
set -e

echo "🚀 Starting Laravel application..."

# Function to wait for database
wait_for_db() {
    echo "⏳ Waiting for database connection..."
    
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if nc -z $DB_HOST $DB_PORT 2>/dev/null; then
            echo "✅ Database is ready!"
            return 0
        fi
        
        echo "🔄 Attempt $attempt/$max_attempts: Database not ready, waiting..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ Database connection timeout after $max_attempts attempts"
    exit 1
}

# Function to run Laravel setup
setup_laravel() {
    echo "🔧 Setting up Laravel..."
    
    # Generate app key if not exists
    if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
        echo "🔑 Generating application key..."
        php artisan key:generate --force
    fi
    
    # Clear and optimize
    echo "🧹 Clearing caches..."
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear
    php artisan cache:clear
    
    # Run migrations
    echo "🗄️ Running database migrations..."
    php artisan migrate --force
    
    # Seed database if in development
    if [ "$APP_ENV" = "local" ] || [ "$APP_ENV" = "development" ]; then
        echo "🌱 Seeding database..."
        php artisan db:seed --force || true
    fi
    
    # Create storage link
    echo "🔗 Creating storage link..."
    php artisan storage:link || true
    
    # Cache configurations for production
    if [ "$APP_ENV" = "production" ]; then
        echo "⚡ Optimizing for production..."
        php artisan config:cache
        php artisan route:cache
        php artisan view:cache
    fi
    
    echo "✅ Laravel setup completed!"
}

# Function to create health check route
create_health_check() {
    cat > /tmp/health_routes.php << 'EOF'
<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/health', function () {
    try {
        // Check database connection
        DB::connection()->getPdo();
        
        return response()->json([
            'status' => 'ok',
            'timestamp' => now(),
            'services' => [
                'database' => 'connected',
                'app' => 'running'
            ]
        ]);
    } catch (Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Database connection failed',
            'timestamp' => now()
        ], 503);
    }
});
EOF

    # Append to web routes if health route doesn't exist
    if ! grep -q "/health" routes/web.php 2>/dev/null; then
        echo "" >> routes/web.php
        echo "// Health check route" >> routes/web.php
        cat /tmp/health_routes.php >> routes/web.php
    fi
}

# Main execution
main() {
    # Wait for database if DB_HOST is set
    if [ -n "$DB_HOST" ] && [ "$DB_HOST" != "localhost" ] && [ "$DB_HOST" != "127.0.0.1" ]; then
        wait_for_db
    fi
    
    # Setup Laravel
    setup_laravel
    
    # Create health check
    create_health_check
    
    # Set proper permissions one more time
    chown -R unit:unit /var/www/html/storage /var/www/html/bootstrap/cache
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
    
    echo "🎉 Application is ready!"
    echo "🌐 Starting web server on port 8000..."
    
    # Start Unit daemon
    exec unitd --no-daemon
}

# Run main function
main "$@"