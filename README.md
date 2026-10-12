# ADKEA website

Static, responsive marketing site. Deployable files are in `dist/`.

## Preview
Run `python3 -m http.server 4173 --directory dist` in this directory.

## Lead delivery
The enquiry form posts to FormSubmit for `connectadkea@gmail.com`. A user-supplied Gmail screenshot dated 7 October 2026 shows a FormSubmit test-enquiry message arrived in the destination inbox; this confirms delivery for that test. The form keeps FormSubmit's CAPTCHA enabled, includes a honeypot, uses HTML validation, and returns successful submissions to `/thanks.html`.

No SMTP credentials are stored in source. Leads are not saved in a local database. The contact consent and privacy notice disclose processing.

## Hosting
The Sites project identity is in `.openai/hosting.json`. The published Sites URL is separate from `adkea.co`; moving the original domain requires access to its domain/hosting account.

## Content
Service content and contact addresses come from the supplied ADKEA profile and current website. Original AI-generated artwork is used as illustrative creative concepts, not as client case studies. The original logo is preserved. Fonts are hosted locally. All animation can be paused; OS reduced-motion preferences are respected.

## October 2026 redesign
Black-and-white direction with an original interactive Spark character, orange/purple capability cards, expanded navigation, FAQs, and a three-step enquiry form. Native form submission runs after a paper-plane animation; it does not show a delivery success before the provider confirms. Reduced-motion users bypass the animation. The approved footer is retained.

## Services and character update
The Our services mega menu and responsive services.html directory cover all 14 services in the supplied company profile. Service enquiry links carry the selected service into the form. Spark is an articulated SVG character with pointer-following pupils, head movement, body tilt, blinking, touch response and reduced-motion/pause support.

## Visual services catalogue
All 14 services now have original AI-generated editorial imagery, PDF-based deliverables, expanded explanations, intended use cases, and a three-step proposed approach. Four category filters and deep links reveal relevant service details. Image assets are optimized WebP files in dist/assets/services; generation prompts and method are documented in SERVICE-IMAGE-PROMPTS.json. Illustrations do not represent client work.

## Simplified alternating service layout
Services use full-width rows with alternating left/right imagery on desktop and image-first stacks on mobile. Each service shows its description and full included-services list directly. The former filters, expansion controls, repeated promotional labels and long service introduction were removed. Decorative microcopy was also simplified on the homepage and navigation.

## October 7 visual and form update
The user-supplied square PNG logo replaces the old JPG on every page. The asterisk icon was replaced with a five-point star, including the mascot chest. Twelve service images were regenerated as original photographic work scenes; photography and influencer marketing retained their approved images. The homepage creative image was regenerated as a real-life lifestyle scene. Image prompts are recorded in SERVICE-IMAGE-PROMPTS-REAL.json. The user-supplied Gmail screenshot shows a FormSubmit test-enquiry email arrived. Email and phone are both required; the phone must contain 7–15 digits.

## Vercel deployment

Import the GitHub repository into Vercel with the repository root as Root Directory. The tracked `vercel.json` selects the static output and build command; no npm dependencies are required.

The build copies `dist/` into `vercel-dist/` and updates canonical URLs, social metadata, the XML sitemap, robots.txt and form thank-you redirects to the production hostname. The original Sites files remain unchanged. Vercel system environment variables must be enabled. For a custom domain, set `SITE_URL` to its full HTTPS origin before redeploying.

Local validation: `SITE_URL=https://example.com node scripts/build-vercel.mjs`. Generated output and Vercel account-link files are ignored by Git.
