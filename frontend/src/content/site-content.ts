import raw from "./site-content.json";
import { siteContentSchema } from "./site-content-schema";

// The editable content: the last snapshot pulled from WordPress (`npm run cms:pull`, and on every Netlify build).
export const siteContent = siteContentSchema.parse(raw);
