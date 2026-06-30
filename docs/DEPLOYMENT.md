# Deployment Guide — Vercel

## Prerequisites

- A [Vercel](https://vercel.com) account
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster (M0 free tier is fine to start)
- A [Cloudinary](https://cloudinary.com) account
- A [Resend](https://resend.com) account

---

## Step 1 — Prepare MongoDB Atlas

1. Create a free **M0 cluster** at https://cloud.mongodb.com
2. Under **Database Access** → create a user with **Read and Write** privileges
3. Under **Network Access** → add `0.0.0.0/0` (allow from anywhere) — Vercel uses dynamic IPs
4. Under **Databases** → click **Connect** → choose **Drivers** → copy the connection string
   - Replace `<password>` with your database user's password
   - Append `/arisa-nutrition` before the query string for the database name

Example:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/arisa-nutrition?retryWrites=true&w=majority
```

---

## Step 2 — Create the First Admin (Atlas UI)

See the [README.md](../README.md#creating-the-first-admin-user-mongodb-atlas) for step-by-step instructions on inserting the admin document.

---

## Step 3 — Deploy to Vercel

### Option A — GitHub Integration (Recommended)

1. Push your project to a GitHub repository
2. Go to https://vercel.com/new → Import the repository
3. Vercel will auto-detect Next.js — click **Deploy**
4. Go to **Project → Settings → Environment Variables** and add all variables from `.env.example`

### Option B — Vercel CLI

```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Add env vars
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
vercel env add RESEND_API_KEY
vercel env add ADMIN_EMAIL
vercel env add NEXT_PUBLIC_APP_URL

# Deploy to production
vercel --prod
```

---

## Step 4 — Environment Variables on Vercel

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | Atlas → Connect → Drivers |
| `JWT_SECRET` | Generate: `openssl rand -base64 48` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard → Account Details |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard → API Keys |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard → API Keys |
| `RESEND_API_KEY` | Resend Dashboard → API Keys |
| `ADMIN_EMAIL` | Your admin email address |
| `NEXT_PUBLIC_APP_URL` | Your Vercel deployment URL |

---

## Step 5 — Verify Deployment

After deployment, test a public endpoint:

```bash
curl https://your-project.vercel.app/api/blogs
```

Expected:
```json
{ "success": true, "message": "Blogs retrieved successfully", "data": { "blogs": [], "pagination": { ... } } }
```

---

## Custom Domain

1. Vercel Dashboard → Project → **Domains**
2. Add your domain (e.g. `api.arisanutrition.com`)
3. Add the provided CNAME/A records to your DNS provider
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

---

## Resend Domain Verification (for emails)

1. Resend Dashboard → **Domains** → Add domain
2. Add the required DNS records (SPF, DKIM, DMARC)
3. Update the `from` address in `lib/resend.ts` to use your verified domain

---

## Serverless Considerations

Vercel runs Next.js as serverless functions. Keep in mind:

- **In-memory rate limiter** (`utils/rateLimit.ts`) does not persist across function invocations. For production-scale rate limiting, replace it with [Upstash Rate Limit](https://github.com/upstash/ratelimit).
- **MongoDB connections** are cached per function instance via the global cache in `lib/db.ts` — this is the correct pattern for serverless.
- **File uploads** go directly to Cloudinary — no local disk storage is used.

---

## Recommended Production Upgrades

| Feature | Upgrade |
|---|---|
| Rate limiting | Upstash Redis + @upstash/ratelimit |
| Logging | Axiom or Vercel Log Drains |
| Monitoring | Sentry |
| Image CDN | Already handled by Cloudinary |
| Caching | Next.js `revalidate` on public routes |
