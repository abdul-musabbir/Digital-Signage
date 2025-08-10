FROM unit:1.34.1-php8.3

# Install system dependencies and PHP extensions
RUN apt update && apt install -y \
    curl unzip git libicu-dev libzip-dev libpng-dev libjpeg-dev libfreetype6-dev libssl-dev \
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

# Install Bun before use
RUN curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun && \
    bun --version

# Set working directory
WORKDIR /var/www/html

# Create necessary Laravel directories and set permissions
RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache \
    && chown -R unit:unit /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Copy project files
COPY . .

# Re-apply permissions after copying
RUN chown -R unit:unit storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Install PHP dependencies with Composer
RUN composer install --prefer-dist --optimize-autoloader --no-interaction

# Copy Unit server config
COPY unit.json /docker-entrypoint.d/unit.json

# Install and build frontend (if package.json exists)
RUN if [ -f package.json ]; then \
    echo "package.json found, installing frontend dependencies..." && \
    bun install && \
    bun run build; \
    else \
    echo "No package.json, skipping frontend build."; \
    fi

# Expose HTTP port
EXPOSE 8000

# Start Unit
CMD ["unitd", "--no-daemon"]