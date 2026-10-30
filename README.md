# CicaŐr

Website for a cat sitting service.

- `/` – single page: hero, highlights, about, services, detailed pricing (`#arak`: packages with 30/60/90 minute visits and daily multi-day rates, collapsible add-ons), FAQ and the contact form. "Kiválasztom" links to `/?csomag=<id>&ido=<minutes>#kapcsolat`, which pre-fills the contact form. The gallery and reviews sections are hidden until real content exists.
- `/adatkezelesi-tajekoztato/` and `/aszf/` – privacy policy and terms, rendered from `frontend/src/content/legal-hu.ts`. Every `[TODO: …]` must be filled in and both texts reviewed by a lawyer before going live.

- `frontend/` – Next.js (App Router, TypeScript strict, Tailwind CSS v4), static export (`output: "export"`).
- `backend/` – small PHP endpoint (`contact.php`) that validates the contact form and sends an e-mail.

## Requirements
- Node.js LTS and npm
- PHP 8.1+ (the project was tested with 8.3) and Composer

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
composer install
cp .env.example .env     # then edit the values
php tests/validation-test.php
php tests/mail-template-test.php
```

Every enquiry sends two HTML mails (with a plain-text alternative) through SMTP with PHPMailer: a notification to `MAIL_TO` and a confirmation to the visitor. The templates are in `backend/templates/`. The confirmation never repeats the visitor's message, because anyone can type someone else's address into the form.

| Variable | Purpose |
| --- | --- |
| `MAIL_DRIVER` | `smtp` sends real mail, `log` writes it to `storage/mail.log` plus an `.html` preview per mail type (development) |
| `MAIL_TO` / `MAIL_FROM` / `MAIL_FROM_NAME` | Recipient, sender address and sender name |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_ENCRYPTION` | SMTP server; `587` with `tls` (STARTTLS) or `465` with `ssl` |
| `SMTP_USERNAME` / `SMTP_PASSWORD` | SMTP login of the sending mailbox |
| `ALLOWED_ORIGINS` | Comma separated origins allowed by CORS, e.g. `https://your-site.example` |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_SECONDS` | Requests allowed per IP per window |

Never commit `.env`.

## Deploy checklist
1. Build the frontend with the production `NEXT_PUBLIC_CONTACT_API_URL`, upload `frontend/out` to Netlify (or any static host).
2. Netlify cannot run PHP: host `backend/` on a PHP-capable server, run `composer install --no-dev` there, and make sure `.env`, `composer.*`, `src/`, `templates/`, `tests/`, `vendor/` and `storage/` are not publicly readable (the `.htaccess` files cover Apache).
3. Set `ALLOWED_ORIGINS` to the exact production origin, `MAIL_DRIVER=smtp` with the SMTP values, and configure SPF/DKIM/DMARC for the sending domain. `MAIL_FROM` must be the mailbox the SMTP login belongs to.
4. Replace placeholder photos (`PhotoPlaceholder`), `TODO` texts and social links.
5. Run `npm test`, `npm run lint`, `npm run build`, `npm audit` and `composer audit`.

## Decisions
- **Typed content file instead of `next-intl`:** the site is Hungarian only, so a typed dictionary avoids an extra dependency. It can be migrated to `next-intl` if more languages are needed.
- **Plain PHP endpoint instead of Laravel:** one form does not justify a framework.
- **URL parameters instead of shared React state for the chosen package:** the pricing cards live on another page, and React context does not survive navigation. The values are validated against the known packages before use.
- **Light theme only by default:** the design is light. Dark tokens exist behind `data-theme="dark"` but nothing toggles them yet.
- **Zod on the frontend and manual checks in PHP:** rules are mirrored by hand in `schema.ts` and `validation.php`; keep them in sync.
