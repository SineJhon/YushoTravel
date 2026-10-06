import { Hero } from "@/components/home/hero";
import { FeaturedDestinations } from "@/components/home/featured-destinations";
import { WhyYusho } from "@/components/home/why-yusho";
import { StudentWelcome } from "@/components/home/student-welcome";
import { FeaturedExperiences } from "@/components/home/featured-experiences";
import { HomeEvents } from "@/components/home/home-events";
import { Testimonials } from "@/components/home/testimonials";
import { FinalCta } from "@/components/home/final-cta";
import { JsonLd } from "@/components/ui/jsonld";
import { getFeaturedDestinations, getFeaturedReviews } from "@/lib/data";
import { APP_NAME, CONTACT_CITY, SITE_URL } from "@/lib/constants";

export const revalidate = 300; // 5 minutes — fresh destinations without sacrificing speed

export default async function HomePage() {
  const [destinations, reviews] = await Promise.all([
    getFeaturedDestinations(3),
    getFeaturedReviews(6),
  ]);

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: APP_NAME,
    url: SITE_URL,
    description:
      "Travel, tour, events and student-experience company based in Arba Minch, Ethiopia.",
    areaServed: { "@type": "City", name: CONTACT_CITY },
    priceRange: "ETB 0 – 25,000",
  };

  return (
    <>
      <JsonLd data={organizationLd} />
      <Hero />
      <FeaturedDestinations destinations={destinations} />
      <WhyYusho />
      <StudentWelcome />
      <FeaturedExperiences />
      <HomeEvents />
      <Testimonials reviews={reviews} />
      <FinalCta />
    </>
  );
}