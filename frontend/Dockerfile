# Gunakan image Node.js ringan
FROM node:18-alpine

# Direktori kerja di dalam container
WORKDIR /app

# Salin file dependensi lebih dulu agar cache build efektif
COPY package*.json ./

# Instal dependensi (gunakan npm; ganti dengan yarn/pnpm bila perlu)
RUN npm install

# Salin seluruh source ke container
COPY . .

# Ekspos port dev server Next.js
EXPOSE 3000

# Perintah default; docker-compose akan override menjadi `npm run dev`
CMD ["npm", "run", "dev"]
