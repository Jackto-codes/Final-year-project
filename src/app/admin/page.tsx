"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSummaryCard from "@/components/AdminSummaryCard";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthorized(true);
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  if (!isAuthorized) {
    return null; // Return empty while redirecting
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-[#fafaf9]">
      <AdminSummaryCard />
    </main>
  );
}