-- ── Portfolio table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name   TEXT        NOT NULL,
  event_type    TEXT        NOT NULL,
  event_label   TEXT        NOT NULL,
  year          TEXT,
  description   TEXT,
  venue         TEXT,
  pax           TEXT,
  image_url     TEXT,
  display_order INTEGER     DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portfolio_updated_at
  BEFORE UPDATE ON portfolio
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ─────────────────────────────────────────
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Anyone can read (public portfolio page)
CREATE POLICY "Public read" ON portfolio
  FOR SELECT USING (true);

-- Only authenticated users can write
CREATE POLICY "Auth insert" ON portfolio
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update" ON portfolio
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete" ON portfolio
  FOR DELETE USING (auth.role() = 'authenticated');

-- ── Storage bucket for portfolio images ────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT DO NOTHING;

-- Public can read images
CREATE POLICY "Public image read" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-images');

-- Authenticated users can upload/delete images
CREATE POLICY "Auth image upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth image delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth image update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

-- ── Seed: existing 33 portfolio entries ───────────────────────
INSERT INTO portfolio (client_name, event_type, event_label, year, description, venue, pax, display_order) VALUES
('DSTA Annual D&D',             'dd',         'Dinner & Dance',         '2024', 'Ministry of Defence agency annual gala',              'Marina Bay Sands',    '1,400 pax', 1),
('Chip Eng Seng CNY Dinner',    'dd',         'CNY Dinner',             '2025', 'Construction & property group CNY celebration',       'Suntec City',         '1,500 pax', 2),
('SIT Annual Staff Night',      'dd',         'Annual Staff Night',     '2023–2024', 'Singapore Institute of Technology staff night',  'Ritz Carlton',        '1,100 pax', 3),
('Allied World Awards Night',   'awards',     'Awards Night',           '2025', 'Insurance sector recognition ceremony',               'Singapore',           '',          4),
('Mandai Wildlife Group D&D',   'dd',         'Dinner & Dance',         '2025', 'Wildlife conservation sector annual dinner',          'Singapore',           '',          5),
('BytePlus Sales Kick-Off',     'conference', 'Sales Kick-Off',         '2024', 'ByteDance tech division annual sales event',          'Singapore',           '',          6),
('L''Oréal Singapore Activation','activation','Brand Activation',       '2024', 'Beauty & retail experiential campaign',               'Singapore',           '',          7),
('NTU-NIE Caring Teacher Awards','awards',    'Awards Ceremony',        '2024', 'Education sector annual recognition',                 'Singapore',           '',          8),
('Hermes D&D',                  'dd',         'Dinner & Dance',         '2025', 'Luxury brand annual staff celebration',               'Singapore',           '',          9),
('Morrison Express Family Day', 'familyday',  'Family Day',             '2025', 'Logistics sector family engagement event',            'Singapore',           '',          10),
('MWR E&I Hero Awards',         'awards',     'Awards Ceremony',        '2024–2025', 'Engineering sector biennial hero recognition',   'Singapore',           '',          11),
('MOE Dinner & Dance',          'dd',         'Dinner & Dance',         '2024', 'Ministry of Education annual gala',                   'Singapore',           '',          12),
('DBS Paylah! Roadshow',        'activation', 'Brand Activation',       '2023', 'Financial services consumer roadshow',                'Singapore',           '',          13),
('SAESL Groundbreaking Ceremony','awards',    'Groundbreaking Ceremony','2025', 'Singapore Aero Engine Services aerospace milestone',   'Singapore',           '',          14),
('Hong Leong Club Family Day',  'familyday',  'Family Day',             '2024', 'Finance sector family engagement event',              'Singapore',           '',          15),
('Toyota Motor Asia D&D',       'dd',         'Dinner & Dance',         '2025', 'Automotive regional HQ annual dinner',                'Singapore',           '',          16),
('Aibel Townhall',              'conference', 'Company Townhall',       '2024', 'Oil & gas sector full-company townhall',              'Singapore',           '',          17),
('KKH Dinner & Dance',          'dd',         'Dinner & Dance',         '2025', 'KK Women''s and Children''s Hospital annual gala',    'Singapore',           '',          18),
('NUH DDI Teambuilding',        'familyday',  'Teambuilding',           '2024–2025','National University Hospital team engagement',     'Singapore',           '',          19),
('M1 Carnival',                 'activation', 'Brand Activation',       '2024', 'Telco consumer engagement carnival',                  'Singapore',           '',          20),
('GrabGifts Certified Partners Summit','conference','Partners Summit',  '2023', 'Tech platform annual partner recognition',            'Singapore',           '',          21),
('KTPH & YCH D&D',              'dd',         'Dinner & Dance',         '2025', 'Khoo Teck Puat & Yishun Community Hospital gala',     'Singapore',           '',          22),
('Alexandra Hospital Townhall', 'awards',     'Anniversary Townhall',   '2025', 'Healthcare institution 7th anniversary event',        'Singapore',           '',          23),
('EBARA 40th Anniversary',      'dd',         'Anniversary Celebration','2023', 'Industrial pump manufacturer milestone celebration',   'Singapore',           '',          24),
('Capitol Kempinski D&D',       'dd',         'Dinner & Dance',         '2022–2024','Luxury hotel annual client appreciation dinner',   'Singapore',           '',          25),
('Entegris D&D',                'dd',         'Dinner & Dance',         '2023–2024','Semiconductor materials annual staff dinner',       'Singapore',           '',          26),
('SingHealth Allied Health Day','awards',     'Awards & Recognition',   '2024–2025','Healthcare group allied health recognition',       'Singapore',           '',          27),
('Wood Group Family Day',       'familyday',  'Family Day',             '2024', 'Energy sector family engagement event',               'Singapore',           '',          28),
('ACUVUE × Rallies 1.0',        'rallies',    'Rallies™ Activation',    '2024', 'Singapore''s first in-mall pickleball competition. 5.2M+ reach, 278 players, NPS +26', 'Plaza Singapura', '350+ spectators', 29),
('SNEC 35th Annual D&D',        'dd',         'Dinner & Dance',         '2025', 'Singapore National Eye Centre milestone gala',        'Singapore',           '',          30),
('Shopee KOL Event',            'activation', 'KOL Event',              '2025', 'E-commerce platform influencer engagement',           'Singapore',           '',          31),
('Elitez × e2i Networking',     'conference', 'Networking Event',       '2025–2026','Workforce development networking series',          'Singapore',           '',          32),
('HMM Anniversary Celebration', 'dd',         'Anniversary Celebration','2024–2025','Shipping & logistics milestone celebration',        'Singapore',           '',          33);
