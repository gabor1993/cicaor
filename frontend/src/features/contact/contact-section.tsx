"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { hu } from "@/content/hu";
import { durationsFor, fitDuration, parseSelection, type PackageSelection } from "@/features/pricing/lib/pricing";
import { isDemo } from "@/lib/site-mode";
import { contactSchema } from "./schema";

// A package chosen in the pricing section arrives in the URL. useSearchParams needs a Suspense
// boundary in a static export, so only this reader is client-rendered, not the whole form.
function UrlSelectionReader({ onSelect }: { onSelect: (selection: PackageSelection) => void }) {
  const search = useSearchParams().toString();
  useEffect(() => {
    if (search) onSelect(parseSelection(search));
  }, [search, onSelect]);
  return null;
}

const endpoint = process.env.NEXT_PUBLIC_CONTACT_API_URL ?? "/backend/contact.php";

type Status = "idle" | "sending" | "success" | "error" | "rateLimited" | "demo";
type FieldErrors = Partial<Record<string, string>>;

const inputClass =
  "mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm aria-[invalid=true]:border-red-600";

export function ContactSection() {
  const { contact, packages } = hu;
  const [selection, select] = useState<PackageSelection>(() => parseSelection(""));
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const parsed = contactSchema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      packageId: selection.packageId,
      duration: String(selection.duration),
      message: form.get("message"),
      consent: form.get("consent") === "on",
      website: form.get("website") ?? "",
    });

    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    // The demo validates like the real form but never sends personal data anywhere.
    if (isDemo) return setStatus("demo");
    setStatus("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (response.status === 429) return setStatus("rateLimited");
      if (!response.ok) return setStatus("error");
      setStatus("success");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  const fieldProps = (name: string) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const fieldError = (name: string) =>
    errors[name] && (
      <p id={`${name}-error`} className="mt-1 text-xs text-red-700 dark:text-red-400">
        {errors[name]}
      </p>
    );

  return (
    <section id="kapcsolat" aria-labelledby="contact-title" className="px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading id="contact-title" eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} />
      <Suspense fallback={null}>
        <UrlSelectionReader onSelect={select} />
      </Suspense>

      <form noValidate onSubmit={handleSubmit} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
        <label className="text-sm sm:col-span-1">
          {contact.fields.name}
          <input name="name" autoComplete="name" required className={inputClass} {...fieldProps("name")} />
          {fieldError("name")}
        </label>
        <label className="text-sm sm:col-span-1">
          {contact.fields.email}
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            {...fieldProps("email")}
          />
          {fieldError("email")}
        </label>
        <label className="text-sm sm:col-span-2">
          {contact.fields.phone}
          <input name="phone" type="tel" autoComplete="tel" className={inputClass} {...fieldProps("phone")} />
        </label>
        <label className="text-sm">
          {contact.fields.package}
          <select
            value={selection.packageId}
            onChange={(event) => {
              const packageId = event.target.value as typeof selection.packageId;
              select({ packageId, duration: fitDuration(packageId, selection.duration) });
            }}
            className={inputClass}
          >
            <option value="">{contact.fields.packageNone}</option>
            {packages.items.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          {contact.fields.duration}
          <select
            value={selection.duration}
            onChange={(event) =>
              select({ ...selection, duration: Number(event.target.value) as typeof selection.duration })
            }
            className={inputClass}
            {...fieldProps("duration")}
          >
            {durationsFor(selection.packageId).map((duration) => (
              <option key={duration} value={duration}>
                {duration} {packages.minutes}
              </option>
            ))}
          </select>
          {fieldError("duration")}
        </label>
        <label className="text-sm sm:col-span-2">
          {contact.fields.message}
          <textarea
            name="message"
            rows={5}
            maxLength={2000}
            required
            className={inputClass}
            {...fieldProps("message")}
          />
          {fieldError("message")}
        </label>

        {/* Honeypot, hidden from people and assistive tech. */}
        <div aria-hidden className="absolute -left-[9999px]">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-start gap-2 text-sm">
            <input name="consent" type="checkbox" className="mt-1" {...fieldProps("consent")} />
            <span>
              {contact.fields.consent.before} {/* A new tab keeps what the visitor has already typed into the form. */}
              <a
                href="/adatkezelesi-tajekoztato/"
                target="_blank"
                rel="noopener"
                className="font-bold underline underline-offset-2 hover:text-accent"
              >
                {contact.fields.consent.link}
                <span className="sr-only"> {contact.fields.consent.newTab}</span>
              </a>
              {contact.fields.consent.after}
            </span>
          </label>
          {fieldError("consent")}
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-accent px-8 py-2.5 text-sm font-bold text-on-accent disabled:opacity-60"
          >
            {status === "sending" ? contact.sending : contact.submit}
          </button>
          <p role="status" className="mt-4 text-sm">
            {status === "success" && contact.success}
            {status === "error" && contact.genericError}
            {status === "rateLimited" && contact.rateLimited}
            {status === "demo" && hu.demo.formSent}
          </p>
        </div>
      </form>
    </section>
  );
}
