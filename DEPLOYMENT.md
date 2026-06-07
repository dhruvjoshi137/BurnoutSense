# Deployment Options

For the setup you asked for, use:

- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL from Neon, Supabase, or Render

## Recommended setup

1. Deploy the frontend from the `frontend/` folder to Vercel.
2. Deploy the backend from the `backend/` folder to Render.
3. Create a managed PostgreSQL database on Neon, Supabase, or Render and attach it to the backend service.
4. Set these backend env vars:
   - `DATABASE_URL` to the PostgreSQL connection string
   - `SECRET_KEY` to a long random secret
   - `CORS_ORIGINS` to your Vercel URL, for example `https://your-app.vercel.app`
5. Set this frontend env var in Vercel:
   - `VITE_API_URL` to your Render backend URL, for example `https://your-backend.onrender.com`

6. If Render assigns a different backend URL, update `VITE_API_URL` to match that URL.

## Render backend

Use the existing `backend/Dockerfile` and point Render at the `backend/` directory.
The backend listens on port `8000`.

Render variables to set:

- `DATABASE_URL`
- `SECRET_KEY`
- `CORS_ORIGINS`

Because the backend loads model artifacts from `backend/research/outputs/`, that folder is included in the image.

## Vercel frontend

Deploy the `frontend/` directory.
The SPA rewrite is handled by `frontend/vercel.json`.

Vercel variables to set:

- `VITE_API_URL` = your Render backend public URL

If you want the backend to be restricted, set `CORS_ORIGINS` on Render to your exact Vercel domain, for example `https://your-app.vercel.app`.

## Render blueprint

If you want a single source of truth for the backend service, use the included [render.yaml](render.yaml) file.
It defines the backend web service and keeps the Docker build tied to the `backend/` folder.

## Local container fallback

If you want the full stack locally, use:

```bash
docker compose up --build
```