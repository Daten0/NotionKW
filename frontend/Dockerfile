# Menggunakan image Nginx Alpine yang sangat ringan
FROM nginx:alpine

# Salin semua file frontend ke direktori default Nginx
COPY . /usr/share/nginx/html

# Expose port 80 (default HTTP)
EXPOSE 80

# Tidak perlu CMD karena nginx:alpine sudah menjalankan server otomatis