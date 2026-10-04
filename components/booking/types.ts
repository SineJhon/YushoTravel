export type BookingPackage = {
  id: string;
  name: string;
  price: number;
  duration: string | null;
  privateOnly: boolean;
  maxGroupSize: number | null;
};

export type BookingDestination = {
  id: string;
  slug: string;
  name: string;
  location: string;
  category: string;
  cover: string | null;
  minPrice: number;
  packages: BookingPackage[];
};

export type BookingMode = "GROUP" | "PRIVATE" | "FAMILY";

export const STEPS = ["Experience", "Details", "Review", "Confirmation"] as const;