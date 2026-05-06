# BILLUR ERP — v2 (Next.js 14 + shadcn/ui)

AND BILLUR TEXTILE — Production ERP/MES system. To'liq Next.js + shadcn/ui frontend.

## Stack
- **Backend**: Node.js 20 + Express + TypeScript + PostgreSQL + qrcode
- **Frontend**: Next.js 14 (App Router) + shadcn/ui + Tailwind 3 + TanStack Query + html5-qrcode
- **Database**: PostgreSQL 16

## Tayyor sahifalar (15 ta)

### Yuklagan UI dizaynidagi sahifalar
- ✅ **Dashboard** — `/` real-time stats, production stages, live event feed
- ✅ **Workers** — `/workers` ishchilar ro'yxati
- ✅ **Workers detail** — `/workers/[id]`
- ✅ **Orders** — `/orders` Speka/SET/Standard tabs
- ✅ **Production** — `/production` bosqichlar pipeline
- ✅ **Quality** — `/quality` defektlar va inspeksiya
- ✅ **Inventory** — `/inventory` ombor balansi
- ✅ **Scanning** — `/scanning` real kamera + manual + scan tarixi
- ✅ **Payroll** — `/payroll`

### BILLUR ERP uchun qo'shimcha sahifalar
- ✅ **Login** — `/login` (admin / admin123)
- ✅ **Klientlar** — `/clients` CRUD + balans
- ✅ **Izlishka** — `/surplus` sotuv modal bilan
- ✅ **BoxApp** — `/boxes`
- ✅ **Shipments** — `/shipments`
- ✅ **Print** — `/print`
- ✅ **Hisobotlar** — `/reports` Excel eksport
- ✅ **Foydalanuvchilar** — `/users`
- ✅ **Audit log** — `/audit`

## Lokal ishga tushirish

```bash
# 1. PostgreSQL
docker run -d --name billur-pg -e POSTGRES_PASSWORD=billur -p 5432:5432 postgres:16

# 2. Backend
cd backend
npm install
cp .env.example .env  # DATABASE_URL ni sozlang
npm run migrate       # admin/admin123 yaratiladi
npm run dev           # http://localhost:3001

# 3. Frontend
cd frontend
npm install
npm run dev           # http://localhost:3000
```

Brauzerda: http://localhost:3000/login → **admin / admin123**

## Render'ga deploy

`render.yaml` mavjud, **Blueprint** sifatida import qiling:

1. **Backend** (`billur-erp-api`): Web Service
2. **Frontend** (`billur-erp-web`): Web Service (Next.js runtime, **statik emas**)
3. **Database** (`billur-erp-db`): PostgreSQL

### Muhim — birinchi deploy'da

1. Backend deploy → migration avtomatik admin yaratadi
2. Frontend `BACKEND_URL` env'ga backend URL'ini sozlang (`https://billur-erp-api.onrender.com`)
3. Backend `ALLOWED_ORIGINS` env'ga frontend URL'ini qo'shing

## QR Workflow

1. **Workers** sahifasida QR icon bosing
2. Modal ochiladi → "Yaratish" tugmasi paydo bo'ladi
3. PNG QR rasmi darhol ko'rinadi + **Print** tugmasi
4. **Scanning** sahifasida `html5-qrcode` kameradan scan qiladi
5. Badge auth → bosqich + mahsulot ID + soni → Production event

## Auth tuzatishlar (v2'da)

- ✅ `/api/auth/login` endi `permissions` array qaytaradi
- ✅ `/api/auth/me` to'g'ridan-to'g'ri user qaytaradi (envelope yo'q)
- ✅ Sidebar `owner` rol uchun avtomatik hammasini ko'rsatadi
- ✅ `x-session-token` header ham, cookie ham ishlaydi (proxy uchun)

## Cheklovlar

- Yuklagan UI mock data ba'zi maydonlarni ishlatadi (passport, bank card, salary) — backend'da yo'q. Bu joylar bo'sh.
- Workers detail va Payroll mock ma'lumot ishlatadi.
- Kelajakda backend kengaytirilishi kerak.
