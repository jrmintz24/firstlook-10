# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/df1616ad-5732-43de-9096-ccd1ee3b6fa0

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/df1616ad-5732-43de-9096-ccd1ee3b6fa0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Environment variables

Create a `.env` file at the project root by copying `.env.example`:

```sh
cp .env.example .env
```

Then fill in the following values:

- `VITE_GOOGLE_PLACES_API_KEY` – API key from Google Cloud Console for the Places API.
- `RENTCAST_API_KEY` – your API key from RentCast.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` – found in your Supabase project settings.

These keys are required for the app to run locally with `npm run dev`.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/df1616ad-5732-43de-9096-ccd1ee3b6fa0) and click on Share -> Publish.

## Running tests

Install dependencies if you haven't already:

```sh
npm ci
```

If you encounter errors running `npm run lint` or `npm test`, double-check that
all dependencies are installed.

Then run the unit tests with:

```sh
npm test
```

Vitest will execute the test suite defined under `src/` using the locally installed binary. If you see an error like `sh: vitest: not found`, make sure you've installed dependencies.

## Database migrations

SQL files used to keep the Supabase schema in sync live under `supabase/sql`.
To apply the latest changes for the admin workflow run:

```sh
supabase db execute < supabase/sql/20250605_admin_workflow.sql
```

This adds columns for agent assignment and status tracking on the
`showing_requests` table and installs a trigger to update
`status_updated_at` whenever the status changes.

To enable messaging and buyer agreement tracking run the next migration:
```sh
supabase db execute < supabase/sql/20250610_messages_and_agreements.sql
```

If agent assignment fails with a `showing_requests_status_check` error, apply the
status migration:
```sh
supabase db execute < supabase/sql/20250615_update_status_check.sql
```

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
