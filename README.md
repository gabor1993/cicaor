# CicaŐr

Website for a cat sitting service.

- `/` – home page: hero, highlights, about, services with a price summary, gallery with lightbox, reviews, FAQ and the contact form.
- `/arak/` – detailed pricing: packages with 30/60/90 minute visits, multi-day offers and add-ons. "Kiválasztom" links to `/?csomag=<id>&ido=<minutes>#kapcsolat`, which pre-fills the contact form.

- `frontend/` – Next.js (App Router, TypeScript strict, Tailwind CSS v4), static export (`output: "export"`).
- `backend/` – small PHP endpoint (`contact.php`) that validates the contact form and sends an e-mail.

## Requirements
- Node.js LTS and npm
- PHP 8.1+ (the project was tested with 8.3)

## Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm run build      # static site in frontend/out
npm test           # Vitest
npm run lint
npm run typecheck
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CONTACT_API_URL` | Full URL of `backend/contact.php`. Falls back to `/backend/contact.php`. It is public by design (inlined at build time), so never put secrets in it. |

All Hungarian copy lives in `frontend/src/content/hu.ts`. Prices marked `TODO` there (30 and 90 minute visits) are placeholders and must be confirmed before launch.

## Backend

```bash
cd backend
cp .env.example .env     # then edit the values
php tests/validation-test.php
```

| Variable | Purpose |
| --- | --- |
| `MAIL_DRIVER` | `log` writes mails to `storage/mail.log` (development), `mail` uses PHP `mail()` |
| `MAIL_TO` / `MAIL_FROM` | Recipient and sender address |
| `ALLOWED_ORIGINS` | Comma separated origins allowed by CORS, e.g. `https://your-site.example` |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_SECONDS` | Requests allowed per IP per window |

Never commit `.env`.

## Deploy checklist
1. Build the frontend with the production `NEXT_PUBLIC_CONTACT_API_URL`, upload `frontend/out` to Netlify (or any static host).
2. Netlify cannot run PHP: host `backend/` on a PHP-capable server and make sure `.env`, `src/` and `storage/` are not publicly readable (the `.htaccess` files cover Apache).
3. Set `ALLOWED_ORIGINS` to the exact production origin, `MAIL_DRIVER=mail`, and configure SPF/DKIM/DMARC for the sending domain.
4. Replace placeholder photos (`PhotoPlaceholder`), `TODO` texts and social links.
5. Run `npm test`, `npm run lint`, `npm run build`, `npm audit` and `composer audit` (if Composer is introduced).

## Decisions
- **Typed content file instead of `next-intl`:** the site is Hungarian only, so a typed dictionary avoids an extra dependency. It can be migrated to `next-intl` if more languages are needed.
- **Plain PHP endpoint instead of Laravel:** one form does not justify a framework.
- **URL parameters instead of shared React state for the chosen package:** the pricing cards live on another page, and React context does not survive navigation. The values are validated against the known packages before use.
- **Light theme only by default:** the design is light. Dark tokens exist behind `data-theme="dark"` but nothing toggles them yet.
- **Zod on the frontend and manual checks in PHP:** rules are mirrored by hand in `schema.ts` and `validation.php`; keep them in sync.
