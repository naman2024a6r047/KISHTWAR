// ─────────────────────────────────────────────
// Application Constants
// ─────────────────────────────────────────────

export const APP_NAME = "Kishtwar Tourism";
export const APP_TAGLINE = "Land of Sapphire, Saffron & Shrines";
export const APP_DESCRIPTION =
  "Discover Kishtwar – Land of Sapphire, Saffron & Shrines. Explore breathtaking valleys, ancient temples, adventure trails, and rich cultural heritage in the crown of Jammu & Kashmir.";

// ─────────────────────────────────────────────
// Kishtwar Quick Facts
// ─────────────────────────────────────────────

export const KISHTWAR_FACTS = {
  population: "2.35 Lakhs+",
  area: "8,098 km²",
  elevation: "1,650 m",
  languages: "Kishtwari, Hindi, Urdu, Kashmiri",
  districtFormed: "2007",
} as const;

// ─────────────────────────────────────────────
// Navigation Items
// ─────────────────────────────────────────────

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About Kishtwar", href: "/about" },
  {
    label: "Tourism",
    href: "/tourist-places",
    children: [
      { label: "Tourist Places", href: "/tourist-places" },
      { label: "Adventure", href: "/tourist-places?category=adventure-spots" },
      { label: "Interactive Map", href: "/map" },
      { label: "Plan Your Trip", href: "/#plan-trip" },
    ],
  },
  { label: "Culture & Heritage", href: "/culture-heritage" },
  { label: "Saffron & Sapphire", href: "/saffron-sapphire" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Directory", href: "/directory" },
  { label: "Contact", href: "/contact" },
] as const;

// ─────────────────────────────────────────────
// Quick Nav Section Items
// ─────────────────────────────────────────────

export const QUICK_NAV_ITEMS = [
  { label: "Tourist Places", subtitle: "Explore Top Destinations", href: "/tourist-places", icon: "MapPin" },
  { label: "Hotels & Stays", subtitle: "Find Best Places to Stay", href: "/directory?type=hotels", icon: "Building2" },
  { label: "Adventure", subtitle: "Trekking, Camping & More", href: "/tourist-places?category=adventure-spots", icon: "Mountain" },
  { label: "Culture", subtitle: "Heritage, Festivals & Food", href: "/culture-heritage", icon: "Landmark" },
  { label: "Saffron & Sapphire", subtitle: "Our Pride & Heritage", href: "/saffron-sapphire", icon: "Gem" },
  { label: "Interactive Map", subtitle: "Explore Kishtwar", href: "/map", icon: "Map" },
] as const;

// ─────────────────────────────────────────────
// Stats Section Data
// ─────────────────────────────────────────────

export const STATS_DATA = [
  { value: 100, suffix: "+", label: "Tourist Places", icon: "MapPin" },
  { value: 50, suffix: "+", label: "Trekking Routes", icon: "Route" },
  { value: 35, suffix: "+", label: "Homestays", icon: "Home" },
  { value: 20, suffix: "+", label: "Festivals", icon: "PartyPopper" },
  { value: 0, suffix: "", label: "Rich", sublabel: "Culture & Heritage", icon: "Sparkles" },
  { value: 0, suffix: "", label: "Warm", sublabel: "Hospitality", icon: "Heart" },
] as const;

// ─────────────────────────────────────────────
// Footer Links
// ─────────────────────────────────────────────

export const FOOTER_SECTIONS = [
  {
    title: "Plan Your Trip",
    links: [
      { label: "How to Reach", href: "/about#how-to-reach" },
      { label: "Best Time to Visit", href: "/about#best-time" },
      { label: "Travel Guide", href: "/blog?category=travel-guide" },
      { label: "Itinerary Planner", href: "/#plan-trip" },
    ],
  },
  {
    title: "Stay & Eat",
    links: [
      { label: "Hotels", href: "/directory?type=hotels" },
      { label: "Homestays", href: "/directory?type=homestays" },
      { label: "Restaurants", href: "/directory?type=restaurants" },
      { label: "Local Food", href: "/culture-heritage#food" },
    ],
  },
  {
    title: "Adventure",
    links: [
      { label: "Trekking", href: "/tourist-places?category=adventure-spots" },
      { label: "Camping", href: "/tourist-places?tag=camping" },
      { label: "Wildlife Tourism", href: "/explore/kishtwar-national-park" },
      { label: "Winter Tourism", href: "/blog?tag=winter" },
    ],
  },
  {
    title: "Essential Info",
    links: [
      { label: "Weather", href: "/about#weather" },
      { label: "Emergency Contacts", href: "/about#emergency" },
      { label: "Hospitals", href: "/map?filter=hospitals" },
      { label: "Transport", href: "/about#transport" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Upload Photos", href: "/contributor/photos" },
      { label: "Write a Review", href: "/tourist-places" },
      { label: "Ask a Question", href: "/contact" },
    ],
  },
  {
    title: "For Locals",
    links: [
      { label: "Business Directory", href: "/directory" },
      { label: "Education", href: "/directory?type=education" },
      { label: "Government Services", href: "/directory?type=government" },
      { label: "Job Opportunities", href: "/directory?type=jobs" },
    ],
  },
] as const;

// ─────────────────────────────────────────────
// Homepage Section Keys (matches DB)
// ─────────────────────────────────────────────

export const HOMEPAGE_SECTIONS = [
  "hero",
  "quick_nav",
  "explore",
  "about",
  "stats",
  "culture",
  "saffron_sapphire",
  "adventure",
  "map_preview",
  "gallery_preview",
  "blog_preview",
  "video_preview",
  "events_preview",
  "plan_trip",
  "newsletter",
] as const;

export type HomepageSectionKey = (typeof HOMEPAGE_SECTIONS)[number];

// ─────────────────────────────────────────────
// Explore Landing Pages
// ─────────────────────────────────────────────

export const EXPLORE_PAGES = [
  { slug: "machail-yatra", title: "Machail Yatra", icon: "Temple" },
  { slug: "kishtwar-saffron", title: "Kishtwar Saffron", icon: "Flower2" },
  { slug: "paddar-sapphire", title: "Paddar Sapphire", icon: "Gem" },
  { slug: "dogra-heritage", title: "Dogra Heritage", icon: "Castle" },
  { slug: "kishtwar-history", title: "Kishtwar History", icon: "History" },
  { slug: "warwan-valley", title: "Warwan Valley", icon: "Mountain" },
  { slug: "marwah-valley", title: "Marwah Valley", icon: "TreePine" },
  { slug: "dachhan-valley", title: "Dachhan Valley", icon: "Waves" },
  { slug: "chatroo", title: "Chatroo", icon: "MapPin" },
  { slug: "kishtwar-national-park", title: "Kishtwar National Park", icon: "Leaf" },
] as const;

// ─────────────────────────────────────────────
// Content Status Labels & Colors
// ─────────────────────────────────────────────

export const STATUS_CONFIG = {
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-700", dotColor: "bg-gray-400" },
  SUBMITTED: { label: "Submitted", color: "bg-yellow-100 text-yellow-700", dotColor: "bg-yellow-400" },
  APPROVED: { label: "Approved", color: "bg-blue-100 text-blue-700", dotColor: "bg-blue-400" },
  PUBLISHED: { label: "Published", color: "bg-green-100 text-green-700", dotColor: "bg-green-400" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-700", dotColor: "bg-red-400" },
} as const;

// ─────────────────────────────────────────────
// Pagination Defaults
// ─────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

// ─────────────────────────────────────────────
// Map Configuration
// ─────────────────────────────────────────────

export const KISHTWAR_CENTER = {
  lat: 33.3167,
  lng: 75.7667,
  zoom: 10,
} as const;

export const MAP_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// ─────────────────────────────────────────────
// Social Links
// ─────────────────────────────────────────────

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/kishtwar",
  twitter: "https://twitter.com/kishtwar",
  instagram: "https://instagram.com/kishtwar",
  youtube: "https://youtube.com/@kishtwar",
} as const;
