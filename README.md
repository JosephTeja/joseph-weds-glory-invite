# Wedding invitation

A small static invite with a Vercel serverless RSVP endpoint. Update the event details and gallery photos before sharing the link.

## Personalize

Edit `invite` at the top of `app.js`:

- `couple`: the two names, in display order.
- `events`: use `date` in `YYYY-MM-DD` format, local time in `h:mm AM/PM` format, venue, area, street address, and a venue photo path or URL in `photo`. The countdown interprets the event time as India Standard Time (UTC+05:30). Each venue card embeds a Google Maps preview based on its venue name and address.
- `photos`: replace each image URL and caption with your own photo URLs.

The edited couple photos are in `images/`. The homepage hero and gallery use those local images. Update the `photos` array in `app.js` if you want to rearrange them or add more pictures.

## Save RSVPs with Supabase

1. Create a Supabase project.
2. In its SQL Editor, run `supabase-schema.sql`.
3. Deploy this folder to Vercel.
4. In Vercel Project Settings → Environment Variables, set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` from the Supabase project settings. The secret key is used only by the serverless API; never add it to `app.js` or another public file. Existing deployments can keep using the legacy `SUPABASE_SERVICE_ROLE_KEY` until migrated.
5. Redeploy after setting variables. Submit a test RSVP and check the `rsvps` table in Supabase.

Without those environment variables, the page still loads but the RSVP endpoint explains that the RSVP book is being set up.

## Deploy on Vercel

Import the repository in Vercel, use the project root as the root directory, leave the framework preset as **Other**, and leave the build command empty. Vercel serves `index.html`, `styles.css`, and `app.js`, and deploys `api/rsvp.js` as a function. Add the Supabase environment variables above and deploy. The generated `.vercel.app` URL can then be shared with guests; connect a custom domain if you prefer.

## Use `www.joynin.in/joseph-weds-glory`

Add `www.joynin.in` to this Vercel project's Settings → Domains, then add the exact DNS record Vercel requests to the `www` host in GoDaddy. `vercel.json` rewrites `/joseph-weds-glory` and its asset paths to this invite. The project root (`www.joynin.in/`) also serves the invite for now. DNS does not route URL paths; the Vercel rewrite handles the path.

The wedding date and time are interpreted in India Standard Time for the countdown. Set each event time using the wedding venue's local clock.

See [HOSTING-PLAN.md](HOSTING-PLAN.md) for the hosting setup, RSVP table, and launch steps.
