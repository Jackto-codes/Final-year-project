"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) {
    return null;
  }

  return (
    <footer className="w-full bg-[#0f172a] text-white py-12 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
        <div>
          <h3 className="text-2xl font-black text-white">
            MTU <span className="text-white">Med</span>
          </h3>
          <p className="text-gray-400 mt-2 font-medium">Campus Medical Mobility System.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/" className="text-gray-400 hover:text-white font-semibold transition-colors">Home</Link>
          <Link href="/emergency" className="text-gray-400 hover:text-white font-semibold transition-colors">Emergency</Link>
          <Link href="#" className="text-gray-400 hover:text-white font-semibold transition-colors">Privacy Policy</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm font-medium">
        &copy; {new Date().getFullYear()} Mountain Top University. All rights reserved.
      </div>
    </footer>
  );
}
