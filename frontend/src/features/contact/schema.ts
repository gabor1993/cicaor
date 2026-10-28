import { z } from "zod";
import { hu } from "@/content/hu";

const { validation } = hu.contact;

// Keep these rules in sync with backend/src/validation in the PHP endpoint.
export const contactSchema = z.object({
  name: z.string().trim().min(1, validation.nameRequired).max(100),
  email: z.email(validation.emailInvalid).max(254),
  phone: z.string().trim().max(30),
  packageId: z.enum(["", "komfort", "moka", "lux"]),
  duration: z.enum(["30", "60", "90"]),
  message: z.string().trim().min(1, validation.messageRequired).max(2000, validation.messageTooLong),
  consent: z.literal(true, validation.consentRequired),
  // Honeypot: real visitors never see or fill this field, bots usually do.
  website: z.string().max(0),
});

export type ContactInput = z.infer<typeof contactSchema>;
