# ExamAce — Deployment Guide v2.4.0

Complete production deployment guide for the ExamAce WAEC/GCE preparation platform.

---

## 📦 What's Included

```
waec-gce-prep/
├── index.html                    Homepage
├── subjects.html                 24 subjects index
├── practice.html                 Interactive Q&A
├── solutions.html                STEM step-by-step
├── past-questions.html           40+ WAEC past Qs
├── bundles.html                  Year bundle hub
├── math-50.html                  50 extra math Qs
├── mock-exam.html                Timed exam engine
├── gamification.html             XP, streaks, badges
├── login.html                    User auth
├── manifest.json                 PWA manifest
├── sw.js                         Service worker (offline)
├── capacitor.config.json         iOS/Android wrapper
├── DEPLOYMENT.md                 This file
│
├── admin/                        Admin panel (7 pages)
│   ├── login.html                Demo creds: admin/admin123
│   ├── dashboard.html            KPIs, alerts
│   ├── users.html                CRUD users
│   ├── content.html              Subject content
│   ├── questions.html            Q&A bank editor
│   ├── reports.html              Analytics
│   └── settings.html             Roles & profile
│
├── wireframes/
│   └── admin-wireframe.html      Low-fi blueprints (7 tabs)
│
├── subjects/                     5 subject pages with PDFs
│   ├── mathematics.html, physics.html
│   ├── chemistry.html, biology.html, english.html
│
├── practicals/                   NEW — Lab guides
│   ├── index.html
│   ├── chemistry-practical.html  10 practicals
│   ├── physics-practical.html    10 practicals
│   └── biology-practical.html    8 practicals
│
├── essays/                       Model answers
│   ├── index.html
│   ├── english-essay.html        7 essay types
│   └── government-essay.html     10 theory questions
│
├── bundles/                      Year-specific
│   └── waec-2018.html ... waec-2024.html (7 bundles)
│
├── videos/                       NEW — Video lessons
│   └── index.html                12+ embedded videos
│
├── ai-tutor/                     NEW — Chat AI
│   └── index.html                Rule-based + GPT-ready
│
├── languages/                    NEW — Native languages
│   └── index.html                Yoruba, Igbo, Hausa
│
├── premium/                      NEW — Subscriptions
│   └── index.html                3 tiers + 4 gateways
│
├── css/style.css                 Main styles
└── js/
    ├── main.js                   Core utilities
    ├── pdf-export.js             Client PDF (jsPDF)
    ├── mock-exam.js              Exam engine
    └── firebase-config.js        NEW — Backend
```

---

## 🚀 Deployment Options

### Option 1: Static Hosting (Simplest — 5 minutes)

**Netlify (Recommended):**
```bash
1. Unzip waec-gce-prep.zip
2. Visit https://app.netlify.com/drop
3. Drag the unzipped folder onto the page
4. Get live URL: https://your-site.netlify.app
```

**Vercel:**
```bash
npm i -g vercel
cd waec-gce-prep
vercel
```

**GitHub Pages:**
```bash
1. Create new GitHub repo
2. Upload all files
3. Settings → Pages → Source: main branch
4. Live at: https://username.github.io/repo-name
```

**Firebase Hosting:**
```bash
npm i -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Option 2: Full Stack with Firebase Backend

**Setup Firebase (15 minutes):**

1. Go to https://console.firebase.google.com
2. Create project: `examace-prod`
3. Enable services:
   - **Authentication** → Email/Password + Google sign-in
   - **Firestore Database** → Production mode
   - **Storage** → For images, PDFs
   - **Hosting** → Connect domain
   - **Functions** → For server-side logic
   - **Analytics** → User behavior tracking

4. Copy config from Project Settings → Web App

5. Replace placeholders in `js/firebase-config.js`:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",        // Replace
  authDomain: "examace-prod.firebaseapp.com",
  projectId: "examace-prod",
  // ...
};
```

6. Deploy security rules from comments in `firebase-config.js`

7. Uncomment Firebase calls in the file (currently in demo mode)

### Option 3: Mobile App (iOS + Android via Capacitor)

```bash
# Install Capacitor
npm init -y
npm i @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

# Initialize (uses capacitor.config.json)
npx cap init

# Add platforms
npx cap add android
npx cap add ios

# Sync web assets
npx cap copy

# Open in IDE
npx cap open android   # → Android Studio
npx cap open ios       # → Xcode (Mac only)

# Build & submit:
# - Android: Build → Generate Signed Bundle → Play Console
# - iOS: Product → Archive → App Store Connect
```

---

## 💳 Payment Gateway Integration

### Paystack (Nigeria — Recommended)

Add to `premium/index.html` before `</body>`:
```html
<script src="https://js.paystack.co/v1/inline.js"></script>
<script>
function payWithPaystack(plan, amount) {
  const handler = PaystackPop.setup({
    key: 'pk_live_YOUR_PUBLIC_KEY',
    email: currentUser.email,
    amount: amount * 100,  // kobo
    currency: 'NGN',
    ref: 'ExamAce-' + Date.now(),
    metadata: { plan, uid: currentUser.uid },
    callback: function(response) {
      // Verify on backend, then activate subscription
      fetch('/api/verify-payment?ref=' + response.reference)
        .then(r => r.json()).then(d => {
          if (d.success) window.location = '/dashboard.html';
        });
    }
  });
  handler.openIframe();
}
</script>
```

### Flutterwave (Multi-currency)
```html
<script src="https://checkout.flutterwave.com/v3.js"></script>
<script>
FlutterwaveCheckout({
  public_key: "FLWPUBK_TEST-xxx",
  tx_ref: "ExamAce-" + Date.now(),
  amount: 2500,
  currency: "NGN",
  payment_options: "card,mobilemoney,ussd",
  customer: { email: currentUser.email },
  callback: data => { /* verify */ },
});
</script>
```

---

## 🔐 Security Checklist

Before going live:

- [ ] Replace all demo credentials (`admin/admin123`)
- [ ] Set strong Firestore security rules (template in firebase-config.js)
- [ ] Enable HTTPS only (auto on Netlify/Vercel/Firebase)
- [ ] Configure CORS for API endpoints
- [ ] Set up rate limiting on auth endpoints (1000 req/hour)
- [ ] Enable email verification on signup
- [ ] Add password complexity requirements (8+ chars, mixed case, number)
- [ ] Implement 2FA for admin accounts
- [ ] Set session timeout (30 min idle)
- [ ] Regular automated backups (daily Firestore export)
- [ ] Add Content Security Policy headers
- [ ] Set up monitoring (Sentry for errors, Pingdom for uptime)
- [ ] GDPR/NDPR compliance: cookie banner, privacy policy, data export

---

## 📊 Production Checklist

### Pre-launch
- [ ] Domain name purchased (e.g., examace.edu)
- [ ] SSL certificate active (Let's Encrypt or Cloudflare)
- [ ] CDN configured (Cloudflare free tier)
- [ ] Google Analytics 4 + Search Console set up
- [ ] Sitemap.xml generated and submitted
- [ ] robots.txt configured
- [ ] OpenGraph + Twitter Card meta tags
- [ ] Favicon set (favicon.ico, apple-touch-icon.png)

### Day 1 Operations
- [ ] Customer support email + WhatsApp number
- [ ] Status page (status.examace.edu)
- [ ] Social media accounts (Twitter, Instagram, Facebook, TikTok)
- [ ] Welcome email automation (SendGrid/Mailgun)
- [ ] Push notification configured (Firebase Cloud Messaging)

### Growth
- [ ] Referral program (₦500 credit per friend)
- [ ] School partnership outreach
- [ ] SEO content marketing (blog posts on subjects)
- [ ] YouTube channel for video content
- [ ] WAEC/Council partnerships for official content

---

## 🛠 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML/CSS/JS (no framework — fast, lightweight) |
| Styling | Custom CSS with CSS variables |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Storage | Firebase Storage / Cloudflare R2 |
| Hosting | Netlify / Vercel / Firebase Hosting |
| CDN | Cloudflare |
| PDFs | jsPDF (client-side) |
| Analytics | Firebase Analytics + Google Analytics 4 |
| Errors | Sentry |
| Payments | Paystack (NG), Flutterwave (Africa), Stripe (intl) |
| Mobile | Capacitor (iOS + Android wrappers) |
| Email | SendGrid / Mailgun |
| Push | Firebase Cloud Messaging |
| AI | OpenAI GPT-4 / Google Gemini API |

---

## 📞 Support

- Email: support@examace.edu
- Docs: https://docs.examace.edu
- Discord: https://discord.gg/examace
- GitHub: https://github.com/examace/platform

---

**Built with ❤️ for African students. Pass guaranteed. Future secured.**
