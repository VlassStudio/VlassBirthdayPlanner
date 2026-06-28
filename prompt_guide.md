# Prompt Guide: Building "Vlass PartyBox"

This guide contains specific, optimized prompts to use with AI Coding Assistants to continue building or expanding the Vlass PartyBox web app using Next.js, Framer Motion, and Vanilla CSS.

## 1. Core Principles & Stack
- **Framework:** Next.js (App Router).
- **Styling:** Vanilla CSS / Inline Styles. **Do NOT use Tailwind CSS**. Focus on modern aesthetics: Glassmorphism, vibrant gradients, large border-radiuses (e.g., 24px, 32px), and clean typography.
- **Animations:** Use `framer-motion` for all transitions, modals, and interactive hover effects.
- **Icons:** Use `lucide-react`.
- **Language:** The UI should support `next-intl` for localization (EN/ID).

## 2. Expanding the Dashboard

**Prompt for building the To-Do Checklist:**
> "Build a `ChecklistPage` component for the dashboard. It should group tasks by timeframe (e.g., '1 Month Before', '1 Week Before', 'Day Of'). Use inline styles and a Glassmorphism aesthetic. When a checkbox is clicked, strike through the text and play a brief scale animation using `framer-motion`. Ensure the layout matches the existing dashboard structure."

**Prompt for building the Budget Planner (Adult Mode):**
> "Build a `BudgetPlanner` component for the dashboard. It needs a top summary card showing 'Total Budget' vs 'Total Spent'. Below that, create a list of expense categories (Venue, Food & Drinks, Decoration). Use inline styles with subtle shadows. Include an input to add new expenses. If the active party is in 'Adult Mode', add a specific section for 'Bar & Beverage Tracker'."

## 3. Extending the Setup Wizard

**Prompt for adding a new step to the Wizard:**
> "Update the 4-step Setup Wizard in `dashboard/page.tsx` to include a 5th step for 'Add-ons' before the Theme Selection. Use Framer Motion's `AnimatePresence` to slide this new step in gracefully. The step should allow users to add physical printed invitations for an extra fee."

## 4. The Digital Invitation (Public Link)

**Prompt for the RSVP Form Component:**
> "Build an `RSVPForm` component for the public invitation page. Read the party tier from the database. If the party is 'Basic', restrict the guest selection to max 10. The form needs fields for Name, Attendance, Plus-Ones, and a specific textarea for 'Dietary Restrictions & Allergies'. Style the form inputs with large paddings, rounded corners (20px), and a gradient submit button."

## 5. Integrating the Backend (Future)

**Prompt for Database Integration (Supabase):**
> "We are currently using `localStorage` for `vlass_active_party`. Please write a utility file `lib/supabase.ts` to connect to Supabase. Then, refactor the `GuestManagementPage` to fetch guests from a Supabase table called `guests` instead of the local mock state. Include loading states and error handling."
