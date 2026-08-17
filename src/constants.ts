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
