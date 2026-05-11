"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import QRReceipt from "@/components/QRReceipt";

function ReceiptContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Guest";
  const date = searchParams.get("date") || new Date().toLocaleDateString();
  const batch = searchParams.get("batch") || "Batch 1";
  const seat = searchParams.get("seat") || "A1";

  return <QRReceipt name={name} date={date} batch={batch} seat={seat} />;
}

export default function ReceiptPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <Suspense fallback={<div>Loading receipt...</div>}>
        <ReceiptContent />
      </Suspense>
    </main>
  );
}