"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-md border-b border-gray-200/50 shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LEFT: Logo + Brand */}
        <a href="/" className="flex items-center gap-2 md:gap-3 cursor-pointer no-underline">
          <Image src="/mtu.jpg" alt="MTU Logo" width={32} height={32} className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
          <span className="text-base md:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            <span className="hidden sm:inline">MTU Campus Medical Mobility</span>
            <span className="sm:hidden">MTU Medical</span>
          </span>
        </a>
        {/* CENTER: Nav Links */}
        {!isAdminPage && (
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-[15px] font-medium text-gray-500 hover:text-slate-900 transition-colors duration-200 no-underline">Home</Link>
            <Link href="/#how-it-works" className="text-[15px] font-medium text-gray-500 hover:text-slate-900 transition-colors duration-200 no-underline">About us</Link>
            <Link href="/booking" className="text-[15px] font-medium text-gray-500 hover:text-slate-900 transition-colors duration-200 no-underline">Book shuttle</Link>
          </div>
        )}
        {/* RIGHT: Auth Buttons */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/login" className="hidden sm:block text-[15px] font-medium text-slate-900 hover:text-slate-600 transition-colors">
            Login
          </Link>
          <Link href="/emergency" className="text-sm md:text-[15px] font-semibold text-white bg-black hover:bg-gray-800 px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-colors duration-200 text-center">
            {isAdminPage ? "Emergency" : "EMERGENCY"}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
