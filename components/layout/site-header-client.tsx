"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutAction } from "@/lib/actions/auth";
import { SiteHeaderBar } from "./site-header-bar";
import { MobileDrawer } from "./mobile-drawer";

export type HeaderUser = { id: string; name: string; email: string; role: string; profileImage: string | null };

export function SiteHeaderClient({ user }: { user: HeaderUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  const transparent = pathname === "/" && !scrolled;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  async function handleSignOut() {
    const res = await logoutAction();
    if (res.ok) {
      toast.success("Signed out — see you on the next journey.");
      router.push("/");
      router.refresh();
    }
  }

  return (
    <>
      <SiteHeaderBar
        user={user}
        transparent={transparent}
        isActive={isActive}
        onSignOut={handleSignOut}
        onMenuOpen={() => setMenuOpen(true)}
        accountOpen={accountOpen}
        onAccountToggle={() => setAccountOpen((v) => !v)}
      />
      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isActive={isActive}
        onSignOut={handleSignOut}
        user={user}
      />
    </>
  );
}