# CicaŐr

Website for a cat sitting service.

- `/` – single page: hero, highlights, about, services, detailed pricing (`#arak`: packages with 30/60/90 minute visits and daily multi-day rates, collapsible add-ons), FAQ and the contact form. "Kiválasztom" links to `/?csomag=<id>&ido=<minutes>#kapcsolat`, which pre-fills the contact form. The gallery and reviews sections are hidden until real content exists.
- `/adatkezelesi-tajekoztato/` and `/aszf/` – privacy policy and terms, rendered from `frontend/src/content/legal-hu.ts`. Every `[TODO: …]` must be filled in and both texts reviewed by a lawyer before going live.

- `frontend/` – Next.js (App Router, TypeScript strict, Tailwind CSS v4), static export (`output: "export"`).
- `backend/` – small PHP endpoint (`contact.php`) that validates the contact form and sends an e-mail.
- `cms/` – headless WordPress plugin (`cicaor-content`) that makes the site's content editable.

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
| `CMS_URL` | Base URL of the WordPress CMS, e.g. `https://cms.example.hu`. Build-time only, not exposed to the browser. Without it the build uses the committed snapshot. |
| `SITE_URL` | Public origin, e.g. `https://cicaor.hu`. Used for canonical URLs, the sitemap, `robots.txt`, Open Graph and JSON-LD. Defaults to `http://localhost:3000`. |

On Netlify's production build (`CONTEXT=production`), `SITE_URL`, `NEXT_PUBLIC_CONTACT_API_URL` and `CMS_URL` are required and must be `https`; the build stops otherwise (`src/lib/build-env.ts`). After the build, `scripts/write-headers.mts` writes `out/_headers` with the security headers (CSP, framing, referrer and permissions policy); the CSP allows fetches only to the contact backend's origin.

Components read all copy through `frontend/src/content/hu.ts`. It holds the fixed interface text and merges in the editable content from `site-content.json`, which the CMS owns.

## Content (WordPress CMS)

The public site stays a static export on Netlify. A separate WordPress (for example on a `cms.` subdomain) is only an admin interface:

1. Editors change texts, prices, add-ons, FAQ, reviews and images in WordPress (menu "CicaŐr tartalom").
2. Saving schedules a Netlify build hook call one minute later, so a series of edits triggers one build.
3. Before every build, `npm run prebuild` (`scripts/pull-cms-content.mts`) fetches `?rest_route=/cicaor/v1/content`, downloads the images into `public/cms/` (resized WebP), validates everything against `src/content/site-content-schema.ts` and writes `src/content/site-content.json`.
4. Invalid or incomplete content fails the build, and Netlify keeps serving the previous deploy.

Package ids (`komfort`, `moka`, `lux`) and their bookable durations stay in code, because the contact form validation depends on them.

```bash
php cms/bundle.php                                    # cms/dist/cicaor-content.zip with the current content as seed
CMS_URL=https://cms.example.hu npm run cms:pull       # refresh the snapshot locally (from frontend/), then commit it
```

Setting up a new WordPress: install WordPress (PHP 8.3+), upload `cicaor-content.zip` under Plugins → Add New → Upload Plugin, activate it, and use "CicaŐr tartalom → Kezdeti tartalom" once. Under "Beállítások" set the website URL (visitors of the CMS front end are redirected there) and the Netlify build hook. Then set `CMS_URL` in the Netlify environment variables.

## Backend

```bash
cd backend
composer install
cp .env.example .env     # then edit the values
php tests/validation-test.php
php tests/mail-template-test.php
php tests/rate-limit-test.php
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
1. Set `SITE_URL`, `NEXT_PUBLIC_CONTACT_API_URL` and `CMS_URL` in Netlify's environment variables and let Netlify build from git (the production build refuses to run without them).
2. Netlify cannot run PHP: host `backend/` on a PHP-capable server, run `composer install --no-dev` there, and make sure `.env`, `composer.*`, `src/`, `templates/`, `tests/`, `vendor/` and `storage/` are not publicly readable (the `.htaccess` files cover Apache).
3. Set `ALLOWED_ORIGINS` to the exact production origin, `MAIL_DRIVER=smtp` with the SMTP values, and configure SPF/DKIM/DMARC for the sending domain. `MAIL_FROM` must be the mailbox the SMTP login belongs to.
4. Upload the missing photos in the CMS (about, gallery), fill in the `TODO` texts and social links.
5. Run `npm test`, `npm run lint`, `npm run build`, `npm audit` and `composer audit`.

## Decisions
- **Typed content file instead of `next-intl`:** the site is Hungarian only, so a typed dictionary avoids an extra dependency. It can be migrated to `next-intl` if more languages are needed.
- **Headless WordPress, fetched at build time:** the owner wanted a familiar admin interface on the PHP hosting the contact backend needs anyway. Fetching at build time keeps the site static and fast, and the site keeps working when WordPress is down. Images are copied into the build, so the CMS host serves no public traffic.
- **Own small plugin instead of ACF:** the free ACF has no repeaters or options pages, and a plugin with plain meta boxes has no paid dependency and exposes exactly one read-only endpoint.
- **Plain PHP endpoint instead of Laravel:** one form does not justify a framework.
- **URL parameters instead of shared React state for the chosen package:** the pricing cards live on another page, and React context does not survive navigation. The values are validated against the known packages before use.
- **Light theme only by default:** the design is light. Dark tokens exist behind `data-theme="dark"` but nothing toggles them yet.
- **Zod on the frontend and manual checks in PHP:** rules are mirrored by hand in `schema.ts` and `validation.php`; keep them in sync.
