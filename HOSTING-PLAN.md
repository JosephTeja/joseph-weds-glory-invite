# Joseph & Glory wedding invite: hosting plan

## Recommended setup

- **Website and RSVP API:** Vercel. The site is static HTML/CSS/JavaScript with one serverless RSVP endpoint and no build step.
- **RSVP database:** Supabase Postgres. The endpoint writes to `public.rsvps`; guests cannot read the table from the website.
- **Address:** Start with Vercel's generated `*.vercel.app` URL. Add a custom domain later if you want a shorter share link.

## RSVP data

Each reply stores the guest's name, whether they will attend the marriage, whether they will attend the reception, their optional note, and the submission timestamp. No email, dietary information, or song request is collected.

To review replies, sign in to the Supabase Dashboard and open **Table Editor → rsvps**. Export the table as CSV when you want a guest list. The SQL schema enables row-level security and defines no public read policy. Vercel's server function uses the server-only `SUPABASE_SERVICE_ROLE_KEY` to insert responses. Keep that value in Vercel Environment Variables; never put it in browser JavaScript or Git.

## Go-live sequence

1. Create a Supabase project in your own account, then run `supabase-schema.sql` in its SQL Editor.
2. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as **Production** Environment Variables in Vercel. Use the project's URL and its service-role/secret key. Do not send the key in chat or save it in this repository.
3. Connect this project to a private Git repository and import that repository in Vercel. Choose **Other** as the framework preset, use the repository root, and leave the build command empty.
4. Deploy, open the Vercel URL, submit one RSVP, then confirm it appears in Supabase's `rsvps` table. Remove the test row before sharing the invite.
5. Share the Vercel URL with guests. After the wedding, export the RSVP list and decide when to remove the guest responses and Supabase project.

## Current deployment readiness

- The Vercel account is signed in, but its Projects page shows no projects yet. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` exist as shared team variables; their values have not been verified against the Supabase project.
- The Supabase project **Joseph & Glory Wedding** exists and is healthy. It currently shows no migrations; the `rsvps` table has not been confirmed. Navigating to the SQL Editor produced a warning about unsaved changes, so that navigation was canceled to preserve the open Supabase state.
- This local Git repository has no remote. A private GitHub repository must be created and connected before Vercel can import it.
- The Vercel CLI path is also unavailable at the moment: `npm exec` fails because the Node installation references a missing `npm-cli.js`. The GitHub import flow avoids needing the CLI.

## Plan and availability notes

Vercel Hobby is free for personal, non-commercial use; this wedding invite fits that use. Supabase Free is suitable for an initial RSVP list, but low-activity free projects can be paused after a week. Check the project before sending the invite and during the RSVP period, and restore it from the Supabase Dashboard if it pauses. If uninterrupted database availability matters, review Supabase's current paid plan before launch.

Official references: [Vercel Git deployments](https://vercel.com/docs/git), [Vercel Hobby plan](https://vercel.com/docs/plans/hobby), [Supabase project pausing](https://supabase.com/docs/guides/platform/free-project-pausing), [Supabase key security](https://supabase.com/docs/guides/database/secure-data).
