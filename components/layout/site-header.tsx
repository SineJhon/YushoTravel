import { getCurrentUser } from "@/lib/auth";
import { SiteHeaderClient } from "./site-header-client";

export async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <SiteHeaderClient
      user={
        user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              profileImage: user.profileImage,
            }
          : null
      }
    />
  );
}