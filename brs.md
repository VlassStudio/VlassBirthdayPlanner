# Business Requirements Specification (BRS)
**Project Name:** Vlass PartyBox (Birthday Planner)
**Version:** 2.0 (Updated)

## 1. Executive Summary
Vlass PartyBox is a premium B2C Web Application acting as a digital concierge for planning birthday parties. It transitions the chaotic process of party planning into a streamlined, visually stunning digital experience. The app uses a "Two Worlds" approach, catering distinctly to Kids' Parties (focusing on fun and safety) and Adult Parties (focusing on elegance and budget). The app utilizes a "Pay-per-Event" model, offering digital themes and advanced planning tools on a per-party basis.

## 2. Target Audience
*   **Primary Audience:** Parents planning kids' birthdays, and Adults planning their own or friends' milestones (e.g., 21st, 30th, 50th).
*   **Pain Points Solved:** 
    *   Keeping track of RSVPs, plus-ones, and food allergies.
    *   Anxiety over forgetting critical planning steps.
    *   Managing party budgets effectively.
    *   Creating stunning invitations without graphic design skills.

## 3. Core Features

### 3.1. Two Distinct Modes (The "Two Worlds")
*   **Kids Mode 🧒**: 
    *   Allergy & dietary restriction tracking.
    *   Drop-off vs. Staying confirmation.
    *   Playful, animated themes (Dinosaurs, Space, Unicorns).
*   **Adult Mode 🥂**: 
    *   Budget & Bar Tracker to manage venue and beverage expenses.
    *   Dress code instructions directly on the invitation.
    *   Elegant, minimalist, and neon themes.

### 3.2. The Dashboard (The Concierge)
*   **Setup Wizard:** A 4-step interactive modal to create a party (Select Mode -> Date/Location -> Choose Package -> Select Theme).
*   **Guest Management:** A data grid to manage guests, RSVPs, plus-ones, and special notes. Exportable to PDF/Excel (PRO feature).
*   **Countdown & Summary:** Real-time countdown to the event and RSVP completion bars.
*   **To-Do Checklist (Planned):** A timeline-based checklist.
*   **Budget Planner (Planned):** An expense calculator.

### 3.3. Digital Invitation & RSVP System (Public Facing)
*   **Dynamic Links:** The app generates a unique URL for the event (e.g., `vlass.party/adult/my-awesome-party`).
*   **Animated UI:** Beautiful themes built with Framer Motion.
*   **Smart RSVP Form:** Real-time form for guests to confirm attendance, which updates the Parent Dashboard instantly.

## 4. Monetization Strategy
*   **Account:** Free forever. No monthly/yearly subscriptions.
*   **Pay-per-Event Model:** Users pay per party they create.
    *   **Basic Plan (Free):** Maximum 10 guests, standard RSVP features, limited themes, includes Vlass watermark.
    *   **VIP/PRO Plan (Rp 99.000 / event):** Unlimited guests, unlocks 50+ premium VIP themes, WhatsApp notifications, no watermark, and enables export reports.

## 5. Technical Architecture
To achieve the premium, highly animated aesthetic required for this product:
*   **Frontend Framework:** Next.js (App Router) for excellent SEO and fast rendering.
*   **Internationalization:** `next-intl` (English & Indonesian).
*   **Styling:** Vanilla CSS and Inline Styles (No Tailwind) to enforce a strict, highly customized Glassmorphism aesthetic.
*   **Animations:** Framer Motion (for micro-interactions, page transitions, and modal wizard).
*   **State Management:** `localStorage` for the prototype phase, transitioning to a real backend later.
*   **Backend / Database (Future):** Supabase or Firebase.
