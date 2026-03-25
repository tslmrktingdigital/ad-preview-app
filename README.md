# Ad Preview — Facebook & Instagram

Preview how your ad copy and creative will look on **Facebook Feed** and **Instagram Feed** before you publish.

## Features

- **Primary text** — Main ad copy (caption)
- **Headline** — Optional headline (shown with CTA on Facebook)
- **Call-to-action** — Learn More, Shop Now, Sign Up, etc.
- **Image upload** — Drag & drop or click to add creative
- **Live previews** — Side-by-side Facebook and Instagram mockups

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

For a **stable link** your coworkers can use anytime (no need for your laptop to be on), deploy the app as a website — see **Make it public so coworkers can use it** below.

## Build

```bash
npm run build
npm run preview
```

Previews are styled to resemble real feed ads. Use the "Client / branding" fields to set the page name and username per client.

---

## Make it public so coworkers can use it

**Yes — deploy it as a website.** The app is a static front-end (no server or database). You build it once and host the files; anyone with the link can use it in their browser.

### Option A: Vercel (recommended — free and simple)

1. **Push the project to GitHub** (if you haven’t already):
   - Create a new repo on GitHub, then:
   ```bash
   git init
   git add .
   git commit -m "Ad preview app"
   git remote add origin https://github.com/YOUR_USERNAME/ad-preview-app.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
   - Click **Add New… → Project** and import your `ad-preview-app` repo.
   - Leave the defaults (Framework: Vite, Build command: `npm run build`, Output: `dist`).
   - Click **Deploy**. In about a minute you’ll get a URL like `https://ad-preview-app-xxx.vercel.app`.

3. **Share that URL** with your coworkers. They can use the app like any website; no install, no VPN (unless your company blocks it).

4. **Shareable links for clients (optional):** To use **Get shareable link** (so you can send clients a direct URL to view the preview with playable video):
   - In the Vercel project, go to **Storage** → **Create Database** → **Blob**.
   - Create a new Blob store and name it **`ad-preview-app-blob`** (recommended). Choose **Public** access so the app can save and serve previews.
   - Connect the store to this project if prompted. Redeploy once. The app will then save previews to Blob and give you a link like `https://your-app.vercel.app/view/abc123` to share.
   - **If shareable links ask users to log into Vercel:** In the project go to **Settings** → **Deployment Protection** and set protection to **None** (or turn off “Vercel Authentication”) so the site and `/view/…` links are public.
   - **Multiple creative options:** Use **+ Add option** to add more variants (different copy, headline, CTA, link, feed/story media). Each option has its own label for clients. The shareable link shows tabs so clients can switch between options. Old links without `variants` still load as a single option.

**Updates:** Push to GitHub → Vercel redeploys automatically.

---

### Option B: Netlify (also free)

1. Push the project to GitHub (same as above).

2. Go to [netlify.com](https://netlify.com) → **Add new site → Import an existing project** → connect GitHub and choose the repo.

3. Settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - Deploy. You’ll get a URL like `https://your-site-name.netlify.app`.

4. Share that URL with your team.

---

### Option C: No Git — manual upload (quick test)

1. Run locally: `npm run build`.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the **`dist`** folder from your project. Netlify gives you a live URL right away.

Good for a one-off test; for a stable link for coworkers, use Option A or B so you can redeploy when you change the app.

**Shareable link for clients:** The **Get shareable link** button (so clients can open a URL and see the preview with playable video) works when the app is deployed on **Vercel** with a Blob store enabled. On Netlify or static-only hosting, use **Export as HTML** and share that file instead.
