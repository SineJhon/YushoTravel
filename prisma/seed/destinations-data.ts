import { img } from "./helpers";

export type PackageSeed = {
  name: string;
  description: string;
  price: number;
  duration: string;
  minGroupSize?: number;
  maxGroupSize?: number;
  privateOnly?: boolean;
};

export type DestinationSeed = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  location: string;
  region: string;
  duration: string;
  durationHours: number;
  basePrice: number;
  category: string;
  highlights: string;
  thingsToDo: string;
  whatsIncluded: string;
  whatsExcluded: string;
  requirements: string;
  meetingInfo: string;
  latitude: number;
  longitude: number;
  mapQuery: string;
  featured: boolean;
  distanceKm?: string;
  travelTime?: string;
  vicinity?: string;
  visitInfo?: string;
  images: { url: string; alt: string; order: number }[];
  packages: PackageSeed[];
};

export const destinationsData: DestinationSeed[] = [
  {
    slug: "forty-springs",
    name: "Forty Springs",
    tagline: "The forty springs that gave Arba Minch its name",
    description:
      "Forty crystal-clear springs bubble up from the base of the Rift Valley escarpment, feeding a dense, shaded forest that stays green and cool year-round. It is this very phenomenon that gave the town its name — 'Arba Minch' means 'forty springs' in Amharic. The pools are a quiet, near-sacred escape: swim and cool off, listen to the birdsong, spot baboons in the canopy and meet locals who still walk down at dawn as their parents did.",
    location: "Arba Minch city, 4.6 km from the centre",
    region: "Arba Minch",
    distanceKm: "4.6 km",
    travelTime: "~12 minutes by car",
    vicinity: "In the city",
    visitInfo:
      "Available in the city|Free to go at any time before 10:00 LT for the great experience|Covered within a half day",
    duration: "Half to full day",
    durationHours: 6,
    basePrice: 1200,
    category: "Nature",
    highlights:
      "Swim in the clear spring pools|Baboons and endemic birds in the shade|Where Arba Minch's name comes from|Coffee ceremony with a local family",
    thingsToDo: "Exploring Natural Springs|Nature Walks|Photography|Swimming",
    whatsIncluded: "Photography|Transport (type based on preference)|Tour guide and security|Ticket for visiting and swimming",
    whatsExcluded: "Lunch (add to your booking)|Boat trip on Lake Abaya",
    requirements: "Comfortable shoes, swimwear, sun protection.",
    meetingInfo: "Pickup from your hotel or the Yusho office in Sikela at 8:30 AM.",
    latitude: 6.2957,
    longitude: 37.4378,
    mapQuery: "Shesher forty springs, Ethiopia",
    featured: true,
    images: [{ url: img("fortyspring"), alt: "Forty Springs natural pools", order: 0 }],
    packages: [
      { name: "Group Day Tour", description: "Join the daily shared departure.", price: 1200, duration: "Full day", maxGroupSize: 12 },
      { name: "Private Day Tour", description: "Your own car, guide and timing.", price: 2600, duration: "Full day", minGroupSize: 1, maxGroupSize: 6, privateOnly: true },
      { name: "Family Day", description: "Relaxed pace for families with kids.", price: 1600, duration: "Full day", maxGroupSize: 10 },
    ],
  },
  {
    slug: "lake-chamo",
    name: "Lake Chamo",
    tagline: "Hippos, giant crocodiles and the famous crocodile market",
    description:
      "Stretching 32 km long and 13 km wide at the foot of the Guge Mountains, Lake Chamo is one of the Ethiopian Rift Valley's great wildlife lakes. Boats run out from Arba Minch to its western shore, where giant Nile crocodiles haul out to bask by the dozen on a single sandy beach — the famous 'crocodile market'. On the way you'll pass pods of hippos in the shallows and fish eagles, pelicans and storks along the Typha reed beds, all under the sweep of the escarpment.",
    location: "Lake Chamo shore, 12.5 km from Arba Minch",
    region: "Lake Chamo",
    distanceKm: "12.5 km",
    travelTime: "~20 minutes",
    vicinity: "In the city",
    visitInfo:
      "Available in the city|Free to go at any time before 10:00 LT for the great experience|Fresh fish available at a good price after 4:00 LT — morning is suggested for the best experience|Covered within a half day",
    duration: "Half to full day",
    durationHours: 6,
    basePrice: 2500,
    category: "Lake",
    highlights: "The 'crocodile market' — crocodiles basking by the dozen|Hippo pods in the shallows|Fish eagles, pelicans & storks along the reeds|Morning light on the Guge Mountains",
    thingsToDo: "Exploring the lake|Eating fresh fish|Photography|Learning about cooking fish and the site",
    whatsIncluded: "Transport (type based on preference)|Tour guide|Fish and drinks|Photography",
    whatsExcluded: "Lunch|Tip for the captain",
    requirements: "Life jackets are provided; follow the guide's instructions near wildlife.",
    meetingInfo: "9:00 AM pickup. The full tour returns by 5:00 PM.",
    latitude: 5.9577,
    longitude: 37.5223,
    mapQuery: "Lake Chamo, Ethiopia",
    featured: true,
    images: [{ url: img("lakechamo"), alt: "Lake Chamo", order: 0 }],
    packages: [
      { name: "Group Boat Safari", description: "Shared boat, scheduled departure.", price: 2500, duration: "Half day", maxGroupSize: 15 },
      { name: "Private Boat Safari", description: "Private boat — go at your pace.", price: 4000, duration: "Half day", minGroupSize: 2, maxGroupSize: 8, privateOnly: true },
      { name: "Full Day Combo", description: "Chamo safari + Crocodile Ranch visit.", price: 3800, duration: "Full day", maxGroupSize: 12 },
    ],
  },
{
    slug: "crocodile-ranch",
    name: "Crocodile Ranch",
    tagline: "2,600 Nile crocodiles in one visit",
    description:
      "The Arba Minch Crocodile Ranch has raised Nile crocodiles for more than three decades and today shelters around 2,600 animals — from hatchlings in nursery pens to several-metre giants sunning along the fence line. Founded for conservation and once an exporter of crocodile skin, the ranch relocated 7 km from the town after the 2007 floods destroyed its original lakeside home. Take the guided loop to see every age of crocodile, catch a feeding, and stay for lunch at the on-site restaurant.",
    location: "7 km from Arba Minch, on the road to the Gamo Highlands",
    region: "Lake Chamo",
    duration: "Half day",
    durationHours: 4,
    basePrice: 1500,
    category: "Wildlife",
    highlights: "Around 2,600 crocodiles — hatchling to giant|Famous daily feeding time|Three decades of crocodile conservation|Combine easily with Lake Chamo",
    thingsToDo: "Tour the nursery and adult pens|Photo session with the residents|Combine with a Chamo boat safari",
    whatsIncluded: "Transport|Entry fees|Guide",
    whatsExcluded: "Lunch",
    requirements: "Keep hands inside the vehicle; stay behind the marked lines.",
    meetingInfo: "Pickup 9:00 AM or 2:00 PM from your hotel.",
    latitude: 6.1105,
    longitude: 37.56,
    mapQuery: "Crocodile Ranch Arba Minch",
    featured: false,
    images: [
      { url: img("croc-ranch-1"), alt: "Wildlife near Arba Minch", order: 0 },
      { url: img("croc-ranch-2"), alt: "Savanna wildlife", order: 1 },
      { url: img("safari-1"), alt: "Safari landscape", order: 2 },
    ],
    packages: [
      { name: "Group Visit", description: "Standard shared visit.", price: 1500, duration: "Half day", maxGroupSize: 15 },
      { name: "Private Visit", description: "Private car & guide.", price: 2800, duration: "Half day", privateOnly: true },
    ],
  },
  {
    slug: "crocodile-market",
    name: "Crocodile Market",
    tagline: "Dozens of giant crocodiles on one shore",
    description:
      "It isn't a market — it's a stretch of sandy shore on the western side of Lake Chamo where giant Nile crocodiles haul out to bask in the morning sun, thirty or forty at a time on a single beach. Boats from Arba Minch slip in offshore to watch safely, with hippos surfacing and fish eagles hunting along the way. It's the reason the lake appears on every itinerary through the region — best in the morning, when the crocodiles bake in the sun before the wind picks up.",
    location: "Lake Chamo shoreline, south of Arba Minch",
    region: "Lake Chamo",
    duration: "Half day",
    durationHours: 3,
    basePrice: 1800,
    category: "Wildlife",
    highlights: "30–40 giant crocodiles on a single beach|Hippo pods and fish eagles on the way|2–3 hour open-boat safari from Arba Minch|Crocodiles bask most in the morning sun",
    thingsToDo: "Boat approach for photography|Watch hippos and crocs up close|Listen to the guides' river stories",
    whatsIncluded: "Transport|Boat & skipper|Guide|Safety jackets",
    whatsExcluded: "Lunch",
    requirements: "Keep quiet near the wildlife; the boat stays at a safe distance.",
    meetingInfo: "Departs 8:30 AM to catch the morning sun.",
    latitude: 6.02,
    longitude: 37.55,
    mapQuery: "Lake Chamo crocodile market",
    featured: false,
    images: [
      { url: img("croc-market-1"), alt: "Crocodile Market shoreline", order: 0 },
      { url: img("lake-chamo-1"), alt: "Approaching by boat", order: 1 },
      { url: img("safari-1"), alt: "Wildlife safari", order: 2 },
    ],
    packages: [
      { name: "Group Watch", description: "Shared boat.", price: 1800, duration: "Half day", maxGroupSize: 15 },
      { name: "Private Watch", description: "Private boat for photographers.", price: 3000, duration: "Half day", privateOnly: true },
    ],
  },
  {
    slug: "dorze-village",
    name: "Dorze Village",
    tagline: "Beehive bamboo houses and master weavers of the highlands",
    description:
      "High above the Rift, the Dorze — one of the Gamo peoples — weave towering, beehive-shaped houses from bamboo and enset leaves, homes so strong they can stand for up to 80 years. The same hands are famous as master weavers of colourful cotton shama cloth. Visit the village to watch looms in action, taste kocho and enset bread with traditional drinks, and hear the polyphonic singing the Dorze are known for across the region.",
    location: "Gamo Highlands, 23.7 km from Arba Minch",
    region: "Gamo Highlands",
    distanceKm: "23.7 km",
    travelTime: "~43 minutes by car",
    vicinity: "Outside the city",
    duration: "Full day",
    durationHours: 8,
    basePrice: 1400,
    category: "Cultural",
    highlights: "Beehive bamboo houses that can last 80 years|Traditional cotton shama weaving|Kocho, enset bread & traditional drinks|Polyphonic singing and a warm welcome",
    thingsToDo:
      "Traditional drinks|Traditional clothes|Traditional ceremony (welcome and dance)|Tour guide|Resting place|Full village experience",
    whatsIncluded: "Transport|Village guide & fees|Weaving demonstration|Coffee or tea",
    whatsExcluded: "Lunch (village lunch is an add-on)",
    requirements: "Dress for highland weather; walking shoes recommended.",
    meetingInfo: "Pickup from Arba Minch 9:00 AM; back by 5:00 PM.",
    latitude: 6.2166,
    longitude: 37.5,
    mapQuery: "Dorze village, Ethiopia",
    featured: true,
    images: [{ url: img("dorzevillage"), alt: "Dorze Village", order: 0 }],
    packages: [
      { name: "Group Cultural Day", description: "Village tour + weaving demo.", price: 1400, duration: "Full day", maxGroupSize: 16 },
      { name: "Private Cultural Day", description: "Private guide at your pace.", price: 2500, duration: "Full day", privateOnly: true },
      { name: "Village Stay Experience", description: "Overnight in a Dorze house with meals.", price: 5500, duration: "Overnight", minGroupSize: 2, maxGroupSize: 8 },
    ],
  },
  {
    slug: "dorsso-waterfall",
    name: "Dorsso Waterfall",
    tagline: "A 2,900 m cascade in the Chencha highlands",
    description:
      "In Chencha district, the Gamo Highlands reach almost 2,900 m — and at their edge, Dorsso Waterfall drops through forest laced with bamboo and wicker plants. In the rainy season a huge volume of water thunders over the cliff; in the dry months the stream softens but never disappears. A quiet trail leads to the falls for close views of the spray and the greenery that makes this cataract the district's pride. Usually combined with the Dorze villages on the way back down.",
    location: "Chencha district, ~40 km from Arba Minch",
    region: "Dorze Escarpment",
    duration: "Half day",
    durationHours: 5,
    basePrice: 900,
    category: "Adventure",
    highlights: "Trail through bamboo-laced highland forest|Thundering falls in the rainy season|Almost 2,900 m in Chencha district|Combine easily with Dorze Village",
    thingsToDo: "Trek through banana and enset farmland|Swim or rinse in the cool spray|Picnic under the trees",
    whatsIncluded: "Transport|Local trek guide|Community contribution",
    whatsExcluded: "Lunch",
    requirements: "Hiking or sports shoes; the trail can be muddy after rain.",
    meetingInfo: "Pickup 9:00 AM. Combo with Dorze Village leaves earlier.",
    latitude: 6.1666,
    longitude: 37.4666,
    mapQuery: "Dorsso waterfall Ethiopia",
    featured: false,
    images: [
      { url: img("waterfall-1"), alt: "Waterfall in green forest", order: 0 },
      { url: img("waterfall-2"), alt: "Forest canopy along the trail", order: 1 },
      { url: img("dorze-2"), alt: "Highland forest", order: 2 },
    ],
    packages: [
      { name: "Group Trek", description: "Shared departures most mornings.", price: 900, duration: "Half day", maxGroupSize: 14 },
      { name: "Private Trek", description: "Private guide, flexible start.", price: 2000, duration: "Half day", privateOnly: true },
    ],
  },
];