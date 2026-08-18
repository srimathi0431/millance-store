# Millance Store

Full-stack e-commerce platform with three components:

| Folder | What it is | Tech |
|---|---|---|
| `backend/` | REST API server | FastAPI · Python · PostgreSQL |
| `millance-store/` | Admin + Vendor website | React · TypeScript · Vite |
| `millancestoreapp/` | Customer mobile app | Flutter · Dart |

## Quick Start

```bash
# Backend (port 8026)
cd backend
uvicorn main:app --port 8026 --reload

# Website
cd millance-store
npm install && npm run dev

# Flutter app
cd millancestoreapp
flutter pub get && flutter run
```

## Credentials
- Admin: `admin@millance.store` / `12345678`
- Vendor: `vendor@millance.store` / `12345678`
