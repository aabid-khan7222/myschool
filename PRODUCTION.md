# Production setup (Render)

Use this checklist so the app works when you open the **production links**.

**If login shows "Unexpected end of JSON input" or "Server returned empty response":**  
Set **CORS_ORIGIN** on the Web Service (your frontend URL) and **VITE_API_URL** on the Static Site (your backend URL + `/api`), then redeploy both. See below.

---

## 1. Web Service (Backend) – Environment

In Render → your **Web Service** → **Environment**, set:

| Key | Value | Notes |
|-----|--------|--------|
| `DATABASE_URL` | *(Internal Database URL from Render Postgres)* | Required. Use the **Internal** URL. |
| `JWT_SECRET` | *(strong random string)* | Required. |
| `NODE_ENV` | `production` | Required. |
| `CORS_ORIGIN` | `https://YOUR-STATIC-SITE-URL.onrender.com` | Your **Static Site** URL (no trailing slash). Required so the browser can call the API. |

If you have more than one frontend URL, set:

`CORS_ORIGIN=https://site1.onrender.com,https://site2.onrender.com`

---

## 2. Static Site (Frontend) – Environment

In Render → your **Static Site** → **Environment**, set:

| Key | Value | Notes |
|-----|--------|--------|
| `VITE_API_URL` | `https://YOUR-WEB-SERVICE-URL.onrender.com/api` | Your **Web Service** URL + `/api`. Required so the frontend calls the correct API. |

Replace `YOUR-WEB-SERVICE-URL` with your actual Web Service host (e.g. `myschool-abc123` → `https://myschool-abc123.onrender.com/api`).

After changing env, run **Manual Deploy** on the Static Site (build must run again to pick up `VITE_API_URL`).

---

## 3. After changing env

- **Web Service:** Save → **Manual Deploy** (or wait for auto deploy).
- **Static Site:** Save → **Manual Deploy** (so the new build uses `VITE_API_URL`).

---

## 4. Quick test

1. Open your **Static Site** URL in the browser.
2. Log in (or sign up if applicable).
3. If you see CORS or “Failed to fetch” errors, check:
   - Web Service has `CORS_ORIGIN` = exact Static Site URL (same as in the address bar).
   - Static Site has `VITE_API_URL` = Web Service URL + `/api` and you redeployed after setting it.

No code changes are required; only the above env vars need to be set correctly on Render.
