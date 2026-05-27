export interface GalleryImage {
  id: string;
  title_fr: string;
  title_he: string;
  description_fr: string | null;
  description_he: string | null;
  image_url: string;
  event_type: 'wedding' | 'bar_mitzvah' | 'bat_mitzvah' | 'brit' | 'event';
  sort_order: number;
}

export const GALLERY_IMAGES: GalleryImage[] = [
  // ── Buffet dessert (10 photos) ──────────────────────────────
  { id: 'dessert_01', title_fr: 'Buffet Dessert', title_he: 'בופה מתוק', description_fr: null, description_he: null, image_url: '/images/event-gallery/dessert_01.jpg', event_type: 'wedding', sort_order: 10 },
  { id: 'dessert_02', title_fr: 'Buffet Dessert', title_he: 'בופה מתוק', description_fr: null, description_he: null, image_url: '/images/event-gallery/dessert_02.jpg', event_type: 'wedding', sort_order: 11 },
  { id: 'dessert_03', title_fr: 'Buffet Dessert', title_he: 'בופה מתוק', description_fr: null, description_he: null, image_url: '/images/event-gallery/dessert_03.jpg', event_type: 'wedding', sort_order: 12 },
  { id: 'dessert_04', title_fr: 'Buffet Dessert', title_he: 'בופה מתוק', description_fr: null, description_he: null, image_url: '/images/event-gallery/dessert_04.jpg', event_type: 'wedding', sort_order: 13 },
  { id: 'dessert_05', title_fr: 'Buffet Dessert', title_he: 'בופה מתוק', description_fr: null, description_he: null, image_url: '/images/event-gallery/dessert_05.jpg', event_type: 'wedding', sort_order: 14 },
  { id: 'dessert_06', title_fr: 'Buffet Dessert', title_he: 'בופה מתוק', description_fr: null, description_he: null, image_url: '/images/event-gallery/dessert_06.jpg', event_type: 'wedding', sort_order: 15 },
  { id: 'dessert_07', title_fr: 'Buffet Dessert', title_he: 'בופה מתוק', description_fr: null, description_he: null, image_url: '/images/event-gallery/dessert_07.jpg', event_type: 'wedding', sort_order: 16 },
  { id: 'dessert_08', title_fr: 'Buffet Dessert', title_he: 'בופה מתוק', description_fr: null, description_he: null, image_url: '/images/event-gallery/dessert_08.jpg', event_type: 'wedding', sort_order: 17 },
  { id: 'dessert_09', title_fr: 'Buffet Dessert', title_he: 'בופה מתוק', description_fr: null, description_he: null, image_url: '/images/event-gallery/dessert_09.jpg', event_type: 'wedding', sort_order: 18 },
  { id: 'dessert_10', title_fr: 'Buffet Dessert', title_he: 'בופה מתוק', description_fr: null, description_he: null, image_url: '/images/event-gallery/dessert_10.jpg', event_type: 'wedding', sort_order: 19 },

  // ── Bar Mitzvah ─────────────────────────────────────────────
  { id: 'bar_mitzvah_001', title_fr: 'Bar Mitzvah', title_he: 'בר מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bar_mitzvah_001.jpg', event_type: 'bar_mitzvah', sort_order: 30 },
  { id: 'bar_mitzvah_002', title_fr: 'Bar Mitzvah', title_he: 'בר מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bar_mitzvah_002.jpg', event_type: 'bar_mitzvah', sort_order: 31 },
  { id: 'bar_mitzvah_003', title_fr: 'Bar Mitzvah', title_he: 'בר מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bar_mitzvah_003.jpg', event_type: 'bar_mitzvah', sort_order: 32 },
  { id: 'bar_mitzvah_004', title_fr: 'Bar Mitzvah', title_he: 'בר מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bar_mitzvah_004.jpg', event_type: 'bar_mitzvah', sort_order: 33 },
  { id: 'bar_mitzvah_005', title_fr: 'Bar Mitzvah', title_he: 'בר מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bar_mitzvah_005.jpg', event_type: 'bar_mitzvah', sort_order: 34 },
  { id: 'bar_mitzvah_006', title_fr: 'Bar Mitzvah', title_he: 'בר מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bar_mitzvah_006.jpg', event_type: 'bar_mitzvah', sort_order: 35 },
  { id: 'bar_mitzvah_008', title_fr: 'Bar Mitzvah', title_he: 'בר מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bar_mitzvah_008.jpg', event_type: 'bar_mitzvah', sort_order: 36 },
  { id: 'bar_mitzvah_009', title_fr: 'Bar Mitzvah', title_he: 'בר מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bar_mitzvah_009.jpg', event_type: 'bar_mitzvah', sort_order: 37 },
  { id: 'bar_mitzvah_010', title_fr: 'Bar Mitzvah', title_he: 'בר מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bar_mitzvah_010.jpg', event_type: 'bar_mitzvah', sort_order: 38 },
  { id: 'bar_mitzvah_011', title_fr: 'Bar Mitzvah', title_he: 'בר מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bar_mitzvah_011.jpg', event_type: 'bar_mitzvah', sort_order: 39 },

  // ── Bat Mitzvah ─────────────────────────────────────────────
  { id: 'bat_mitzvah_001', title_fr: 'Bat Mitzvah', title_he: 'בת מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bat_mitzvah_001.jpg', event_type: 'bat_mitzvah', sort_order: 50 },
  { id: 'bat_mitzvah_002', title_fr: 'Bat Mitzvah', title_he: 'בת מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bat_mitzvah_002.jpg', event_type: 'bat_mitzvah', sort_order: 51 },
  { id: 'bat_mitzvah_003', title_fr: 'Bat Mitzvah', title_he: 'בת מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bat_mitzvah_003.jpg', event_type: 'bat_mitzvah', sort_order: 52 },
  { id: 'bat_mitzvah_004', title_fr: 'Bat Mitzvah', title_he: 'בת מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bat_mitzvah_004.jpg', event_type: 'bat_mitzvah', sort_order: 53 },
  { id: 'bat_mitzvah_007', title_fr: 'Bat Mitzvah', title_he: 'בת מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bat_mitzvah_007.jpg', event_type: 'bat_mitzvah', sort_order: 54 },
  { id: 'bat_mitzvah_008', title_fr: 'Bat Mitzvah', title_he: 'בת מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bat_mitzvah_008.jpg', event_type: 'bat_mitzvah', sort_order: 55 },
  { id: 'bat_mitzvah_010', title_fr: 'Bat Mitzvah', title_he: 'בת מצווה', description_fr: null, description_he: null, image_url: '/images/event-gallery/bat_mitzvah_010.jpg', event_type: 'bat_mitzvah', sort_order: 56 },

  // ── Brit Mila ───────────────────────────────────────────────
  { id: 'brit_002', title_fr: 'Brit Mila', title_he: 'ברית מילה', description_fr: null, description_he: null, image_url: '/images/event-gallery/brit_002.jpg', event_type: 'brit', sort_order: 60 },
  { id: 'brit_003', title_fr: 'Brit Mila', title_he: 'ברית מילה', description_fr: null, description_he: null, image_url: '/images/event-gallery/brit_003.jpg', event_type: 'brit', sort_order: 61 },
  { id: 'brit_004', title_fr: 'Brit Mila', title_he: 'ברית מילה', description_fr: null, description_he: null, image_url: '/images/event-gallery/brit_004.jpg', event_type: 'brit', sort_order: 62 },
  { id: 'brit_005', title_fr: 'Brit Mila', title_he: 'ברית מילה', description_fr: null, description_he: null, image_url: '/images/event-gallery/brit_005.jpg', event_type: 'brit', sort_order: 63 },

  // ── Événements ──────────────────────────────────────────────
  { id: 'wedding_001', title_fr: 'Événement', title_he: 'אירוע', description_fr: null, description_he: null, image_url: '/images/event-gallery/wedding_001.jpg', event_type: 'event', sort_order: 70 },
  { id: 'wedding_004', title_fr: 'Événement', title_he: 'אירוע', description_fr: null, description_he: null, image_url: '/images/event-gallery/wedding_004.jpg', event_type: 'event', sort_order: 71 },
  { id: 'wedding_006', title_fr: 'Événement', title_he: 'אירוע', description_fr: null, description_he: null, image_url: '/images/event-gallery/wedding_006.jpg', event_type: 'event', sort_order: 72 },
  { id: 'wedding_007', title_fr: 'Événement', title_he: 'אירוע', description_fr: null, description_he: null, image_url: '/images/event-gallery/wedding_007.jpg', event_type: 'event', sort_order: 73 },
  { id: 'event_001', title_fr: 'Événement', title_he: 'אירוע', description_fr: null, description_he: null, image_url: '/images/event-gallery/event_001.jpg', event_type: 'event', sort_order: 74 },
  { id: 'event_002', title_fr: 'Événement', title_he: 'אירוע', description_fr: null, description_he: null, image_url: '/images/event-gallery/event_002.jpg', event_type: 'event', sort_order: 75 },
  { id: 'event_003', title_fr: 'Événement', title_he: 'אירוע', description_fr: null, description_he: null, image_url: '/images/event-gallery/event_003.jpg', event_type: 'event', sort_order: 76 },
  { id: 'event_004', title_fr: 'Événement', title_he: 'אירוע', description_fr: null, description_he: null, image_url: '/images/event-gallery/event_004.jpg', event_type: 'event', sort_order: 77 },
  { id: 'event_005', title_fr: 'Événement', title_he: 'אירוע', description_fr: null, description_he: null, image_url: '/images/event-gallery/event_005.jpg', event_type: 'event', sort_order: 78 },
  { id: 'event_007', title_fr: 'Événement', title_he: 'אירוע', description_fr: null, description_he: null, image_url: '/images/event-gallery/event_007.jpg', event_type: 'event', sort_order: 79 },
  { id: 'event_008', title_fr: 'Événement', title_he: 'אירוע', description_fr: null, description_he: null, image_url: '/images/event-gallery/event_008.jpg', event_type: 'event', sort_order: 80 },
  { id: 'event_009', title_fr: 'Événement', title_he: 'אירוע', description_fr: null, description_he: null, image_url: '/images/event-gallery/event_009.jpg', event_type: 'event', sort_order: 81 },
];
