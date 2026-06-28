// ============================================================
// PARTYBOX — COMPLETE MOCK DATA
// Used for all frontend pages (no backend needed)
// ============================================================

export type EventMode = 'kids' | 'adult'
export type RsvpStatus = 'attending' | 'declined' | 'pending'

// ── CONSTANTS ───────────────────────────────────────────────
export const ALLERGY_OPTIONS = [
  'Peanuts / Kacang', 'Tree Nuts', 'Milk / Dairy', 'Eggs / Telur',
  'Wheat / Gluten', 'Shellfish / Seafood', 'Fish / Ikan', 'Soy / Kedelai',
]

export const DIETARY_OPTIONS = [
  'Halal', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free',
  'Kosher', 'Alcohol-Free', 'No Restrictions',
]


// ── USERS ──────────────────────────────────────────────────
export const MOCK_USER = {
  id: 'u-001',
  full_name: 'Rizky Irawan',
  email: 'rizky@email.com',
  avatar: '👨‍💻',
  subscription: 'free' as 'free' | 'premium',
  preferred_language: 'id',
  phone: '+62 812-3456-7890',
}

// ── KIDS EVENT ──────────────────────────────────────────────
export const MOCK_KIDS_EVENT = {
  id: 'evt-kids-001',
  mode: 'kids' as EventMode,
  celebrant_name: 'Alisha Putri',
  celebrant_age: 6,
  event_title: 'Alisha Turns 6! 🦄',
  event_date: '2026-07-20',
  event_time: '10:00',
  location_name: 'Rumah Keluarga Irawan',
  location_address: 'Jl. Mawar No. 12, Kebayoran Baru, Jakarta Selatan',
  location_maps_url: 'https://maps.google.com',
  invite_slug: 'alisha-turns-6-x7k2',
  invite_message: 'Ayo rayakan ultah Alisha yang ke-6! Ada banyak games seru, kue lezat, dan kejutan spesial menanti kalian! 🎉',
  theme: {
    name: 'Unicorn Dreams',
    slug: 'unicorn-dreams',
    color_palette: { primary: '#FF6FD8', secondary: '#3813C2', accent: '#FFD700', bg: '#FFF0F9' },
  },
  drop_off_allowed: true,
  max_children: 30,
  is_published: true,
  dress_code: null,
  budget_total: null,
  created_at: '2026-06-01',
}

// ── ADULT EVENT ─────────────────────────────────────────────
export const MOCK_ADULT_EVENT = {
  id: 'evt-adult-001',
  mode: 'adult' as EventMode,
  celebrant_name: 'Budi Santoso',
  celebrant_age: 30,
  event_title: 'Budi\'s 30th — The Big Three-Oh 🥂',
  event_date: '2026-08-15',
  event_time: '19:00',
  location_name: 'Rooftop SKYE Bar & Restaurant',
  location_address: 'BCA Tower Lt. 56, Jl. MH. Thamrin, Jakarta Pusat',
  location_maps_url: 'https://maps.google.com',
  invite_slug: 'budi-turns-30-a9f4',
  invite_message: 'Join us for an elegant evening celebrating Budi\'s 30th birthday. Dress to impress — it\'s going to be a night to remember.',
  theme: {
    name: 'Rooftop Glamour',
    slug: 'rooftop-glamour',
    color_palette: { primary: '#0D1B2A', secondary: '#1B2838', accent: '#C9A84C', bg: '#0A0F1E' },
  },
  drop_off_allowed: false,
  max_children: null,
  is_published: true,
  dress_code: 'Smart Casual / Cocktail Attire',
  budget_total: 25000000,
  created_at: '2026-06-10',
}

// ── KIDS RSVPs ──────────────────────────────────────────────
export const MOCK_KIDS_RSVPS = [
  { id: 'r-k01', guest_name: 'Ibu Sari (Mama Caca)', status: 'attending' as RsvpStatus, num_adults: 1, num_children: 1, child_names: ['Caca'], allergies: ['Peanuts', 'Tree Nuts'], will_drop_off: false, dietary_restrictions: 'Caca alergi kacang', message: 'Selamat ulang tahun Alisha! Caca sudah tidak sabar! 🎉', submitted_at: '2026-06-15 09:30' },
  { id: 'r-k02', guest_name: 'Pak Deni (Papa Rafi)', status: 'attending' as RsvpStatus, num_adults: 0, num_children: 1, child_names: ['Rafi'], allergies: [], will_drop_off: true, dietary_restrictions: '', message: 'Rafi mau datang tapi saya ada meeting, boleh diantar ya?', submitted_at: '2026-06-15 10:15' },
  { id: 'r-k03', guest_name: 'Ibu Dian (Mama Bella & Bimo)', status: 'attending' as RsvpStatus, num_adults: 1, num_children: 2, child_names: ['Bella', 'Bimo'], allergies: ['Milk / Dairy'], will_drop_off: false, dietary_restrictions: 'Bimo tidak bisa makan produk susu', message: 'Bella dan Bimo sudah excited banget!', submitted_at: '2026-06-16 14:00' },
  { id: 'r-k04', guest_name: 'Tante Rina', status: 'attending' as RsvpStatus, num_adults: 1, num_children: 1, child_names: ['Zara'], allergies: [], will_drop_off: false, dietary_restrictions: '', message: 'Sudah siapkan kado spesial! 🎁', submitted_at: '2026-06-16 16:22' },
  { id: 'r-k05', guest_name: 'Ibu Maya (Mama Kiki)', status: 'attending' as RsvpStatus, num_adults: 1, num_children: 1, child_names: ['Kiki'], allergies: ['Wheat / Gluten'], will_drop_off: false, dietary_restrictions: 'Kiki celiac disease — tidak bisa gluten sama sekali', message: 'Tolong pastikan ada makanan bebas gluten ya 🙏', submitted_at: '2026-06-17 08:45' },
  { id: 'r-k06', guest_name: 'Om Tono', status: 'attending' as RsvpStatus, num_adults: 2, num_children: 1, child_names: ['Adit'], allergies: [], will_drop_off: false, dietary_restrictions: '', message: 'Datang bersama istri ya 😊', submitted_at: '2026-06-17 20:00' },
  { id: 'r-k07', guest_name: 'Ibu Nona (Mama Putri)', status: 'declined' as RsvpStatus, num_adults: 1, num_children: 1, child_names: ['Putri'], allergies: [], will_drop_off: false, dietary_restrictions: '', message: 'Maaf tidak bisa hadir, ada acara keluarga 😢', submitted_at: '2026-06-17 11:30' },
  { id: 'r-k08', guest_name: 'Ibu Wati', status: 'pending' as RsvpStatus, num_adults: 1, num_children: 1, child_names: ['Dito'], allergies: [], will_drop_off: false, dietary_restrictions: '', message: '', submitted_at: '2026-06-18 07:20' },
  { id: 'r-k09', guest_name: 'Pak Hendra (Papa Lala)', status: 'pending' as RsvpStatus, num_adults: 1, num_children: 1, child_names: ['Lala'], allergies: [], will_drop_off: false, dietary_restrictions: '', message: '', submitted_at: '2026-06-18 09:00' },
  { id: 'r-k10', guest_name: 'Nenek Yanti', status: 'attending' as RsvpStatus, num_adults: 1, num_children: 0, child_names: [], allergies: [], will_drop_off: false, dietary_restrictions: 'Diabetes — tolong sediakan pilihan rendah gula', message: 'Nenek mau gendong Alisha seharian! 👵❤️', submitted_at: '2026-06-18 15:00' },
]

// ── ADULT RSVPs ─────────────────────────────────────────────
export const MOCK_ADULT_RSVPS = [
  { id: 'r-a01', guest_name: 'Andi Wijaya', status: 'attending' as RsvpStatus, num_adults: 2, num_children: 0, allergies: [], dietary_preference: 'Halal', dietary_restrictions: '', message: 'Congrats buddy! See you at the top floor! 🥂', submitted_at: '2026-06-20 10:00' },
  { id: 'r-a02', guest_name: 'Kevin & Sarah Mahendra', status: 'attending' as RsvpStatus, num_adults: 2, num_children: 0, allergies: [], dietary_preference: 'Vegan', dietary_restrictions: 'Both vegan — no meat, no dairy', message: 'Wouldn\'t miss it for the world!', submitted_at: '2026-06-20 11:30' },
  { id: 'r-a03', guest_name: 'Mbak Devi Rahayu', status: 'attending' as RsvpStatus, num_adults: 1, num_children: 0, allergies: ['Shellfish'], dietary_preference: 'Halal', dietary_restrictions: 'Alergi seafood', message: 'Siap tampil with my best outfit! 👗✨', submitted_at: '2026-06-20 14:00' },
  { id: 'r-a04', guest_name: 'Rizal Hakim', status: 'attending' as RsvpStatus, num_adults: 1, num_children: 0, allergies: [], dietary_preference: 'Halal', dietary_restrictions: '', message: 'Sudah book ojek dari jauh hari! Haha 🛵', submitted_at: '2026-06-21 09:15' },
  { id: 'r-a05', guest_name: 'Cindy & Reza Pratama', status: 'attending' as RsvpStatus, num_adults: 2, num_children: 0, allergies: [], dietary_preference: 'Gluten-Free', dietary_restrictions: 'Cindy celiac — strictly gluten free', message: 'Can\'t wait! The venue looks amazing 😍', submitted_at: '2026-06-21 15:30' },
  { id: 'r-a06', guest_name: 'Pak Tono Susanto', status: 'attending' as RsvpStatus, num_adults: 1, num_children: 0, allergies: [], dietary_preference: 'Halal', dietary_restrictions: '', message: 'Happy 30th, kiddo!', submitted_at: '2026-06-21 20:00' },
  { id: 'r-a07', guest_name: 'Fika Ayu', status: 'declined' as RsvpStatus, num_adults: 1, num_children: 0, allergies: [], dietary_preference: '', dietary_restrictions: '', message: 'So sorry, I\'ll be in Bali. Will celebrate separately! 💐', submitted_at: '2026-06-22 08:00' },
  { id: 'r-a08', guest_name: 'Genta Kusuma', status: 'pending' as RsvpStatus, num_adults: 1, num_children: 0, allergies: [], dietary_preference: '', dietary_restrictions: '', message: '', submitted_at: '2026-06-22 10:00' },
  { id: 'r-a09', guest_name: 'Nadia & Michael Tanaka', status: 'attending' as RsvpStatus, num_adults: 2, num_children: 0, allergies: [], dietary_preference: 'Alcohol-Free', dietary_restrictions: 'No alcohol for both', message: 'Flying from Singapore! See you there 🙌', submitted_at: '2026-06-22 13:45' },
  { id: 'r-a10', guest_name: 'Hana Pertiwi', status: 'pending' as RsvpStatus, num_adults: 1, num_children: 0, allergies: [], dietary_preference: '', dietary_restrictions: '', message: '', submitted_at: '2026-06-23 09:00' },
  { id: 'r-a11', guest_name: 'Aryo Wibowo', status: 'attending' as RsvpStatus, num_adults: 1, num_children: 0, allergies: [], dietary_preference: 'Halal', dietary_restrictions: '', message: 'Let\'s get this party started! 🎉', submitted_at: '2026-06-23 11:00' },
  { id: 'r-a12', guest_name: 'Lina Setianingsih', status: 'attending' as RsvpStatus, num_adults: 1, num_children: 0, allergies: ['Peanuts'], dietary_preference: 'Halal', dietary_restrictions: 'Alergi kacang tanah', message: 'Happy birthday kakak! 🎂', submitted_at: '2026-06-23 16:00' },
]

// ── KIDS CHECKLIST ──────────────────────────────────────────
export const MOCK_KIDS_CHECKLIST = [
  { id: 'ck-k01', period: '4_weeks', title: 'Tentukan tanggal dan tempat', is_completed: true, completed_at: '2026-06-02' },
  { id: 'ck-k02', period: '4_weeks', title: 'Tetapkan budget pesta', is_completed: true, completed_at: '2026-06-02' },
  { id: 'ck-k03', period: '4_weeks', title: 'Pilih tema pesta', is_completed: true, completed_at: '2026-06-03' },
  { id: 'ck-k04', period: '4_weeks', title: 'Buat daftar tamu anak-anak', is_completed: true, completed_at: '2026-06-05' },
  { id: 'ck-k05', period: '4_weeks', title: 'Booking entertainer / aktivitas', is_completed: true, completed_at: '2026-06-08' },
  { id: 'ck-k06', period: '2_weeks', title: 'Kirim undangan digital via WhatsApp', is_completed: true, completed_at: '2026-06-15' },
  { id: 'ck-k07', period: '2_weeks', title: 'Pesan kue ulang tahun custom', is_completed: true, completed_at: '2026-06-15' },
  { id: 'ck-k08', period: '2_weeks', title: 'Rencanakan menu — cek daftar alergi!', is_completed: false, completed_at: null },
  { id: 'ck-k09', period: '2_weeks', title: 'Beli dekorasi (balon, banner, taplak)', is_completed: false, completed_at: null },
  { id: 'ck-k10', period: '2_weeks', title: 'Siapkan loot bag / goodie bag', is_completed: false, completed_at: null },
  { id: 'ck-k11', period: '1_week', title: 'Konfirmasi jumlah tamu final', is_completed: false, completed_at: null },
  { id: 'ck-k12', period: '1_week', title: 'Cek ulang daftar alergi tamu', is_completed: false, completed_at: null },
  { id: 'ck-k13', period: '1_week', title: 'Siapkan permainan & aktivitas anak', is_completed: false, completed_at: null },
  { id: 'ck-k14', period: '3_days', title: 'Bungkus hadiah untuk Alisha', is_completed: false, completed_at: null },
  { id: 'ck-k15', period: '3_days', title: 'Kirim itinerary ke entertainer', is_completed: false, completed_at: null },
  { id: 'ck-k16', period: '3_days', title: 'Siapkan kit darurat (plester, tisu basah)', is_completed: false, completed_at: null },
  { id: 'ck-k17', period: 'day_of', title: 'Datang 2 jam lebih awal untuk dekorasi', is_completed: false, completed_at: null },
  { id: 'ck-k18', period: 'day_of', title: 'Briefing helper soal prosedur drop-off', is_completed: false, completed_at: null },
]

// ── ADULT CHECKLIST ─────────────────────────────────────────
export const MOCK_ADULT_CHECKLIST = [
  { id: 'ck-a01', period: '4_weeks', title: 'Booking venue rooftop', is_completed: true, completed_at: '2026-06-11' },
  { id: 'ck-a02', period: '4_weeks', title: 'Tetapkan budget total', is_completed: true, completed_at: '2026-06-11' },
  { id: 'ck-a03', period: '4_weeks', title: 'Pilih tema & dress code', is_completed: true, completed_at: '2026-06-12' },
  { id: 'ck-a04', period: '4_weeks', title: 'Buat daftar tamu', is_completed: true, completed_at: '2026-06-12' },
  { id: 'ck-a05', period: '4_weeks', title: 'Booking fotografer & DJ', is_completed: true, completed_at: '2026-06-13' },
  { id: 'ck-a06', period: '2_weeks', title: 'Kirim undangan digital', is_completed: true, completed_at: '2026-06-20' },
  { id: 'ck-a07', period: '2_weeks', title: 'Rencanakan menu & bar', is_completed: false, completed_at: null },
  { id: 'ck-a08', period: '2_weeks', title: 'Pesan bunga & dekorasi meja', is_completed: false, completed_at: null },
  { id: 'ck-a09', period: '2_weeks', title: 'Koordinasi speeches & toast', is_completed: false, completed_at: null },
  { id: 'ck-a10', period: '1_week', title: 'Konfirmasi headcount final ke katering', is_completed: false, completed_at: null },
  { id: 'ck-a11', period: '1_week', title: 'Cek preferensi dietary tamu', is_completed: false, completed_at: null },
  { id: 'ck-a12', period: '1_week', title: 'Finalisasi playlist Spotify / brief DJ', is_completed: false, completed_at: null },
  { id: 'ck-a13', period: '3_days', title: 'Buat social media kit & hashtag', is_completed: false, completed_at: null },
  { id: 'ck-a14', period: '3_days', title: 'Kirim itinerary ke semua speaker', is_completed: false, completed_at: null },
  { id: 'ck-a15', period: '3_days', title: 'Konfirmasi logistik transport tamu VIP', is_completed: false, completed_at: null },
  { id: 'ck-a16', period: 'day_of', title: 'Setup venue 3 jam lebih awal', is_completed: false, completed_at: null },
  { id: 'ck-a17', period: 'day_of', title: 'Briefing semua vendor dengan itinerary', is_completed: false, completed_at: null },
]

// ── KIDS ITINERARY ──────────────────────────────────────────
export const MOCK_KIDS_ITINERARY = [
  { id: 'it-k01', start_time: '09:00', end_time: '10:00', activity: 'Setup & Dekorasi', notes: 'Tim dekorasi datang pukul 09.00. Pasang banner, balon, & meja hadiah.', responsible_person: 'Rizky + Tim Dekor' },
  { id: 'it-k02', start_time: '10:00', end_time: '10:30', activity: '🎈 Tamu Mulai Berdatangan', notes: 'Sambut tamu di pintu masuk. Helper siap di area drop-off.', responsible_person: 'Helper: Bunda Sari' },
  { id: 'it-k03', start_time: '10:30', end_time: '11:15', activity: '🎮 Free Play & Aktivitas', notes: 'Anak-anak bebas bermain di area yang telah disiapkan. Jaga keamanan.', responsible_person: 'Pengawas: Om Budi' },
  { id: 'it-k04', start_time: '11:15', end_time: '12:00', activity: '🎪 Pertunjukan Sulap', notes: 'Pesulap: Kak Doni (+62 812-xxx). Siapkan area kursi melingkar.', responsible_person: 'MC: Kak Rina' },
  { id: 'it-k05', start_time: '12:00', end_time: '12:30', activity: '🎂 Upacara Tiup Lilin & Potong Kue', notes: 'Nyanyikan Selamat Ulang Tahun. Foto bersama sebelum potong kue.', responsible_person: 'Fotografer: Mas Yoga' },
  { id: 'it-k06', start_time: '12:30', end_time: '13:30', activity: '🍽️ Makan Siang', notes: 'Cek ulang meja alergi! Meja khusus bebas kacang & bebas gluten sudah disiapkan.', responsible_person: 'Katering: Bu Dewi' },
  { id: 'it-k07', start_time: '13:30', end_time: '14:15', activity: '🎨 Face Painting & Craft', notes: 'Face painter: Kak Mia. Craft: mewarnai topeng unicorn.', responsible_person: 'Kak Mia' },
  { id: 'it-k08', start_time: '14:15', end_time: '14:45', activity: '🎁 Buka Hadiah', notes: 'Alisha membuka hadiah satu per satu. Catat nama pemberi untuk ucapan terima kasih.', responsible_person: 'Asisten: Tante Lia' },
  { id: 'it-k09', start_time: '14:45', end_time: '15:00', activity: '👋 Pamitan & Bagi Goodie Bag', notes: 'Bagikan loot bag di pintu keluar. Foto group terakhir.', responsible_person: 'Semua helper' },
]

// ── ADULT ITINERARY ─────────────────────────────────────────
export const MOCK_ADULT_ITINERARY = [
  { id: 'it-a01', start_time: '16:00', end_time: '19:00', activity: 'Venue Setup & Sound Check', notes: 'DJ & audio setup. Florist arrange centerpieces. Photo booth setup.', responsible_person: 'Event Coordinator: Mbak Tika' },
  { id: 'it-a02', start_time: '19:00', end_time: '19:30', activity: '🥂 Guest Arrival & Welcome Drinks', notes: 'Serve welcome cocktails & mocktails at the entrance. Background jazz music.', responsible_person: 'Bartender: Mas Reno' },
  { id: 'it-a03', start_time: '19:30', end_time: '19:45', activity: '📸 Group Photo Session', notes: 'Professional photo before dinner. All guests gather at rooftop edge for city view shot.', responsible_person: 'Fotografer: Studio XYZ' },
  { id: 'it-a04', start_time: '19:45', end_time: '20:30', activity: '🍽️ Dinner is Served', notes: 'Buffet-style dinner. Check dietary labels — vegan, gluten-free, halal sections clearly marked.', responsible_person: 'Katering: The Dining Co.' },
  { id: 'it-a05', start_time: '20:30', end_time: '20:45', activity: '🎤 Speech: Andi Wijaya (Sahabat)', notes: 'Durasi: max 5 menit. Sudah konfirmasi konten speech.', responsible_person: 'MC: Kevin M.' },
  { id: 'it-a06', start_time: '20:45', end_time: '21:00', activity: '🎤 Speech: Pak Tono (Orang Tua)', notes: 'Durasi: max 5 menit. Siapkan tisu 😊', responsible_person: 'MC: Kevin M.' },
  { id: 'it-a07', start_time: '21:00', end_time: '21:15', activity: '🎂 Birthday Cake & Toast', notes: 'Bring out the cake. Everyone raise glasses. "Happy Birthday" song. Photo moment.', responsible_person: 'MC + Fotografer' },
  { id: 'it-a08', start_time: '21:15', end_time: '23:00', activity: '🎵 Dance Floor Opens — DJ Plays', notes: 'DJ setlist: lounge → pop hits → EDM. Volume 70% until 22:00, then 90%.', responsible_person: 'DJ: Mas Arya' },
  { id: 'it-a09', start_time: '23:00', end_time: '23:30', activity: '🌙 Closing & Farewell', notes: 'Thank you speech by Budi. Gift distribution. Arrange transportation for guests.', responsible_person: 'Budi + Coordinator' },
]

// ── GIFT REGISTRY ────────────────────────────────────────────
export const MOCK_KIDS_REGISTRY = [
  { id: 'gr-k01', url: 'https://tokopedia.com', title: 'LEGO Classic Bricks Set 1500pcs', image_url: 'https://via.placeholder.com/80x80/FF6FCF/fff?text=LEGO', price_approx: 450000, currency: 'IDR', is_cash_fund: false, is_claimed: true, claimed_by: 'Tante Rina' },
  { id: 'gr-k02', url: 'https://tokopedia.com', title: 'Barbie Dreamhouse Playset', image_url: 'https://via.placeholder.com/80x80/FF85D1/fff?text=Barbie', price_approx: 750000, currency: 'IDR', is_cash_fund: false, is_claimed: false, claimed_by: null },
  { id: 'gr-k03', url: 'https://shopee.co.id', title: 'Play-Doh Ultimate Color Collection', image_url: 'https://via.placeholder.com/80x80/FFD93D/000?text=PlayDoh', price_approx: 350000, currency: 'IDR', is_cash_fund: false, is_claimed: true, claimed_by: 'Om Tono' },
  { id: 'gr-k04', url: 'https://shopee.co.id', title: 'Puzzle 100 Keping Unicorn', image_url: 'https://via.placeholder.com/80x80/C084FC/fff?text=Puzzle', price_approx: 180000, currency: 'IDR', is_cash_fund: false, is_claimed: false, claimed_by: null },
  { id: 'gr-k05', url: '', title: 'Dana / GoPay (untuk keperluan Alisha)', image_url: '', price_approx: null, currency: 'IDR', is_cash_fund: true, is_claimed: false, claimed_by: null },
]

export const MOCK_ADULT_REGISTRY = [
  { id: 'gr-a01', url: 'https://amazon.com', title: 'Sony WH-1000XM5 Noise Cancelling Headphones', image_url: 'https://via.placeholder.com/80x80/1E1B4B/C9A84C?text=Sony', price_approx: 3500000, currency: 'IDR', is_cash_fund: false, is_claimed: true, claimed_by: 'Kevin & Sarah' },
  { id: 'gr-a02', url: 'https://tokopedia.com', title: 'Buku "Atomic Habits" + "Deep Work" Bundle', image_url: 'https://via.placeholder.com/80x80/312E81/fff?text=Books', price_approx: 280000, currency: 'IDR', is_cash_fund: false, is_claimed: false, claimed_by: null },
  { id: 'gr-a03', url: 'https://lazada.co.id', title: 'Xiaomi Smart Air Purifier 4 Pro', image_url: 'https://via.placeholder.com/80x80/4F46E5/fff?text=Xiaomi', price_approx: 2100000, currency: 'IDR', is_cash_fund: false, is_claimed: false, claimed_by: null },
  { id: 'gr-a04', url: '', title: 'Transfer Bank / GoPay / OVO', image_url: '', price_approx: null, currency: 'IDR', is_cash_fund: true, is_claimed: false, claimed_by: null },
]

// ── BUDGET ITEMS (Adult only) ────────────────────────────────
export const MOCK_BUDGET_ITEMS = [
  { id: 'b01', category: 'Venue', description: 'Sewa Rooftop SKYE Bar 5 jam', estimated: 8000000, actual: 8500000, is_paid: true, icon: '🏙️' },
  { id: 'b02', category: 'Katering', description: 'Buffet dinner 40 orang (The Dining Co.)', estimated: 7000000, actual: 7000000, is_paid: true, icon: '🍽️' },
  { id: 'b03', category: 'Dekorasi', description: 'Bunga, centerpiece, balon, lighting', estimated: 2500000, actual: null, is_paid: false, icon: '💐' },
  { id: 'b04', category: 'Hiburan', description: 'DJ Mas Arya (4 jam)', estimated: 2000000, actual: null, is_paid: false, icon: '🎵' },
  { id: 'b05', category: 'Fotografer', description: 'Studio XYZ (5 jam + 100 edit foto)', estimated: 3000000, actual: 2800000, is_paid: true, icon: '📸' },
  { id: 'b06', category: 'Kue', description: 'Custom birthday cake 5 tiers', estimated: 1200000, actual: null, is_paid: false, icon: '🎂' },
  { id: 'b07', category: 'Minuman', description: 'Bar package — cocktail, mocktail, soft drink', estimated: 1500000, actual: null, is_paid: false, icon: '🍹' },
  { id: 'b08', category: 'Lain-lain', description: 'Souvenir, print, biaya tak terduga', estimated: 800000, actual: null, is_paid: false, icon: '🎁' },
]

// ── VENDORS ─────────────────────────────────────────────────
export const MOCK_KIDS_VENDORS = [
  { id: 'v-k01', type: 'entertainer', name: 'Kak Doni Magic Show', contact: '+62 812-1234-5678', confirmed: true, notes: 'Sulap 45 menit, sudah DP 50%' },
  { id: 'v-k02', type: 'photographer', name: 'Mas Yoga Photography', contact: '+62 813-9876-5432', confirmed: true, notes: 'Package 4 jam, 200 foto edit' },
  { id: 'v-k03', type: 'caterer', name: 'Katering Bu Dewi', contact: '+62 811-2233-4455', confirmed: true, notes: 'Menu anak-anak, sudah konfirmasi alergi list' },
  { id: 'v-k04', type: 'entertainer', name: 'Kak Mia Face Painting', contact: '+62 878-5544-3322', confirmed: false, notes: 'Menunggu konfirmasi' },
]

export const MOCK_ADULT_VENDORS = [
  { id: 'v-a01', type: 'photographer', name: 'Studio XYZ Photography', contact: '+62 812-5555-6666', confirmed: true, notes: '5 jam + 100 edit, lunas' },
  { id: 'v-a02', type: 'dj', name: 'DJ Mas Arya', contact: '+62 857-7777-8888', confirmed: true, notes: 'Setlist sudah disetujui, alat sendiri' },
  { id: 'v-a03', type: 'caterer', name: 'The Dining Co.', contact: '+62 21-555-0101', confirmed: true, notes: 'Buffet 40 pax, menu sudah final, lunas' },
  { id: 'v-a04', type: 'florist', name: 'Bloom & Co Florist', contact: '+62 21-555-0202', confirmed: false, notes: 'Menunggu konfirmasi desain' },
]

// ── THEMES ──────────────────────────────────────────────────
export const MOCK_KIDS_THEMES = [
  { id: 't-k01', slug: 'classic-balloons', name: 'Classic Balloons', emoji: '🎈', is_premium: false, colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'], desc: 'Balon warna-warni untuk setiap perayaan' },
  { id: 't-k02', slug: 'unicorn-dreams', name: 'Unicorn Dreams', emoji: '🦄', is_premium: true, colors: ['#FF6FD8', '#A855F7', '#FFD700', '#FFF0F9'], desc: 'Ajaib dan penuh warna pelangi' },
  { id: 't-k03', slug: 'space-explorer', name: 'Space Explorer', emoji: '🚀', is_premium: true, colors: ['#0F0C29', '#302B63', '#00D4FF', '#0A0A1A'], desc: 'Petualangan luar angkasa yang kosmik' },
  { id: 't-k04', slug: 'dinosaur-roar', name: 'Dinosaur Roar', emoji: '🦕', is_premium: true, colors: ['#2D6A4F', '#74C69D', '#FFB703', '#F0FFF4'], desc: 'Petualangan prasejarah yang liar' },
  { id: 't-k05', slug: 'under-the-sea', name: 'Under The Sea', emoji: '🐠', is_premium: true, colors: ['#0077B6', '#00B4D8', '#F7C59F', '#E0F7FA'], desc: 'Selami petualangan bawah laut' },
  { id: 't-k06', slug: 'princess-castle', name: 'Princess Castle', emoji: '👸', is_premium: true, colors: ['#C77DFF', '#E0AAFF', '#FFD700', '#FAF0FF'], desc: 'Pesta kerajaan untuk sang putri kecil' },
  { id: 't-k07', slug: 'superhero', name: 'Superhero League', emoji: '🦸', is_premium: true, colors: ['#DC2626', '#2563EB', '#FBBF24', '#F0F9FF'], desc: 'Kumpulkan semua pahlawan super!' },
  { id: 't-k08', slug: 'jungle-safari', name: 'Jungle Safari', emoji: '🦁', is_premium: true, colors: ['#92400E', '#D97706', '#65A30D', '#FEF3C7'], desc: 'Ekspedisi hutan tropis yang seru' },
]

export const MOCK_ADULT_THEMES = [
  { id: 't-a01', slug: 'simple-elegant', name: 'Simple Elegant', emoji: '✨', is_premium: false, colors: ['#18181B', '#3F3F46', '#E4E4E7', '#FAFAFA'], desc: 'Minimalis bersih dan sophisticated' },
  { id: 't-a02', slug: 'neon-party', name: 'Neon Night', emoji: '💜', is_premium: true, colors: ['#0D0D0D', '#1A1A1A', '#39FF14', '#BF00FF'], desc: 'Neon elektrik untuk malam tak terlupakan' },
  { id: 't-a03', slug: 'garden-soiree', name: 'Garden Soirée', emoji: '🌿', is_premium: true, colors: ['#2D6A4F', '#40916C', '#D4A373', '#FAFFF7'], desc: 'Elegan botanical garden party' },
  { id: 't-a04', slug: 'rooftop-glamour', name: 'Rooftop Glamour', emoji: '🌃', is_premium: true, colors: ['#0D1B2A', '#1B2838', '#C9A84C', '#0A0F1E'], desc: 'Kemewahan rooftop kota metropolitan' },
  { id: 't-a05', slug: 'retro-disco', name: 'Retro Disco', emoji: '🪩', is_premium: true, colors: ['#6A0572', '#AB0F7A', '#FFD700', '#1A0020'], desc: 'Demam disco 70s yang ikonik' },
  { id: 't-a06', slug: 'tropical-paradise', name: 'Tropical Paradise', emoji: '🌺', is_premium: true, colors: ['#FF6B35', '#F7931E', '#00CC88', '#FFFEF0'], desc: 'Liburan tropis yang vibrant' },
  { id: 't-a07', slug: 'black-gold', name: 'Black & Gold Luxe', emoji: '👑', is_premium: true, colors: ['#000000', '#1A1A1A', '#C9A84C', '#FFD700'], desc: 'Kemewahan hitam dan emas yang timeless' },
  { id: 't-a08', slug: 'coastal-breeze', name: 'Coastal Breeze', emoji: '🌊', is_premium: true, colors: ['#0077B6', '#00B4D8', '#F8F9FA', '#CAF0F8'], desc: 'Kesegaran pantai yang mewah dan tenang' },
]

// ── NOTIFICATIONS ────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  { id: 'n01', type: 'rsvp_new', title: 'RSVP Baru!', body: 'Ibu Sari telah konfirmasi kehadiran untuk pesta Alisha 🎉', is_read: false, created_at: '2026-06-15 09:30', event_id: 'evt-kids-001' },
  { id: 'n02', type: 'rsvp_new', title: 'RSVP Baru!', body: 'Ibu Dian telah konfirmasi kehadiran (2 anak) 👨‍👩‍👧‍👦', is_read: false, created_at: '2026-06-16 14:00', event_id: 'evt-kids-001' },
  { id: 'n03', type: 'rsvp_allergy', title: '⚠️ Peringatan Alergi!', body: 'Kiki (anak Ibu Maya) memiliki celiac disease — bebas gluten!', is_read: false, created_at: '2026-06-17 08:45', event_id: 'evt-kids-001' },
  { id: 'n04', type: 'checklist_reminder', title: 'Pengingat Checklist', body: 'Kamu punya 3 tugas yang belum selesai di periode "2 Minggu Sebelumnya"', is_read: true, created_at: '2026-06-18 09:00', event_id: 'evt-kids-001' },
  { id: 'n05', type: 'rsvp_new', title: 'RSVP Baru!', body: 'Andi Wijaya telah konfirmasi hadir untuk pesta Budi 🥂', is_read: true, created_at: '2026-06-20 10:00', event_id: 'evt-adult-001' },
]

// ── PHOTO WALL (post-event mock) ─────────────────────────────
export const MOCK_PHOTOS = [
  { id: 'ph01', uploader: 'Tante Rina', caption: 'Alisha tiup lilin! 🎂', emoji: '🎂', color: '#FF6FD8', uploaded_at: '2026-07-20 13:00' },
  { id: 'ph02', uploader: 'Om Tono', caption: 'Pertunjukan sulap yang keren!', emoji: '🎪', color: '#A855F7', uploaded_at: '2026-07-20 12:00' },
  { id: 'ph03', uploader: 'Ibu Sari', caption: 'Caca & Alisha bestie forever 💕', emoji: '👯', color: '#EC4899', uploaded_at: '2026-07-20 14:30' },
  { id: 'ph04', uploader: 'Mama', caption: 'Wajah bahagia putri kecilku 🥹', emoji: '🥹', color: '#F59E0B', uploaded_at: '2026-07-20 15:00' },
]

// ── AI SUGGESTIONS (mock) ─────────────────────────────────────
export const MOCK_AI_SUGGESTIONS_KIDS = [
  { id: 'ai-k01', category: 'Menu', suggestion: '💡 Berdasarkan 3 tamu dengan alergi kacang, rekomendasikan sunflower butter sebagai pengganti di menu sandwich.', action: 'Tambah ke catatan katering' },
  { id: 'ai-k02', category: 'Aktivitas', suggestion: '🎮 Untuk 8 anak usia 5-7 tahun, permainan "Estafet Balon" dan "Musical Chairs" sangat cocok dan mudah diorganisir.', action: 'Tambah ke itinerary' },
  { id: 'ai-k03', category: 'Dekorasi', suggestion: '🦄 Tema Unicorn Dreams cocok dengan palet warna pastel pink & lavender. Rekomendasikan: balon chrome rose gold + balon putih.', action: 'Simpan ide ini' },
]

export const MOCK_AI_SUGGESTIONS_ADULT = [
  { id: 'ai-a01', category: 'Bar', suggestion: '🍾 Untuk 40 tamu dengan 4 jam party, estimasi kebutuhan: 8 botol wine, 4 botol spirits, 20 liter soft drink, dan 2 krat bir.', action: 'Kirim ke katering' },
  { id: 'ai-a02', category: 'Budget', suggestion: '💰 Budget Anda saat ini 18% di atas estimasi. Pertimbangkan mengurangi dekorasi atau negosiasi ulang paket fotografer.', action: 'Lihat detail budget' },
  { id: 'ai-a03', category: 'Musik', suggestion: '🎵 Untuk pesta rooftop elegan, rekomendasikan playlist: "Jazz at 8pm → Indie Chill → Pop Hits → Dance" untuk menjaga energi.', action: 'Buka Spotify' },
]
