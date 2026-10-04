import { daysFromNow, img } from "./helpers";

export type EventSeed = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  startTime: string;
  location: string;
  price: number;
  capacity: number;
  image: string;
  organizer: string;
  rules: string;
};

export const eventsData: EventSeed[] = [
  {
    slug: "dawn-cruise-lake-chamo",
    title: "Dawn Cruise on Lake Chamo",
    description:
      "Set out before the sun tops the Guge mountains. A quiet boat safari through sleeping hippo pods, then breakfast on the water with the whole lake just for us. The best light of the day, the best seat in southern Ethiopia.",
    category: "outdoor",
    date: daysFromNow(9, 6),
    startTime: "6:00 AM",
    location: "Lake Chamo jetty, Arba Minch",
    price: 1800,
    capacity: 24,
    image: img("lake-chamo-2"),
    organizer: "Yusho Travel",
    rules: "Life jackets required. Warm layers at dawn.",
  },
  {
    slug: "rooftop-sunset-social",
    title: "Rooftop Sunset Social",
    description:
      "Golden hour, cold drinks and good music above the rooftops of Arba Minch. A relaxed weekly social where travellers, students and locals mix — bring your stories.",
    category: "social",
    date: daysFromNow(7, 18),
    startTime: "6:30 PM",
    location: "Sky Garden Rooftop, Sikela",
    price: 300,
    capacity: 40,
    image: img("event-social-1"),
    organizer: "Yusho Travel",
    rules: "18+. Respectful, friendly crowd expected.",
  },
  {
    slug: "forty-springs-hike-picnic",
    title: "Forty Springs Hike & Picnic Day",
    description:
      "A full day away from screens: walk the springs, swim in the blue pools, and picnic on the shore of Lake Abaya. Small group, proper local lunch, zero stress.",
    category: "outdoor",
    date: daysFromNow(21, 8),
    startTime: "8:30 AM",
    location: "Meet at Yusho Travel office, Arba Minch",
    price: 700,
    capacity: 18,
    image: img("forty-springs-1"),
    organizer: "Yusho Travel",
    rules: "Swimwear recommended; bring a towel.",
  },
  {
    slug: "dorze-cultural-weekend",
    title: "Dorze Cultural Weekend",
    description:
      "A weekend inside Dorze culture — house-building, weaving, coffee ceremonies, communal meals and an optional homestay. Guests are hosted by village families with a local translator.",
    category: "cultural",
    date: daysFromNow(14, 9),
    startTime: "9:00 AM",
    location: "Dorze Village, Gamo Highlands",
    price: 2200,
    capacity: 30,
    image: img("dorze-1"),
    organizer: "Yusho Travel + Dorze Community",
    rules: "Dress respectfully; photography welcome with permission.",
  },
  {
    slug: "new-students-welcome-mixer",
    title: "New Students Welcome Mixer",
    description:
      "Arriving at Arba Minch University? Start your semester surrounded by friendly faces. Games, campus tips, city orientation, coffee and a safe place to ask every question you're worried about.",
    category: "student",
    date: daysFromNow(28, 15),
    startTime: "3:00 PM",
    location: "Yusho Travel office terrace, Arba Minch",
    price: 0,
    capacity: 100,
    image: img("event-students-1"),
    organizer: "Yusho Travel Student Desk",
    rules: "Free for new students. Bring any registration questions.",
  },
  {
    slug: "gamo-fusion-night-live",
    title: "Gamo Fusion Night — Live Concert",
    description:
      "A live lineup blending traditional Gamo rhythms with modern Ethiopian pop and afro-fusion. Food stalls, projections and a dance floor under the stars.",
    category: "concert",
    date: daysFromNow(35, 19),
    startTime: "7:00 PM",
    location: "Open-air stage, Arba Minch",
    price: 400,
    capacity: 150,
    image: img("event-concert-1"),
    organizer: "Yusho Travel & friends",
    rules: "All ages until 9 PM. 18+ after.",
  },
  {
    slug: "starry-night-campout",
    title: "Starry-night Campout at Dorsso",
    description:
      "Tents by the waterfall, a bonfire, and some of the darkest, starriest skies in Ethiopia. Dinner, breakfast, camp chairs and stories included.",
    category: "outdoor",
    date: daysFromNow(50, 14),
    startTime: "2:00 PM",
    location: "Dorsso Waterfall basecamp",
    price: 1200,
    capacity: 16,
    image: img("event-camping-1"),
    organizer: "Yusho Travel",
    rules: "Gear provided. Must be comfortable with basic camping.",
  },
  {
    slug: "chamo-run-community-walk",
    title: "Turturka Chamo — Community Walk & Run",
    description:
      "A 5K community walk/run along the Chamo shore with the city's running clubs. Healthy, inclusive and full of energy. Finishers get coffee and shiro at the beach finish line.",
    category: "outdoor",
    date: daysFromNow(-15, 7),
    startTime: "7:00 AM",
    location: "Chamo shore path, Arba Minch",
    price: 150,
    capacity: 60,
    image: img("friends-1"),
    organizer: "Arba Minch Runners + Yusho Travel",
    rules: "Open to all ages; kids run free.",
  },
  {
    slug: "may-days-lakeside-festival",
    title: "May Days Lakeside Festival",
    description:
      "Music, market stalls, games and dancing along the lake — a celebration of the end of the spring semester for Arba Minch University.",
    category: "social",
    date: daysFromNow(-40, 15),
    startTime: "3:00 PM",
    location: "Lakeside open field, Arba Minch",
    price: 250,
    capacity: 200,
    image: img("event-party-1"),
    organizer: "Student Union + Yusho Travel",
    rules: "Student ID discounts available.",
  },
];