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
  images: { url: string; alt: string; order: number }[];
  packages: PackageSeed[];
};

export const destinationsData: DestinationSeed[] = [
  {
    slug: "forty-springs",
    name: "Forty Springs",
    tagline: "Forty blue pools rising from the Great Rift Valley",
    description:
      "Between Arba Minch and Lake Abaya, the earth gives way to forty natural springs — impossibly blue pools fed by groundwater from the Gamo highlands. Locals come at dawn to swim and pray; birdsong fills the surrounding forest. It's the classic Arba Minch escape and a perfect first stop on any southern tour.",
    location: "40 km north of Arba Minch, on the road to Lake Abaya",
    region: "Arba Minch",
    duration: "Full day",
    durationHours: 8,
    basePrice: 1200,
    category: "Nature",
    highlights:
      "Swim in natural spring pools|Birdwatching along the Abaya shore|Local coffee ceremony by the springs|Optional boat trip on Lake Abaya",
    thingsToDo:
      "Swim & cool off in the springs|Walk the nature trail around the pools|Spot fish eagles and weaver birds|Share injera and coffee with a local family",
    whatsIncluded: "Transport from Arba Minch|Licensed guide|Park & community fees|Drinking water",
    whatsExcluded: "Lunch (add to your booking)|Boat trip on Lake Abaya",
    requirements: "Comfortable shoes, swimwear, sun protection.",
    meetingInfo: "Pickup from your hotel or the Yusho office in Sikela at 8:30 AM.",
    latitude: 6.2957,
    longitude: 37.4378,
    mapQuery: "Shesher forty springs, Ethiopia",
    featured: true,
    images: [
      { url: img("forty-springs-1"), alt: "Forty Springs natural pool", order: 0 },
      { url: img("forty-springs-2"), alt: "Canoe on a spring-fed lake", order: 1 },
      { url: img("forty-springs-3"), alt: "River through the Rift Valley", order: 2 },
    ],
    packages: [
      { name: "Group Day Tour", description: "Join the daily shared departure.", price: 1200, duration: "Full day", maxGroupSize: 12 },
      { name: "Private Day Tour", description: "Your own car, guide and timing.", price: 2600, duration: "Full day", minGroupSize: 1, maxGroupSize: 6, privateOnly: true },
      { name: "Family Day", description: "Relaxed pace for families with kids.", price: 1600, duration: "Full day", maxGroupSize: 10 },
    ],
  },
  {
    slug: "lake-chamo",
    name: "Lake Chamo",
    tagline: "Hippos, crocodiles and the clearest water in the Rift",
    description:
      "Lake Chamo is the region's great blue theatre. Boats glide past pods of grumbling hippos and the shoreline 'crocodile market', where giant Nile crocodiles bask by the hundreds. Clear water and endless mountain views make it the most photogenic day trip from Arba Minch.",
    location: "15 km south of Arba Minch, Nechisar National Park",
    region: "Lake Chamo",
    duration: "Half to full day",
    durationHours: 6,
    basePrice: 2500,
    category: "Lake",
    highlights: "Boat safari among hippo pods|Views of the Guge mountains|Nechisar entrance|Sunset sail option",
    thingsToDo: "Boat safari on Chamo's clear water|Photograph hippos at close range|Picnic lunch by the lake|Birdwatching along the reeds",
    whatsIncluded: "Transport|Licensed boat & captain|Park & boat fees|Guide",
    whatsExcluded: "Lunch|Tip for the captain",
    requirements: "Life jackets are provided; follow the guide's instructions near wildlife.",
    meetingInfo: "9:00 AM pickup. The full tour returns by 5:00 PM.",
    latitude: 5.9577,
    longitude: 37.5223,
    mapQuery: "Lake Chamo, Ethiopia",
    featured: true,
    images: [
      { url: img("lake-chamo-1"), alt: "Boat on Lake Chamo", order: 0 },
      { url: img("lake-chamo-2"), alt: "Lake Chamo at sunset", order: 1 },
      { url: img("lake-chamo-3"), alt: "Sailing past the shoreline", order: 2 },
    ],
    packages: [
      { name: "Group Boat Safari", description: "Shared boat, scheduled departure.", price: 2500, duration: "Half day", maxGroupSize: 15 },
      { name: "Private Boat Safari", description: "Private boat — go at your pace.", price: 4000, duration: "Half day", minGroupSize: 2, maxGroupSize: 8, privateOnly: true },
      { name: "Full Day Combo", description: "Chamo safari + Crocodile Ranch visit.", price: 3800, duration: "Full day", maxGroupSize: 12 },
    ],
  },
{
    slug: "crocodile-ranch",
    name: "Crocodile Ranch",
    tagline: "Meet southern Ethiopia's most famous residents",
    description:
      "A working crocodile farm near the Chamo shore where Nile crocodiles are raised from eggs to adults. A fascinating, raw look at wildlife conservation and local enterprise — expect young crocs in nursery pens and mature giants sunning along the fences.",
    location: "Near Lake Chamo, 12 km south of Arba Minch",
    region: "Lake Chamo",
    duration: "Half day",
    durationHours: 4,
    basePrice: 1500,
    category: "Wildlife",
    highlights: "See crocodiles at every age|Learn how the farm operates|Combine easily with Lake Chamo",
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
    tagline: "Where Chamo's giant crocodiles gather by the hundreds",
    description:
      "Not a fish market — a spectacle. Along a stretch of Lake Chamo's shore, dozens of giant Nile crocodiles and hippos gather in the shallows, so many that locals call it the 'crocodile market'. Seen safely by boat, it is one of the most dramatic wildlife sights in Ethiopia.",
    location: "Lake Chamo shoreline, south of Arba Minch",
    region: "Lake Chamo",
    duration: "Half day",
    durationHours: 3,
    basePrice: 1800,
    category: "Wildlife",
    highlights: "Hundreds of crocodiles in one spot|Hippo pods in the same shallows|Reached by boat — no walking required",
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
    tagline: "Bamboo palaces and living tradition in the highlands",
    description:
      "Climb out of the Rift and you reach Dorze country — a village of towering elephant-shaped houses woven from bamboo and enset leaves. Dorze weavers, farmers and elders open their homes with real Ethiopian hospitality. Watch shama cloth being woven, taste fresh enset bread, and hear the village's morning songs.",
    location: "Gamo highlands, ~15 km from Arba Minch",
    region: "Gamo Highlands",
    duration: "Full day",
    durationHours: 8,
    basePrice: 1400,
    category: "Cultural",
    highlights: "Elephant-shaped bamboo houses|Dorze weaving demonstrations|Enset (false banana) cuisine|Rift Valley views",
    thingsToDo: "Walk the village with a local guide|Watch shama cloth weaving|Try enset bread and honey wine|Shop directly from village weavers",
    whatsIncluded: "Transport|Village guide & fees|Weaving demonstration|Coffee or tea",
    whatsExcluded: "Lunch (village lunch is an add-on)",
    requirements: "Dress for highland weather; walking shoes recommended.",
    meetingInfo: "Pickup from Arba Minch 9:00 AM; back by 5:00 PM.",
    latitude: 6.2166,
    longitude: 37.5,
    mapQuery: "Dorze village, Ethiopia",
    featured: true,
    images: [
      { url: img("dorze-1"), alt: "Dorze highland landscape", order: 0 },
      { url: img("dorze-2"), alt: "Highland forest around Dorze", order: 1 },
      { url: img("dorze-3"), alt: "Views from the escarpment", order: 2 },
    ],
    packages: [
      { name: "Group Cultural Day", description: "Village tour + weaving demo.", price: 1400, duration: "Full day", maxGroupSize: 16 },
      { name: "Private Cultural Day", description: "Private guide at your pace.", price: 2500, duration: "Full day", privateOnly: true },
      { name: "Village Stay Experience", description: "Overnight in a Dorze house with meals.", price: 5500, duration: "Overnight", minGroupSize: 2, maxGroupSize: 8 },
    ],
  },
  {
    slug: "dorsso-waterfall",
    name: "Dorsso Waterfall",
    tagline: "A hidden waterfall in the forest above Arba Minch",
    description:
      "Past the Dorze escarpment, a short forest trek leads to Dorsso Waterfall — cold spray, banana palms and birdsong at the bottom of a green canyon. Easy enough for families, the reward is pure southern Ethiopia: no queues, no crowds, just water falling through the highlands.",
    location: "Dorze escarpment, ~20 km from Arba Minch",
    region: "Dorze Escarpment",
    duration: "Half day",
    durationHours: 5,
    basePrice: 900,
    category: "Adventure",
    highlights: "Short forest trek (about 40 min one way)|Swim in the plunge pool (seasonal)|Combine easily with Dorze Village",
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