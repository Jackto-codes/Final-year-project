"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'booking' | 'emergency'>('booking');

  return (
    <main className="bg-bg min-h-screen w-full flex flex-col items-center">
  
      {/* Hero Section - Reference Style */}
      <section className="relative w-full flex flex-col items-center justify-center pt-48 pb-28 overflow-hidden bg-[#fafaf9]">
        <div className="relative z-10 w-full flex flex-col items-center px-4">
          {/* Badge */}
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 font-medium text-sm border border-emerald-200/60 shadow-sm">
              <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Smart, Safe, Seamless
            </span>
          </div>
          {/* Headline */}
          <h1 className="font-black text-4xl sm:text-5xl md:text-7xl lg:text-[84px] text-center text-[#0f172a] mb-6 leading-[1.1] md:leading-[1.05] tracking-tight md:tracking-[-0.02em]">
            MTU Campus Medical<br className="hidden md:block" /> <span className="text-[#059669]">Mobility System</span>
          </h1>
          {/* Supporting text */}
          <p className="text-[#64748b] max-w-2xl mx-auto mb-8 md:mb-10 text-base md:text-lg lg:text-[22px] text-center leading-relaxed md:leading-[1.6]">
            An intelligent system that connects students to campus health services and emergency support. Seamlessly book clinic visits, reduce waiting time, and get help when you need it most.
          </p>
          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center w-full max-w-xs md:max-w-none mx-auto">
            <Link href="/booking" className="w-full md:w-auto">
              <button className="flex items-center justify-center px-8 py-3.5 rounded-full font-semibold bg-[#0f172a] text-white hover:bg-black transition-colors text-base md:text-[17px] w-full shadow-md">
                Book a Shuttle
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </Link>
            <Link href="/emergency" className="w-full md:w-auto">
              <button className="flex items-center justify-center px-8 py-3.5 rounded-full font-semibold border border-gray-200 text-[#0f172a] bg-white hover:bg-gray-50 transition-colors text-base md:text-[17px] w-full shadow-sm">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                Request Emergency
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section - Chesto Style Cards */}
      <section className="w-full py-16 md:py-24 flex flex-col items-center bg-white border-t border-gray-100 text-center px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f172a] mb-4 tracking-tight">Campus Healthcare Access is Getting Smarter</h2>
        <p className="text-[#64748b] text-base md:text-lg lg:text-xl font-medium mb-12 md:mb-16 max-w-3xl mx-auto px-2">
          Our system uses intelligent scheduling and real-time emergency response to make campus medical mobility seamless, safe, and efficient for every student.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl w-full mx-auto">
          {/* Card 1 */}
          <div className="bg-white rounded-[24px] p-8 text-left border border-gray-200/70 shadow-sm flex flex-col items-start transition-shadow hover:shadow-md">
            <div className="w-11 h-11 rounded-xl border border-gray-200/80 flex items-center justify-center mb-6 bg-[#fbfdfc]">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="3" stroke="currentColor" strokeWidth="2"/><circle cx="7.5" cy="17" r="1.5" fill="currentColor"/><circle cx="16.5" cy="17" r="1.5" fill="currentColor"/></svg>
            </div>
            <div className="font-bold text-[17px] text-[#0f172a] mb-2 tracking-tight">Predictive Shuttle Scheduling</div>
            <div className="text-gray-500 text-[15px] leading-relaxed">Book clinic visits with ease using a structured shuttle system that fits your schedule.</div>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-[24px] p-8 text-left border border-gray-200/70 shadow-sm flex flex-col items-start transition-shadow hover:shadow-md">
            <div className="w-11 h-11 rounded-xl border border-gray-200/80 flex items-center justify-center mb-6 bg-[#fbfdfc]">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M4 12h16" stroke="currentColor" strokeWidth="2"/><path d="M12 4v16" stroke="currentColor" strokeWidth="2"/></svg>
            </div>
            <div className="font-bold text-[17px] text-[#0f172a] mb-2 tracking-tight">Intelligent Seat Allocation</div>
            <div className="text-gray-500 text-[15px] leading-relaxed">The system fills canceled seats and maximizes shuttle usage, reducing waiting time.</div>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-[24px] p-8 text-left border border-gray-200/70 shadow-sm flex flex-col items-start transition-shadow hover:shadow-md">
            <div className="w-11 h-11 rounded-xl border border-gray-200/80 flex items-center justify-center mb-6 bg-[#fbfdfc]">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0l-1.41-1.41M6.34 6.34L4.93 4.93" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/></svg>
            </div>
            <div className="font-bold text-[17px] text-[#0f172a] mb-2 tracking-tight">Emergency Dispatch System</div>
            <div className="text-gray-500 text-[15px] leading-relaxed">Request urgent medical help instantly—alerts go straight to the campus clinic.</div>
          </div>
          {/* Card 4 */}
          <div className="bg-white rounded-[24px] p-8 text-left border border-gray-200/70 shadow-sm flex flex-col items-start transition-shadow hover:shadow-md">
            <div className="w-11 h-11 rounded-xl border border-gray-200/80 flex items-center justify-center mb-6 bg-[#fbfdfc]">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2"/></svg>
            </div>
            <div className="font-bold text-[17px] text-[#0f172a] mb-2 tracking-tight">Real-Time Notifications</div>
            <div className="text-gray-500 text-[15px] leading-relaxed">Stay updated on your booking status, shuttle schedules, and emergency responses.</div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Interactive Pill Style */}
      <section id="how-it-works" className="w-full py-16 md:py-24 flex flex-col items-center bg-[#fafaf9] text-center px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f172a] mb-4 tracking-tight">How the System Works in 3 Steps</h2>
        <p className="text-[#64748b] text-base md:text-lg lg:text-xl font-medium mb-8 md:mb-10 max-w-3xl mx-auto px-2">
          {activeTab === 'booking' ? "Book a shuttle, get real-time seat allocation, and arrive on time." : "Request help, get instant alerts routed, and receive priority dispatch."}
        </p>

        {/* Toggle Pill */}
        <div className="bg-gray-200/80 p-1.5 rounded-full flex sm:inline-flex items-center justify-between w-full sm:w-auto max-w-md mx-auto mb-12 md:mb-16 shadow-inner overflow-hidden">
          <button 
            onClick={() => setActiveTab('booking')}
            className={`px-3 sm:px-6 py-2.5 text-sm sm:text-[15px] font-bold rounded-full transition-all duration-300 ease-out border flex-1 sm:flex-none text-center justify-center ${activeTab === 'booking' ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-[0_0_15px_rgba(15,23,42,0.5)] ring-2 ring-[#0f172a]/20 ring-offset-1 ring-offset-[#fafaf9]' : 'border-transparent text-gray-500 hover:text-[#0f172a] hover:bg-white hover:border-gray-300 hover:shadow-[0_0_20px_rgba(15,23,42,0.2)] hover:ring-2 hover:ring-gray-300/50'}`}
          >
            Book Appointment
          </button>
          <button 
            onClick={() => setActiveTab('emergency')}
            className={`px-3 sm:px-6 py-2.5 text-sm sm:text-[15px] font-bold rounded-full transition-all duration-300 ease-out border flex-1 sm:flex-none text-center justify-center ${activeTab === 'emergency' ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-[0_0_15px_rgba(15,23,42,0.5)] ring-2 ring-[#0f172a]/20 ring-offset-1 ring-offset-[#fafaf9]' : 'border-transparent text-gray-500 hover:text-[#0f172a] hover:bg-white hover:border-gray-300 hover:shadow-[0_0_20px_rgba(15,23,42,0.2)] hover:ring-2 hover:ring-gray-300/50'}`}
          >
            Emergency
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-6xl w-full mx-auto min-h-[220px]">
          {activeTab === 'booking' ? (
            <>
              {/* Booking Step 1 */}
              <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 rounded-full bg-[#0f172a] flex items-center justify-center mb-6 shadow-md transition-transform hover:scale-105">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 10l5-5 5 5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="7" width="18" height="13" rx="2"/></svg>
                </div>
                <div className="font-bold text-[19px] text-[#0f172a] mb-3 tracking-tight">Book a Shuttle</div>
                <div className="text-gray-500 text-[15px] leading-relaxed max-w-xs mx-auto">Select your preferred shuttle batch and reserve a seat instantly for your clinic visit.</div>
              </div>
              {/* Booking Step 2 */}
              <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <div className="w-16 h-16 rounded-full bg-[#0f172a] flex items-center justify-center mb-6 shadow-md transition-transform hover:scale-105">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
                </div>
                <div className="font-bold text-[19px] text-[#0f172a] mb-3 tracking-tight">Real-Time Seat Allocation</div>
                <div className="text-gray-500 text-[15px] leading-relaxed max-w-xs mx-auto">The system automatically assigns you a seat and fills any cancellations, ensuring efficient shuttle use.</div>
              </div>
              {/* Booking Step 3 */}
              <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <div className="w-16 h-16 rounded-full bg-[#0f172a] flex items-center justify-center mb-6 shadow-md transition-transform hover:scale-105">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0l-1.41-1.41M6.34 6.34L4.93 4.93" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div className="font-bold text-[19px] text-[#0f172a] mb-3 tracking-tight">Arrive & Board</div>
                <div className="text-gray-500 text-[15px] leading-relaxed max-w-xs mx-auto">Track your shuttle and arrive at the designated pickup point on time.</div>
              </div>
            </>
          ) : (
            <>
              {/* Emergency Step 1 */}
              <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 rounded-full bg-[#0f172a] flex items-center justify-center mb-6 shadow-md transition-transform hover:scale-105">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div className="font-bold text-[19px] text-[#0f172a] mb-3 tracking-tight">Request Emergency</div>
                <div className="text-gray-500 text-[15px] leading-relaxed max-w-xs mx-auto">Use the emergency button to immediately signal that you need urgent medical assistance.</div>
              </div>
              {/* Emergency Step 2 */}
              <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <div className="w-16 h-16 rounded-full bg-[#0f172a] flex items-center justify-center mb-6 shadow-md transition-transform hover:scale-105">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div className="font-bold text-[19px] text-[#0f172a] mb-3 tracking-tight">Instant Alert Routing</div>
                <div className="text-gray-500 text-[15px] leading-relaxed max-w-xs mx-auto">Alerts are sent instantly to the campus clinic with your details for rapid response.</div>
              </div>
              {/* Emergency Step 3 */}
              <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <div className="w-16 h-16 rounded-full bg-[#0f172a] flex items-center justify-center mb-6 shadow-md transition-transform hover:scale-105">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0l-1.41-1.41M6.34 6.34L4.93 4.93" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div className="font-bold text-[19px] text-[#0f172a] mb-3 tracking-tight">Priority Dispatch</div>
                <div className="text-gray-500 text-[15px] leading-relaxed max-w-xs mx-auto">Critical cases receive priority attention and rapid medical dispatch to your location.</div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Premium Bento Grid - Core Features */}
      <section className="w-full py-16 md:py-32 flex flex-col items-center bg-white text-center px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f172a] mb-6 tracking-tight">Built for Maximum Efficiency</h2>
        <p className="text-[#64748b] text-base md:text-lg lg:text-xl font-medium mb-12 md:mb-20 max-w-2xl mx-auto px-2">
          A multi-layered, intelligent approach to campus medical mobility and emergency support, designed to prioritize student safety and convenience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full mx-auto">
          
          {/* Card 1: Wide (Col Span 2) - Predictive Scheduling */}
          <div className="md:col-span-2 bg-[#fafaf9] rounded-[32px] p-10 md:p-12 text-left border border-gray-200/60 relative overflow-hidden group hover:border-green-200 hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-80 h-80 bg-green-100/50 rounded-full blur-3xl group-hover:bg-green-200/50 transition-colors duration-500 pointer-events-none"></div>
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-8 relative z-10 shadow-sm">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="3"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>
            </div>
            <div className="font-bold text-2xl md:text-3xl text-[#0f172a] mb-4 tracking-tight relative z-10">Predictive Shuttle Scheduling</div>
            <div className="text-gray-500 text-lg leading-relaxed max-w-md relative z-10">Plan your clinic visits with ease. The system operates four daily batches, each with limited seating to ensure organized transport and zero overcrowding.</div>
          </div>

          {/* Card 2: Square - Intelligent Seat Allocation */}
          <div className="bg-[#fafaf9] rounded-[32px] p-10 md:p-12 text-left border border-gray-200/60 relative overflow-hidden group hover:border-green-200 hover:shadow-md transition-all duration-300">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-green-100/50 rounded-full blur-3xl group-hover:bg-green-200/50 transition-colors duration-500 pointer-events-none"></div>
             <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-8 relative z-10 shadow-sm">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
            </div>
            <div className="font-bold text-2xl text-[#0f172a] mb-4 tracking-tight relative z-10">Smart Allocation</div>
            <div className="text-gray-500 text-lg leading-relaxed relative z-10">Automatically manages bookings and fills canceled seats to reduce waiting times.</div>
          </div>

          {/* Card 3: Square - Real-Time Alerts */}
          <div className="bg-[#fafaf9] rounded-[32px] p-10 md:p-12 text-left border border-gray-200/60 relative overflow-hidden group hover:border-green-200 hover:shadow-md transition-all duration-300">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-green-100/50 rounded-full blur-3xl group-hover:bg-green-200/50 transition-colors duration-500 pointer-events-none"></div>
             <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-8 relative z-10 shadow-sm">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            </div>
            <div className="font-bold text-2xl text-[#0f172a] mb-4 tracking-tight relative z-10">Real-Time Alerts</div>
            <div className="text-gray-500 text-lg leading-relaxed relative z-10">Stay informed with instant push updates on booking statuses and dispatch ETAs.</div>
          </div>

          {/* Card 4: Wide (Col Span 2) - Built-In Safety & Privacy */}
          <div className="md:col-span-2 bg-[#fafaf9] rounded-[32px] p-10 md:p-12 text-left border border-gray-200/60 relative overflow-hidden group hover:border-green-200 hover:shadow-md transition-all duration-300">
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-100/50 rounded-full blur-3xl group-hover:bg-green-200/50 transition-colors duration-500 pointer-events-none"></div>
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-8 relative z-10 shadow-sm">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l7 5v6c0 5.25-3.5 10-7 10s-7-4.75-7-10V7l7-5z"/><path d="M9 12l2 2 4-4"/></svg>
            </div>
            <div className="font-bold text-2xl md:text-3xl text-[#0f172a] mb-4 tracking-tight relative z-10">Built-In Safety & Privacy</div>
            <div className="text-gray-500 text-lg leading-relaxed max-w-md relative z-10">All data is handled securely. Your emergency alerts are privacy-compliant by design, ensuring your medical requests are kept strictly confidential.</div>
          </div>

        </div>
      </section>

      {/* Premium Emergency CTA */}
      <section className="w-full bg-white py-10 px-4">
        <div className="max-w-7xl mx-auto rounded-[40px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border border-blue-100 flex flex-col items-center justify-center py-24 px-6 text-center relative overflow-hidden shadow-[0_8px_30px_rgba(37,99,235,0.06)] group">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none group-hover:bg-blue-200/50 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm relative z-10 border border-gray-200">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0f172a] mb-6 tracking-tight relative z-10">Emergency Support</h2>
          <p className="text-gray-500 text-base md:text-lg lg:text-xl mb-10 md:mb-12 max-w-2xl mx-auto font-medium relative z-10">
            In urgent situations, every second counts. Send immediate alerts to the campus clinic for rapid response and priority medical dispatch.
          </p>
          <a href="/emergency" className="relative z-10 w-full sm:w-auto">
            <button className="bg-green-600 text-white font-bold text-base sm:text-lg md:text-xl px-6 sm:px-10 py-4 sm:py-5 rounded-full shadow-[0_10px_30px_rgba(22,163,74,0.3)] hover:shadow-[0_15px_40px_rgba(22,163,74,0.4)] hover:bg-green-700 hover:scale-105 transition-all duration-300 w-full sm:w-auto">
  Request Emergency Assistance
</button>
          </a>
        </div>
      </section>

      {/* FAQ Section - Edge-to-Edge Background, Centered Content */}
      <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-[#0f172a] text-white">
        <div className="w-full max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="uppercase text-gray-400 font-bold tracking-widest text-sm">FAQs</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2 mb-6 leading-tight">Questions we think you might like answers to</h2>
            <div className="flex flex-wrap gap-4 mb-10">
              <button className="px-6 py-2 rounded-xl bg-white text-[#0f172a] font-semibold">General</button>
              <button className="px-6 py-2 rounded-xl bg-[#1e293b] text-gray-300 font-semibold">Support</button>
              <button className="px-6 py-2 rounded-xl bg-[#1e293b] text-gray-300 font-semibold">Account</button>
            </div>
          </div>
          <div className="flex flex-col gap-6 w-full">
            <div className="bg-white rounded-2xl p-6 md:p-8 w-full">
              <div className="text-lg md:text-xl font-bold mb-2 text-[#0f172a]">Is the shuttle booking system really instant?</div>
              <div className="text-gray-600 text-base md:text-lg">Yes! Once you select a batch and reserve a seat, your booking is confirmed in real time. The system automatically updates seat availability and sends you a notification.</div>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 w-full">
              <div className="text-lg md:text-xl font-bold mb-2 text-[#0f172a]">How does the emergency dispatch feature work?</div>
              <div className="text-gray-600 text-base md:text-lg">If you need urgent medical help, just tap the emergency button. The system instantly alerts campus health staff with your location and details for rapid response.</div>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 w-full">
              <div className="text-lg md:text-xl font-bold mb-2 text-[#0f172a]">Is my data safe and private?</div>
              <div className="text-gray-600 text-base md:text-lg">Absolutely. All bookings and emergency requests are encrypted and only accessible to authorized campus health staff. We never share your data with third parties.</div>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 w-full">
              <div className="text-lg md:text-xl font-bold mb-2 text-[#0f172a]">Can I cancel or change my shuttle booking?</div>
              <div className="text-gray-600 text-base md:text-lg">Yes, you can cancel or modify your booking up to 10 minutes before departure. The system will automatically reassign your seat to another student if you cancel.</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
