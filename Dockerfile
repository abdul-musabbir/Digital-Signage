FROM unit:1.34.1-php8.3

# Install system dependencies and PHP extensions
RUN apt update && apt install -y \
    curl unzip git libicu-dev libzip-dev libpng-dev libjpeg-dev libfreetype6-dev libssl-dev \
    netcat-traditional wait-for-it supervisor \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) pcntl opcache pdo pdo_mysql intl zip gd exif ftp bcmath \
    && pecl install redis \
    && docker-php-ext-enable redis

# PHP configuration
RUN echo "opcache.enable=1" > /usr/local/etc/php/conf.d/custom.ini \
    && echo "opcache.jit=tracing" >> /usr/local/etc/php/conf.d/custom.ini \
    && echo "opcache.jit_buffer_size=256M" >> /usr/local/etc/php/conf.d/custom.ini \
    && echo "memory_limit=512M" >> /usr/local/etc/php/conf.d/custom.ini \
    && echo "upload_max_filesize=64M" >> /usr/local/etc/php/conf.d/custom.ini \
    && echo "post_max_size=64M" >> /usr/local/etc/php/conf.d/custom.ini

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun && \
    bun --version

# Set working directory
WORKDIR /var/www/html

# Create necessary Laravel directories and set permissions
RUN mkdir -p /var/www/html/storage/app/public \
    /var/www/html/storage/framework/cache \
    /var/www/html/storage/framework/sessions \
    /var/www/html/storage/framework/views \
    /var/www/html/storage/logs \
    /var/www/html/bootstrap/cache \
    && chown -R unit:unit /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --prefer-dist --optimize-autoloader --no-interaction --no-dev

# Copy package.json and install frontend dependencies if exists
COPY package*.json bun.lockb* ./
RUN if [ -f package.json ]; then \
    echo "Installing frontend dependencies..." && \
    bun install; \
    fi

# Copy project files
COPY . .

# Build frontend assets if package.json exists
RUN if [ -f package.json ]; then \
    echo "Building frontend assets..." && \
    bun run build; \
    fi

# Re-apply permissions after copying
RUN chown -R unit:unit /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Copy configurations
COPY unit.json /docker-entrypoint.d/unit.json
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Create storage link
RUN php artisan storage:link || true

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Expose HTTP port
EXPOSE 8000

# Use custom entrypoint
ENTRYPOINT ["/entrypoint.sh"]