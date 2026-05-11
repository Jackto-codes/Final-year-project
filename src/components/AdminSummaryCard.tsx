"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

const BATCH_TIMES: Record<number, string> = {
  1: "7:30 AM",
  2: "10:00 AM",
  3: "1:00 PM",
  4: "4:00 PM",
  5: "7:00 PM",
};

const playEmergencyAlarm = () => {
  if (typeof window === 'undefined') return;
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Play 3 loud alert beeps
  for (let i = 0; i < 3; i++) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.value = 800; // High pitch alert sound
    
    const startTime = audioCtx.currentTime + (i * 0.4);
    gainNode.gain.setValueAtTime(0.5, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.2);
  }
};

export default function AdminSummaryCard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'emergencies'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [newEmergencyAlert, setNewEmergencyAlert] = useState<any>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase.from('bookings').select('*, trips(date)').order('created_at', { ascending: false });
      if (data) setBookings(data);
    };

    const fetchEmergencies = async () => {
      const { data } = await supabase.from('emergencies').select('*').order('created_at', { ascending: false });
      if (data) setEmergencies(data);
    };

    fetchBookings();
    fetchEmergencies();

    // Setup real-time subscriptions
    const bookingsSub = supabase.channel('bookings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, payload => {
        fetchBookings();
      })
      .subscribe();

    const emergenciesSub = supabase.channel('emergencies_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emergencies' }, payload => {
        fetchEmergencies();

        if (payload.eventType === 'INSERT') {
          const newEmergency = payload.new;
          
          // Switch tab to emergencies
          setActiveTab('emergencies');
          
          // Trigger in-app popup
          setNewEmergencyAlert(newEmergency);
          
          // Play loud alarm
          playEmergencyAlarm();
          
          // Native system notification (so driver sees it in background)
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification("🚨 NEW EMERGENCY ALERT!", {
              body: `Medical request from: ${newEmergency.user_name || 'Anonymous'}. Immediate dispatch required!`,
              icon: '/mtu.jpg',
              requireInteraction: true // Stays on screen until driver dismisses it
            });
          }
        }
      })
      .subscribe();

    // Ask for system notification permissions
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      supabase.removeChannel(bookingsSub);
      supabase.removeChannel(emergenciesSub);
    };
  }, []);

  const now = new Date();
  now.setHours(0,0,0,0);

  const currentBookings: any[] = [];
  const pastBookingsByWeek: Record<string, any[]> = {};

  bookings.forEach(b => {
    const tripDateStr = b.trips?.date;
    const tripDate = tripDateStr ? new Date(tripDateStr) : new Date(b.created_at);
    tripDate.setHours(0,0,0,0);

    if (tripDate >= now) {
      currentBookings.push(b);
    } else {
      const d = new Date(tripDate);
      const day = d.getDay() || 7;
      d.setDate(d.getDate() - day + 1);
      const weekStr = `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      if (!pastBookingsByWeek[weekStr]) pastBookingsByWeek[weekStr] = [];
      pastBookingsByWeek[weekStr].push(b);
    }
  });

  currentBookings.sort((a, b) => {
    const dateA = new Date(a.trips?.date || a.created_at).getTime();
    const dateB = new Date(b.trips?.date || b.created_at).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.batch_number - b.batch_number;
  });

  const renderBookingsTable = (list: any[]) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">User Name</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Time Booked</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Trip Date</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Batch Details</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Seat</th>
          </tr>
        </thead>
        <tbody>
          {list.map(b => (
            <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors group">
              <td className="py-5 px-4 font-bold text-[#0f172a] text-[17px]">{b.user_name}</td>
              <td className="py-5 px-4 text-gray-500 font-semibold">{new Date(b.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
              <td className="py-5 px-4 text-gray-500 font-medium">{b.trips?.date ? new Date(b.trips.date).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'}) : new Date(b.created_at).toLocaleDateString()}</td>
              <td className="py-5 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-[#0f172a]">Batch {b.batch_number}</span>
                  <span className="text-sm text-gray-400 font-medium mt-0.5">{BATCH_TIMES[b.batch_number] || ''}</span>
                </div>
              </td>
              <td className="py-5 px-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#fafaf9] text-[#0f172a] font-black border border-gray-200 shadow-sm group-hover:bg-[#0f172a] group-hover:text-white transition-colors">{b.seat_number}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center">
      {/* Admin Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/mtu.jpg" alt="MTU Logo" width={32} height={32} className="w-8 h-8 rounded-full" />
          <span className="text-lg font-bold text-slate-900 tracking-tight">Admin Portal</span>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`text-[15px] font-bold px-4 py-2 rounded-full transition-all duration-300 ${activeTab === 'bookings' ? 'bg-[#0f172a] text-white shadow-md' : 'text-gray-500 hover:text-slate-900 hover:bg-gray-100'}`}
          >
            Bookings
          </button>
          
          <button 
            onClick={() => setActiveTab('emergencies')}
            className={`flex items-center gap-2 text-[15px] font-bold px-4 py-2 rounded-full transition-all duration-300 ${activeTab === 'emergencies' ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
          >
            Emergencies
            <div className="relative flex items-center justify-center">
              <svg className={`w-5 h-5 ${activeTab === 'emergencies' ? 'text-red-600' : 'text-red-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {emergencies.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm">
                  {emergencies.length}
                </span>
              )}
            </div>
          </button>
        </div>

        <div>
          <button 
            onClick={() => {
              sessionStorage.removeItem("adminAuth");
              window.location.href = "/admin/login";
            }}
            className="text-[14px] font-semibold text-gray-500 hover:text-slate-900 transition-colors border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content Dashboard */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-32 pb-24 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium text-sm border border-blue-200/60 shadow-sm mb-6">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            System Overview
          </span>
          <h1 className="font-black text-4xl md:text-5xl text-[#0f172a] mb-4 tracking-tight">
            {activeTab === 'bookings' ? 'Shuttle Reservations' : 'Emergency Alerts'}
          </h1>
          <p className="text-[#64748b] text-lg max-w-2xl mx-auto font-medium">
            {activeTab === 'bookings' 
              ? 'Monitor recent student shuttle bookings, batch assignments, and departure schedules in real-time.' 
              : 'Critical medical requests from students. Respond immediately and deploy rapid assistance.'}
          </p>
        </div>

        {/* Content Area */}
        <div className="w-full bg-white rounded-[32px] border border-gray-200/70 shadow-sm overflow-hidden transition-all duration-500">
          {activeTab === 'bookings' ? (
            <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">Active Bookings (Today & Upcoming)</h2>
                <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold border border-green-200 shadow-sm">{currentBookings.length} Total</span>
              </div>
              
              {currentBookings.length > 0 ? renderBookingsTable(currentBookings) : (
                <div className="text-center py-10 text-gray-400 font-medium mb-10 border-2 border-dashed border-gray-200 rounded-2xl">No upcoming active bookings at the moment.</div>
              )}

              {Object.keys(pastBookingsByWeek).length > 0 && (
                <div className="mt-16">
                  <h2 className="text-xl font-bold text-gray-400 tracking-tight uppercase mb-6 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                    Archive: Former Batches
                  </h2>
                  
                  {Object.keys(pastBookingsByWeek).map(week => (
                    <div key={week} className="mb-8">
                      <div className="flex items-center justify-between mb-4 bg-gray-50 px-5 py-3.5 rounded-[16px] border border-gray-200">
                        <h3 className="text-[15px] font-bold text-gray-700">{week}</h3>
                        <span className="text-xs font-bold text-gray-400">{pastBookingsByWeek[week].length} Bookings</span>
                      </div>
                      {renderBookingsTable(pastBookingsByWeek[week])}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">Active Emergencies</h2>
                <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-bold border border-red-200 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  {emergencies.length} Alerts
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">User & Location</th>
                      <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
                      <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Severity</th>
                      <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emergencies.map(e => (
                      <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                        <td className="py-5 px-4 font-bold text-[#0f172a] text-[17px]">{e.user_name || 'Anonymous'}</td>
                        <td className="py-5 px-4">
                          <div className="flex flex-col">
                            <span className="text-gray-700 font-bold">{new Date(e.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span className="text-sm text-gray-400 font-medium mt-0.5">{new Date(e.created_at).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-5 px-4">
                          <span className={`inline-flex px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-200/60`}>
                            CRITICAL
                          </span>
                        </td>
                        <td className="py-5 px-4">
                           <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${e.status === 'REQUESTED' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EMERGENCY ALERT MODAL OVERLAY */}
      {newEmergencyAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-8 md:p-12 max-w-lg w-[90%] flex flex-col items-center text-center shadow-2xl border-4 border-red-500 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-3xl font-black text-red-600 mb-2 uppercase tracking-tight">Critical Emergency!</h2>
            <p className="text-gray-500 font-medium mb-4">Immediate medical shuttle dispatch required to:</p>
            <p className="text-2xl font-bold text-[#0f172a] mb-8">{newEmergencyAlert.user_name || 'Anonymous'}</p>
            <button 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors text-lg"
              onClick={() => setNewEmergencyAlert(null)}
            >
              Acknowledge & Respond
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
