"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { durations, hu } from "@/content/hu";
import { parseSelection, type PackageSelection } from "@/features/pricing/lib/pricing";
import { contactSchema } from "./schema";

function subscribeToHistory(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

const endpoint = process.env.NEXT_PUBLIC_CONTACT_API_URL ?? "/backend/contact.php";

type Status = "idle" | "sending" | "success" | "error" | "rateLimited";
type FieldErrors = Partial<Record<string, string>>;

const inputClass =
  "mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm aria-[invalid=true]:border-red-600";

export function ContactSection() {
  const { contact, packages } = hu;
  // The package chosen on /arak arrives in the URL. During the static build there is no URL, so the
  // server snapshot is "" and React fills in the real value after hydration without a mismatch.
  const search = useSyncExternalStore(subscribeToHistory, () => window.location.search, () => "");
  const [override, select] = useState<PackageSelection | null>(null);
  const selection = override ?? parseSelection(search);
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
            onChange={(event) =>
              select({ ...selection, packageId: event.target.value as typeof selection.packageId })
            }
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
          >
            {durations.map((duration) => (
              <option key={duration} value={duration}>
                {duration} {packages.minutes}
              </option>
            ))}
          </select>
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
            {contact.fields.consent}
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
          </p>
        </div>
      </form>
    </section>
  );
}
