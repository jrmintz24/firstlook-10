# Open House Code Assessment

This repository includes references to "open houses" functionality that is currently unused in the application. This document summarizes the locations of this code and considerations for safely removing it.

## Open house references found

- **supabase/functions/sync-open-houses** – Deno function that fetches properties from the RentCast API and populates an `open_houses` table. It is not called anywhere in the frontend code.
- **src/integrations/supabase/types.ts** – Contains the TypeScript definitions for the `open_houses` table as part of the Supabase schema types. No other files import or query this table.
- **Textual references** – Pages such as `FAQ.tsx` and components like `FAQSection.tsx` include phrases mentioning "open houses" but these are purely user-facing text and not related to the unused functionality.

## Unused code

- The `sync-open-houses` function appears to be unused: no frontend component or backend code triggers it.
- The `open_houses` table types are generated but unused in the application code.

## Safe deletions

Based on the search results, removing the following should not impact other functionality:

1. `supabase/functions/sync-open-houses/` – Entire folder containing the RentCast sync logic.
2. The `open_houses` table definitions in `src/integrations/supabase/types.ts`. These lines define the table under `Database['public']['Tables']` but nothing in the application imports or queries `open_houses`.

Before deleting the table from the database itself, confirm no external services or integrations rely on it.

## Files/commands reviewed

- Searched the entire repository with `grep -R "open_houses"` and `grep -R "open house"` to locate references.
- Manually inspected `src/pages`, `src/components`, and `supabase/functions` directories.


## Cleanup performed

The `sync-open-houses` function and the open houses table types were removed in commit 6bc90c1.

