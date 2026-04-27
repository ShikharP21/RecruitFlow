"use client";

import LoginModal from "@/components/auth/LoginModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LoginModal />
    </>
  );
}