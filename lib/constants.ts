// ── Marketing content ──────────────────────────────────────────────────────────
export const WHY_YUSHO = [
  {
    key: "local",
    title: "Local knowledge",
    text: "Born and based in Arba Minch. We know the springs, the lakes, the highlands and the people — not from a guidebook, but from growing up here.",
  },
  {
    key: "guides",
    title: "Experienced guides",
    text: "Friendly, fluent guides who turn every drive and every story into something you'll remember long after you get home.",
  },
  {
    key: "flexible",
    title: "Flexible private tours",
    text: "Go when you want, at your own pace. Private and family tours shaped around your plans, not a fixed schedule.",
  },
  {
    key: "students",
    title: "Student support",
    text: "New to Arba Minch University? We help with receiving, accommodation, registration guidance and settling in — honestly and properly.",
  },
  {
    key: "trust",
    title: "Trusted local connections",
    text: "Real relationships with hotels, boat operators, guides and communities across southern Ethiopia.",
  },
  {
    key: "memories",
    title: "Memorable experiences",
    text: "From hippo safaris to Dorze weaving, we design moments — not just itineraries.",
  },
] as const;

export const FEATURED_EXPERIENCES = [
  {
    id: "family-day",
    title: "Family Day Tour",
    text: "A warm, easy-paced day through springs, lakes and highland villages — built for families of every size.",
    image: "/images/seed/family-1.webp",
    href: "/private-tour",
    cta: "Plan it with us",
  },
  {
    id: "chamo",
    title: "Lake Chamo Experience",
    text: "Watch dozens of giant crocodiles bask and hippos surface on the Rift's great wildlife lake.",
    image: "/images/seed/lakechamo.webp",
    href: "/destinations/lake-chamo",
    cta: "Explore Lake Chamo",
  },
  {
    id: "dorze",
    title: "Dorze Cultural Experience",
    text: "Wander between bamboo homes that can stand for 80 years and watch master weavers in action.",
    image: "/images/seed/dorzevillage.webp",
    href: "/destinations/dorze-village",
    cta: "Meet the Dorze",
  },
  {
    id: "waterfall",
    title: "Waterfall Adventure",
    text: "Trek the bamboo-fringed highlands to Dorsso's roaring falls at almost 2,900 m.",
    image: "/images/seed/waterfall-1.webp",
    href: "/destinations/dorsso-waterfall",
    cta: "Chase the water",
  },
  {
    id: "welcome",
    title: "Student Welcome Experience",
    text: "Land in Arba Minch and let us handle the rest — receiving, orientation and a first taste of the region.",
    image: "/images/seed/event-students-1.webp",
    href: "/student-services",
    cta: "Student services",
  },
  {
    id: "private",
    title: "Private Arba Minch Tour",
    text: "Your own vehicle, your own guide, your own southern Ethiopia. Tell us what you love and we design around it.",
    image: "/images/seed/travel-2.webp",
    href: "/private-tour",
    cta: "Request a private tour",
  },
] as const;

export const STUDENT_PACKAGES = [
  {
    id: "YUSHO_TOUR",
    name: "Package 1 — Yusho Tour",
    shortName: "Yusho Tour",
    tagline: "Private destination tour for the student and family",
    price: "From ETB 3,500",
    features: [
      "Private vehicle & driver-guide",
      "Choose your destination — Forty Springs, Lake Chamo, Dorze…",
      "Park, boat & guide fees included",
      "Flexible timing around your schedule",
      "Perfect for family days out",
    ],
    image: "/images/seed/forty-springs-1.webp",
    popular: false,
  },
  {
    id: "WELCOME_TOUR",
    name: "Package 2 — Yusho Welcome + Tour",
    shortName: "Yusho Welcome + Tour",
    tagline: "Receive, get settled, then explore",
    price: "From ETB 5,500",
    features: [
      "Meet & receive at airport or bus station",
      "Transportation assistance into town",
      "Luggage handling & guidance",
      "A destination tour (4–6 hours)",
      "Local phone / sim & map guidance",
    ],
    image: "/images/seed/travel-1.webp",
    popular: true,
  },
  {
    id: "STAY_WELCOME",
    name: "Package 3 — Yusho Stay + Welcome",
    shortName: "Yusho Stay + Welcome",
    tagline: "Arrival comfort, accommodation handled",
    price: "From ETB 7,500",
    features: [
      "Everything in Welcome + Tour",
      "Hotel / accommodation arrangement",
      "Accommodation assistance & check-in help",
      "Verified, student-friendly stays",
      "24/7 phone support during your stay",
    ],
    image: "/images/seed/dorze-3.webp",
    popular: false,
  },
  {
    id: "COMPLETE",
    name: "Package 4 — Yusho Complete",
    shortName: "Yusho Complete",
    tagline: "Full arrival-to-dorm support",
    price: "From ETB 12,000",
    features: [
      "Arrival → Receiving",
      "Hotel arrangement before settling",
      "Registration-process assistance",
      "Help finding the right university offices",
      "Dormitory-process guidance & reaching your room",
      "Basic orientation walks",
      "Optional family tour to end the week",
    ],
    image: "/images/seed/event-students-2.webp",
    popular: true,
  },
] as const;

export const STUDENT_SERVICES_LIST = [
  "Receiving students at arrival",
  "Transportation assistance",
  "Hotel & accommodation arrangements",
  "Registration-process guidance",
  "Form-filling assistance",
  "Finding the right university offices",
  "Campus navigation",
  "Dormitory-process guidance",
  "Helping students reach their dormitory",
  "Basic orientation & welcome",
] as const;

export const STUDENT_DISCLAIMER =
  "Yusho Travel is an independent travel & student-support company. We assist, guide and support families through official university processes — we are not an official university office and cannot act on the university's behalf.";

export const HERO_IMAGE = "/images/seed/bgimage.webp";
export const APP_NAME = "Yusho Travel";
export const APP_TAGLINE = "Your Journey Starts Here.";
export const APP_SUB = "Explore. Experience. Connect.";
export const AMHARIC_WORD = "ዙረት";
export const AMHARIC_NOTE = "“Yusho” — a Gamo word for journeying; going around, exploring, experiencing place.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SESSION_COOKIE = "yusho_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const CONTACT_EMAIL = "hello@yushotravel.com";
export const CONTACT_PHONE = "+251 46 881 2345";
export const CONTACT_PHONE_DISPLAY = "+251 46 881 2345";
export const CONTACT_CITY = "Arba Minch, Ethiopia";
export const CONTACT_ADDRESS = "Sikela, Arba Minch, Southern Ethiopia";

export const NAV_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Events", href: "/events" },
  { label: "Private Tour", href: "/private-tour" },
  { label: "Student Services", href: "/student-services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

// ── Status display maps ────────────────────────────────────────────────────────
export type Tone = "green" | "teal" | "gold" | "amber" | "red" | "slate" | "blue";

export const BOOKING_STATUS: Record<string, { label: string; tone: Tone }> = {
  PENDING: { label: "Pending", tone: "amber" },
  CONFIRMED: { label: "Confirmed", tone: "teal" },
  CANCELLED: { label: "Cancelled", tone: "slate" },
  COMPLETED: { label: "Completed", tone: "green" },
  REJECTED: { label: "Rejected", tone: "red" },
};

export const EVENT_BOOKING_STATUS: Record<string, { label: string; tone: Tone }> = BOOKING_STATUS;

export const REQUEST_STATUS: Record<string, { label: string; tone: Tone }> = {
  PENDING: { label: "Pending", tone: "amber" },
  CONTACTED: { label: "Contacted", tone: "blue" },
  IN_PROGRESS: { label: "In progress", tone: "teal" },
  QUOTED: { label: "Quoted", tone: "teal" },
  CONFIRMED: { label: "Confirmed", tone: "green" },
  DONE: { label: "Done", tone: "green" },
  DECLINED: { label: "Declined", tone: "red" },
};

export const MESSAGE_STATUS: Record<string, { label: string; tone: Tone }> = {
  NEW: { label: "New", tone: "gold" },
  READ: { label: "Read", tone: "blue" },
  HANDLED: { label: "Handled", tone: "green" },
};

export const EVENT_STATUS: Record<string, { label: string; tone: Tone }> = {
  UPCOMING: { label: "Upcoming", tone: "teal" },
  PAST: { label: "Past", tone: "slate" },
  CANCELLED: { label: "Cancelled", tone: "red" },
  DRAFT: { label: "Draft", tone: "slate" },
};

// ── Filters ────────────────────────────────────────────────────────────────────
export const DESTINATION_CATEGORIES = ["Nature", "Wildlife", "Cultural", "Adventure", "Lake"] as const;

export const PRICE_BUCKETS = [
  { id: "under1500", label: "Under ETB 1,500", min: 0, max: 1500 },
  { id: "1500to3000", label: "ETB 1,500 – 3,000", min: 1500, max: 3000 },
  { id: "3000to6000", label: "ETB 3,000 – 6,000", min: 3000, max: 6000 },
  { id: "over6000", label: "ETB 6,000+", min: 6000, max: Infinity },
] as const;

export const DURATION_FILTERS = [
  { id: "half", label: "Half day", max: 6 },
  { id: "full", label: "Full day", max: 14 },
  { id: "overnight", label: "Overnight & more", max: 24 },
] as const;

export const DESTINATION_REGIONS = ["Arba Minch", "Lake Chamo", "Gamo Highlands", "Dorze Escarpment"] as const;

export const SORT_OPTIONS = [
  { id: "popular", label: "Most popular" },
  { id: "rating", label: "Highest rated" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
] as const;

export const EVENT_CATEGORIES = [
  { value: "concert", label: "Concert", emoji: "🎶" },
  { value: "cultural", label: "Cultural", emoji: "🪘" },
  { value: "social", label: "Social", emoji: "✨" },
  { value: "outdoor", label: "Outdoor", emoji: "⛰️" },
  { value: "student", label: "Student", emoji: "🎓" },
  { value: "private", label: "Private", emoji: "🔒" },
] as const;

export const BUDGET_RANGES = [
  "Under ETB 5,000",
  "ETB 5,000 – 10,000",
  "ETB 10,000 – 25,000",
  "ETB 25,000+",
] as const;

export const TRANSPORT_PREFS = [
  "Pickup from airport / bus station",
  "Private vehicle for the tour",
  "Public transport is fine",
  "I have my own transport",
] as const;

export const ARRIVAL_LOCATIONS = ["Arba Minch Airport", "Central Bus Station", "Hotel", "Other"] as const;

export const BOOKING_MODES: Record<string, { label: string; hint: string }> = {
  GROUP: { label: "Group seat", hint: "Join a scheduled group departure" },
  PRIVATE: { label: "Private tour", hint: "Just your group — fully custom timing" },
  FAMILY: { label: "Family package", hint: "Relaxed pace, kid-friendly planning" },
};

export const ADD_ON_SERVICES = [
  { id: "hotel", label: "Hotel arrangement", price: 1200, note: "We book and confirm your stay" },
  { id: "pickup", label: "Airport / bus station pickup", price: 800, note: "Meet & greet at arrival" },
  { id: "lunch", label: "Traditional lunch", price: 400, note: "Local Gamo & southern menu" },
  { id: "photography", label: "Photographer on tour", price: 900, note: "Edited photos after your trip" },
] as const;