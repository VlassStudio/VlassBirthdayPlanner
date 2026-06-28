-- ============================================================
-- BirthdayPlanner (PartyBox) — Initial Database Schema
-- Supabase / PostgreSQL
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE event_type AS ENUM ('kids', 'adult');
CREATE TYPE rsvp_status AS ENUM ('pending', 'attending', 'declined');
CREATE TYPE subscription_tier AS ENUM ('free', 'premium');
CREATE TYPE checklist_period AS ENUM ('4_weeks', '2_weeks', '1_week', '3_days', 'day_of');
CREATE TYPE vendor_type AS ENUM ('photographer', 'entertainer', 'caterer', 'florist', 'dj', 'venue', 'other');

-- ============================================================
-- USERS (extended profile — linked to Supabase Auth)
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'id')),
  subscription_tier subscription_tier DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- THEMES
-- ============================================================
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  event_type event_type NOT NULL,
  description TEXT,
  preview_url TEXT,
  animation_config JSONB,        -- Framer Motion config blob
  color_palette JSONB,           -- { primary, secondary, accent, bg }
  is_premium BOOLEAN DEFAULT false,
  price_usd DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type event_type NOT NULL,
  theme_id UUID REFERENCES themes(id),
  
  -- Basic Info
  celebrant_name TEXT NOT NULL,
  celebrant_age INTEGER,            -- null for adult events
  event_title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location_name TEXT,
  location_address TEXT,
  location_maps_url TEXT,
  
  -- Invite settings
  invite_slug TEXT UNIQUE NOT NULL, -- e.g. "tommy-turns-5"
  invite_message TEXT,
  dress_code TEXT,                  -- Adult mode
  
  -- Kids-specific
  max_children INTEGER,
  drop_off_allowed BOOLEAN DEFAULT true,
  
  -- Adult-specific
  is_formal BOOLEAN DEFAULT false,
  
  -- Budget (Adult mode focus)
  budget_total DECIMAL(10,2),
  
  -- Status
  is_published BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CO-PLANNERS (shared event access)
-- ============================================================
CREATE TABLE co_planners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  can_edit BOOLEAN DEFAULT false,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(event_id, user_id)
);

-- ============================================================
-- RSVPS
-- ============================================================
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  
  -- Guest Info
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  status rsvp_status DEFAULT 'pending',
  
  -- Attendance counts
  num_adults INTEGER DEFAULT 1,
  num_children INTEGER DEFAULT 0,
  
  -- Kids-mode specific
  will_drop_off BOOLEAN,           -- true = drop off, false = staying
  child_names TEXT[],              -- names of children attending
  
  -- Dietary / allergy (both modes)
  dietary_restrictions TEXT,       -- free text
  allergies TEXT[],                -- ['peanuts', 'gluten', 'dairy', ...]
  has_allergy_flag BOOLEAN GENERATED ALWAYS AS (
    allergies IS NOT NULL AND array_length(allergies, 1) > 0
  ) STORED,
  
  -- Adult mode
  dietary_preference TEXT,         -- 'vegan','halal','kosher','gluten-free', etc.
  
  -- Message to host
  message TEXT,
  
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CHECKLIST TEMPLATES (default tasks per event type)
-- ============================================================
CREATE TABLE checklist_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type event_type NOT NULL,
  period checklist_period NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

-- ============================================================
-- CHECKLIST ITEMS (per-event user tasks)
-- ============================================================
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  template_id UUID REFERENCES checklist_templates(id),
  period checklist_period NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GIFT REGISTRY
-- ============================================================
CREATE TABLE gift_registry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  image_url TEXT,
  price_approx DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  is_cash_fund BOOLEAN DEFAULT false,
  is_claimed BOOLEAN DEFAULT false,
  claimed_by TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ITINERARY (Day-of run sheet)
-- ============================================================
CREATE TABLE itinerary_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME,
  activity TEXT NOT NULL,
  notes TEXT,
  responsible_person TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VENDORS
-- ============================================================
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  vendor_type vendor_type NOT NULL,
  name TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  website_url TEXT,
  notes TEXT,
  confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BUDGET ITEMS (Adult mode)
-- ============================================================
CREATE TABLE budget_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category TEXT NOT NULL,       -- 'venue', 'catering', 'decoration', 'entertainment', etc.
  description TEXT NOT NULL,
  estimated_amount DECIMAL(10,2),
  actual_amount DECIMAL(10,2),
  is_paid BOOLEAN DEFAULT false,
  vendor_id UUID REFERENCES vendors(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PHOTO WALL (Post-event)
-- ============================================================
CREATE TABLE photo_wall (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  uploader_name TEXT,
  storage_path TEXT NOT NULL,   -- Supabase Storage path
  caption TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- THANK YOU CARDS
-- ============================================================
CREATE TABLE thank_you_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  rsvp_id UUID REFERENCES rsvps(id),
  recipient_name TEXT NOT NULL,
  message TEXT NOT NULL,
  template_style TEXT DEFAULT 'default',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS LOG
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  type TEXT NOT NULL,           -- 'rsvp_new', 'rsvp_update', 'checklist_reminder', etc.
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- THEME PURCHASES (linking users to unlocked themes)
-- ============================================================
CREATE TABLE theme_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme_id UUID NOT NULL REFERENCES themes(id),
  event_id UUID REFERENCES events(id),
  stripe_payment_intent TEXT,
  amount_paid DECIMAL(10,2),
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, theme_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_invite_slug ON events(invite_slug);
CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX idx_rsvps_allergy ON rsvps(event_id) WHERE has_allergy_flag = true;
CREATE INDEX idx_checklist_items_event ON checklist_items(event_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_wall ENABLE ROW LEVEL SECURITY;
ALTER TABLE thank_you_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_planners ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_purchases ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own profile
CREATE POLICY "users_self" ON users FOR ALL USING (auth.uid() = id);

-- Events: owner or co-planner can access
CREATE POLICY "events_owner" ON events FOR ALL USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM co_planners WHERE event_id = events.id AND user_id = auth.uid())
);

-- RSVPs: event owner can read, anyone can insert (public RSVP)
CREATE POLICY "rsvps_public_insert" ON rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "rsvps_owner_read" ON rsvps FOR SELECT USING (
  EXISTS (SELECT 1 FROM events WHERE id = rsvps.event_id AND (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM co_planners WHERE event_id = rsvps.event_id AND user_id = auth.uid())
  ))
);

-- ============================================================
-- SEED: Default checklist templates for KIDS events
-- ============================================================
INSERT INTO checklist_templates (event_type, period, title, description, sort_order) VALUES
('kids', '4_weeks', 'Set the date and venue', 'Confirm the party date, time, and location.', 1),
('kids', '4_weeks', 'Set your budget', 'Decide on a total budget for the party.', 2),
('kids', '4_weeks', 'Choose a theme', 'Pick a fun theme your child loves.', 3),
('kids', '4_weeks', 'Create guest list', 'List all children and their parents to invite.', 4),
('kids', '4_weeks', 'Book entertainer / activities', 'Book magician, bouncy castle, face painter, etc.', 5),
('kids', '2_weeks', 'Send digital invitations', 'Share your PartyBox invite link via WhatsApp.', 6),
('kids', '2_weeks', 'Order the cake', 'Order custom birthday cake from your baker.', 7),
('kids', '2_weeks', 'Plan the menu', 'Decide on food and drinks. Check RSVP allergy list!', 8),
('kids', '2_weeks', 'Buy decorations', 'Order balloons, banners, tableware, and decor.', 9),
('kids', '2_weeks', 'Prepare loot bags', 'Buy items for goody bags for each child.', 10),
('kids', '1_week', 'Confirm final headcount', 'Check RSVPs and confirm numbers with vendors.', 11),
('kids', '1_week', 'Confirm allergen list', 'Review allergy flags in dashboard and notify caterer.', 12),
('kids', '1_week', 'Prepare party games', 'Plan 3-4 age-appropriate games.', 13),
('kids', '3_days', 'Wrap gifts for the birthday child', 'If giving gifts from parents.', 14),
('kids', '3_days', 'Prepare entertainment cue sheet', 'Share day-of itinerary with entertainer.', 15),
('kids', 'day_of', 'Set up venue 2 hours early', 'Arrive early to decorate and set up activity stations.', 16),
('kids', 'day_of', 'Brief helpers on drop-off procedure', 'Remind helpers who is staying vs dropping off.', 17),
('kids', 'day_of', 'Have emergency kit ready', 'Band-aids, wet wipes, extra snacks, allergy meds.', 18);

-- SEED: Default checklist templates for ADULT events
INSERT INTO checklist_templates (event_type, period, title, description, sort_order) VALUES
('adult', '4_weeks', 'Set the date and venue', 'Book the venue and confirm the date.', 1),
('adult', '4_weeks', 'Set your budget', 'Decide on a total budget and allocate by category.', 2),
('adult', '4_weeks', 'Choose a theme & vibe', 'Decide on the party theme, dress code, and ambiance.', 3),
('adult', '4_weeks', 'Create guest list', 'List all guests and collect contact information.', 4),
('adult', '4_weeks', 'Book key vendors', 'Photographer, DJ/band, caterer, bartender.', 5),
('adult', '2_weeks', 'Send digital invitations', 'Share your PartyBox invite link.', 6),
('adult', '2_weeks', 'Plan the menu & bar', 'Use the bar planner to estimate drinks per guest.', 7),
('adult', '2_weeks', 'Arrange decorations', 'Order flowers, centerpieces, lighting.', 8),
('adult', '2_weeks', 'Plan speeches & toasts', 'Coordinate who will speak and in what order.', 9),
('adult', '1_week', 'Confirm final headcount', 'Check RSVPs. Update caterer with final numbers.', 10),
('adult', '1_week', 'Confirm dietary restrictions', 'Review dietary flags in dashboard, notify caterer.', 11),
('adult', '1_week', 'Prepare playlist', 'Finalize Spotify playlist or brief the DJ.', 12),
('adult', '3_days', 'Create social media kit', 'Generate hashtag and shareable stories frame.', 13),
('adult', '3_days', 'Confirm speeches timeline', 'Send itinerary to all speakers.', 14),
('adult', 'day_of', 'Set up venue 3 hours early', 'Arrive early for setup and final decoration.', 15),
('adult', 'day_of', 'Brief helpers on timeline', 'Share day-of itinerary with all vendors.', 16),
('adult', 'day_of', 'Enjoy your party!', 'You''ve planned perfectly. Time to celebrate!', 17);

-- ============================================================
-- SEED: Default Themes
-- ============================================================
INSERT INTO themes (name, slug, event_type, description, is_premium, price_usd, color_palette) VALUES
-- Kids themes (free)
('Classic Balloons', 'classic-balloons', 'kids', 'Colorful balloons for every celebration', false, null, '{"primary":"#FF6B6B","secondary":"#4ECDC4","accent":"#FFE66D","bg":"#FFFBF0"}'),
-- Kids themes (premium)
('Space Explorer', 'space-explorer', 'kids', 'Blast off into a cosmic birthday adventure', true, 19.99, '{"primary":"#0F0C29","secondary":"#302B63","accent":"#00D4FF","bg":"#0A0A1A"}'),
('Unicorn Dreams', 'unicorn-dreams', 'kids', 'Magical unicorn party with rainbow colors', true, 19.99, '{"primary":"#FF6FD8","secondary":"#3813C2","accent":"#FFD700","bg":"#FFF0F9"}'),
('Dinosaur Roar', 'dinosaur-roar', 'kids', 'Wild prehistoric adventure for little explorers', true, 19.99, '{"primary":"#2D6A4F","secondary":"#74C69D","accent":"#FFB703","bg":"#F0FFF4"}'),
('Under The Sea', 'under-the-sea', 'kids', 'Dive into an ocean birthday party', true, 19.99, '{"primary":"#0077B6","secondary":"#00B4D8","accent":"#F7C59F","bg":"#E0F7FA"}'),
('Princess Castle', 'princess-castle', 'kids', 'A royal birthday fit for a princess', true, 19.99, '{"primary":"#C77DFF","secondary":"#E0AAFF","accent":"#FFD700","bg":"#FAF0FF"}'),
-- Adult themes (free)
('Simple Elegant', 'simple-elegant', 'adult', 'Clean and sophisticated minimalist design', false, null, '{"primary":"#1A1A2E","secondary":"#16213E","accent":"#E94560","bg":"#F8F8F8"}'),
-- Adult themes (premium)
('Neon Party', 'neon-party', 'adult', 'Electric neon vibes for an unforgettable night', true, 24.99, '{"primary":"#0D0D0D","secondary":"#1A1A1A","accent":"#39FF14","bg":"#050505"}'),
('Garden Soiree', 'garden-soiree', 'adult', 'Elegant botanical garden party aesthetic', true, 24.99, '{"primary":"#2D6A4F","secondary":"#40916C","accent":"#D4A373","bg":"#FAFFF7"}'),
('Rooftop Glamour', 'rooftop-glamour', 'adult', 'City skyline luxury rooftop celebration', true, 24.99, '{"primary":"#0D1B2A","secondary":"#1B2838","accent":"#C9A84C","bg":"#0A0F1E"}'),
('Retro Disco', 'retro-disco', 'adult', '70s inspired disco fever celebration', true, 24.99, '{"primary":"#6A0572","secondary":"#AB0F7A","accent":"#FFD700","bg":"#1A0020"}'),
('Tropical Paradise', 'tropical-paradise', 'adult', 'Vibrant tropical escape party theme', true, 24.99, '{"primary":"#FF6B35","secondary":"#F7931E","accent":"#00CC88","bg":"#FFFEF0"}');
