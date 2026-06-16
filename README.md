# Ngebeng Payment Webhook

Sistem webhook payment untuk Midtrans yang melayani multiple aplikasi (apk1, apk2, apk3).

## Arsitektur

```
Midtrans → POST /api/webhook/midtrans → Webhook Service → PostgreSQL
                                                          ↓
Apps (Pull API) ← GET /api/transactions ← Webhook Service
```

## API Endpoints

### 1. Register Aplikasi
```bash
POST /api/apps/register
Body: { "name": "Aplikasi 1", "appCode": "APK1" }
```
Response: `{ id, name, appCode, apiKey, isActive }`

### 2. Webhook Midtrans (PUBLIC)
```bash
POST /api/midtrans/webhook
```
Endpoint ini didaftarkan di dashboard Midtrans. Menerima notifikasi pembayaran.
URL: `https://bangparjo.shop/api/midtrans/webhook`

### 3. Cek Transaksi (PROTECTED - perlu API Key)
```bash
GET /api/transactions?order_id=APK1_10001
Headers: X-API-Key: <api_key>
```

### 4. Health Check
```bash
GET /api/health
```

## Format Order ID

```
{appCode}_{nomor_unik}
Contoh: APK1_20260612_0001, APK2_10001
```

## Cara Penggunaan

### 1. Setup Database
```bash
# Jalankan PostgreSQL (via Docker)
docker compose up -d postgres

# Atau gunakan PostgreSQL yang sudah ada
# Update DATABASE_URL di .env

# Migrate database
npm run db:push

# Seed data (buat 3 aplikasi default)
npm run db:seed
```

### 2. Jalankan Development
```bash
npm run dev
```

### 3. Daftarkan Aplikasi
```bash
curl -X POST http://localhost:3000/api/apps/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Aplikasi 1", "appCode": "APK1"}'
```

### 4. Daftarkan Webhook di Midtrans
- Buka dashboard Midtrans (Sandbox)
- Masuk ke Settings → Notification
- Set Payment Notification URL: `https://domain-anda.com/api/webhook/midtrans`
- Set Finish/Unfinish/Error Redirect URL sesuai kebutuhan

### 5. Apps Cek Status Transaksi
```bash
curl http://localhost:3000/api/transactions?order_id=APK1_10001 \
  -H "X-API-Key: <api_key_dari_registrasi>"
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `MIDTRANS_SERVER_KEY` | Midtrans Server Key (sandbox/production) |
| `MIDTRANS_CLIENT_KEY` | Midtrans Client Key |
| `MIDTRANS_MERCHANT_ID` | Midtrans Merchant ID |
| `LOG_LEVEL` | Log level (info, debug, warn, error) |

## Deployment (VPS)

### Using Docker
```bash
# Set environment variables
export MIDTRANS_SERVER_KEY="your-key"
export MIDTRANS_CLIENT_KEY="your-key"
export MIDTRANS_MERCHANT_ID="your-id"

# Jalankan
docker compose up -d
```

### Manual (tanpa Docker)
```bash
npm run build
npm start
```

## Teknologi

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma 7
- **Logger**: Pino
- **Auth**: API Key via Proxy
