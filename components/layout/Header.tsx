"use client";

import { useAppStore } from "@/lib/store";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Menu, UserCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, isAuthenticated, openLoginModal, logout } = useAppStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Logo className="h-6 w-auto" />
        </div>

        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="flex flex-1 items-center justify-end space-x-2 mr-10">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <UserCircle className="h-4 w-4" />
                {user?.name || "User"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={openLoginModal}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}