export const COUPLES_NAMES = {
  MALE: "Mohamed",
  FEMALE: "Jilan",
};

export const INVITATION_DATE = {
  day: 27,
  month: 8,
  year: 2026,
  hour: 18,
  minute: 0,
  time: "6 pm - 9 pm",
};

export const InvitationLocations = {
  labelShort: "Giza Yacht Club 101",
  label: "Giza Yacht Club 101 El Nil St.، Ad Doqi, Giza, Giza Governorate",
  link: "https://www.google.com/maps?cid=2322453712841119133&hl=en&gl=us",
};

/** Card art lives in /public/cards as 190/380/570px webp variants — see scripts/resize-cards.mjs. */
export const GAME_CARD_CONTENT = [
  {
    id: 1,
    value: true,
    userImage: "/cards/gbr",
    alt: "the groom image",
  },
  {
    id: 2,
    value: true,
    userImage: "/cards/jilan",
    alt: "the bride image",
  },
  {
    id: 3,
    value: false,
    userImage: "/cards/flynn-poster",
    alt: "the funny image",
  },
];

/* ── rsvp ─────────────────────────────────────────────────────────────────── */

/** The bounds the form enforces and the SQL `check` constraints mirror. */
export const RSVP_LIMITS = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 80,
  MIN_GUESTS: 1,
  MAX_GUESTS: 10,
  MAX_MESSAGE_LENGTH: 500,
  /** 5 MB — a phone photo passes, a screen recording does not. */
  MAX_PHOTO_BYTES: 5 * 1024 * 1024,
  ACCEPTED_PHOTO_TYPES: "image/png,image/jpeg,image/webp,image/heic,image/heif",
} as const;

/**
 * Shown when Supabase is unreachable or the keys are missing. Arabic on purpose
 * — the guests who would rather text Gbr than read an English error are the
 * ones this line is for.
 */
export const RSVP_MAINTENANCE_AR = {
  message: "الفورم واقع مؤقتاً 🙈 — كلّم جبر وهو يظبطها، وجرّب تاني بعد شوية.",
  retryLabel: "جرّب تاني",
};

/** Remembers a sent RSVP across reloads, so the success card comes back. */
export const RSVP_STORAGE_KEY = "rsvp:submitted";

/**
 * The song behind the site. Audio-only remux of the source clip in
 * public/voice — the aac track copied out of the mp4, no re-encode, so it is
 * 783 KB against the video's 2 MB and the quality is bit-identical.
 */
export const BACKGROUND_MUSIC = {
  src: "/voice/ala-shate-el-hawa.m4a",
  /** Under a wedding video's own audio, so the two never fight. */
  volume: 0.55,
};

/** Remembers a muted song, so a reload does not start it up again. */
export const MUSIC_STORAGE_KEY = "music:muted";
