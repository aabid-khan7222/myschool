# Render: Backend ko Docker se deploy karna (Create School ke liye zaruri)

**Create School** tabhi kaam karega jab server par **pg_dump** aur **psql** hon. Ye **Node** runtime mein nahi hote; **Docker** se deploy karne par `Dockerfile` mein `postgresql-client` install hota hai.

---

## Option A: Naya Web Service Docker se (recommended)

1. **Render Dashboard** → **New +** → **Web Service**
2. Same repo connect karo (GitHub/GitLab).
3. **Root Directory** mein `server` likho (backend folder).
4. Render ko **Docker** detect karna chahiye (`server/Dockerfile` ki wajah se). Agar **Environment** dropdown mein **Docker** dikhe to use select karo.
5. **Name** do (e.g. `myschool-backend`).
6. **Environment** tab mein saare env vars add karo (jo purane Node service mein the):
   - `DATABASE_URL`
   - `PROVISIONING_SOURCE_DATABASE_URL`
   - `MASTER_DATABASE_URL`
   - `JWT_SECRET`, `CORS_ORIGIN`, etc.
7. **Create Web Service** → deploy hone do.
8. Purana Node wala service delete kar sakte ho ya disable kar do; naye Docker service ka URL frontend/env mein use karo.

---

## Option B: Blueprint se (repo mein render.yaml hai)

1. **Dashboard** → **Blueprints** → **New Blueprint Instance**
2. Repo select karo; Render `render.yaml` use karega.
3. Service create hone ke baad **Environment** mein env vars add karo (DATABASE_URL, PROVISIONING_SOURCE_DATABASE_URL, etc.).

---

## Option C: Purana Node service ko Docker mein badalna

Render purane service ka **runtime (Node → Docker)** change karne ka option nahi deta. Isliye:

- **Naya Web Service** banao (Option A) aur **Docker** se deploy karo,  
  **ya**
- Purane service ko delete karke **Blueprint** (Option B) se naya Docker service banao.

Phir naye service ka URL use karo; env vars copy kar lena.

---

## Verify

Deploy ke baad **Create School** try karo. Agar ab bhi error aaye to Render **Logs** mein dekho — "pg_dump not found" aana chahiye nahi (Docker image mein postgresql-client hai).
