FROM php:8.2-fpm

# Install library sistem yang dibutuhkan
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Install ekstensi PHP yang wajib untuk Laravel & MySQL
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Set working directory
WORKDIR /var/www/html

# Copy project ke dalam container
COPY . .

# Install dependencies composer (opsional di tahap ini, tapi bagus untuk production)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install

# Set permission agar Laravel bisa tulis log
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

CMD php artisan serve --host=0.0.0.0 --port=8000