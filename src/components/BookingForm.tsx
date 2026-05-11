"use client";
import { useState } from "react";
import QRReceipt from "./QRReceipt";
import { supabase } from "../lib/supabaseClient";

const BATCHES = [
  { time: "7:30 AM", label: "Batch 1 · Early bird" },
  { time: "10:00 AM", label: "Batch 2 · Morning" },
  { time: "1:00 PM", label: "Batch 3 · Afternoon" },
  { time: "4:00 PM", label: "Batch 4 · Evening" },
  { time: "7:00 PM", label: "Batch 5 · Night" },
];

function getDates() {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDay = (d: Date, isToday: boolean) => isToday ? "Today" : "Tomorrow";
  const formatDateStr = (d: Date) => d.toLocaleDateString('en-US', { month: "short", day: "numeric" });

  return [
    { day: formatDay(today, true), date: formatDateStr(today), raw: today },
    { day: formatDay(tomorrow, false), date: formatDateStr(tomorrow), raw: tomorrow },
  ];
}

export default function BookingForm() {
  const [name, setName] = useState("");
  const [dateIdx, setDateIdx] = useState(0);
  const [batchIdx, setBatchIdx] = useState(0);
  const [receipt, setReceipt] = useState<null | { name: string; date: string; batch: string; seat: string }>(null);
  const [loading, setLoading] = useState(false);

  const dates = getDates();

  function assignSeat() {
    const seats = ["A", "B", "C", "D", "E", "F", "G"];
    return seats[Math.floor(Math.random() * seats.length)];
  }

  async function handleBook() {
    setLoading(true);
    
    try {
      const userEmail = `${(name || "student").replace(/\s+/g, '').toLowerCase()}@student.mtu.edu.ng`;
      const selectedDate = dates[dateIdx].raw.toISOString().split('T')[0];
      const selectedBatch = batchIdx + 1;

      // 1. Check if trip exists for this date and batch
      let { data: trips } = await supabase
        .from('trips')
        .select('id')
        .eq('date', selectedDate)
        .eq('batch_number', selectedBatch);

      let tripId;
      if (!trips || trips.length === 0) {
        // Create trip if it doesn't exist
        const { data: newTrip, error: tripError } = await supabase
          .from('trips')
          .insert([{ date: selectedDate, batch_number: selectedBatch }])
          .select();
        
        if (tripError) throw tripError;
        tripId = newTrip[0].id;
      } else {
        tripId = trips[0].id;
      }

      // 2. Generate seat and serial
      const seat = assignSeat();
      const serial = Math.random().toString(36).substring(2, 10).toUpperCase();

      // 3. Create booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          user_name: name || "Student",
          user_email: userEmail,
          trip_id: tripId,
          batch_number: selectedBatch,
          seat_number: seat,
          serial_number: serial
        }]);

      if (bookingError) throw bookingError;

      // 4. Show receipt
      setReceipt({
        name: name || "Student",
        date: dates[dateIdx].date,
        batch: BATCHES[batchIdx].time,
        seat: seat,
      });
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (receipt) {
    return (
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 bg-white p-10 rounded-[24px] shadow-sm border border-gray-200/60 w-full">
        <QRReceipt name={receipt.name} date={receipt.date} batch={receipt.batch} seat={receipt.seat} />
        <button 
          className="mt-8 w-full rounded-2xl bg-green-600 text-white font-bold text-[16px] py-[16px] transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20" 
          onClick={() => setReceipt(null)}
        >
          Book Another Shuttle
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-10 w-full shadow-sm border border-gray-200/60 transition-all duration-300">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#0f172a] flex items-center justify-center shadow-md">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
            <rect x="2" y="8" width="20" height="10" rx="3" fill="#22c55e"/>
            <rect x="4" y="5" width="16" height="5" rx="2" fill="#ffffff" opacity="0.8"/>
            <circle cx="7" cy="19" r="2" fill="#ffffff"/>
            <circle cx="17" cy="19" r="2" fill="#ffffff"/>
            <rect x="14" y="9" width="1.5" height="5" rx="0.75" fill="#ffffff" opacity="0.6"/>
          </svg>
        </div>
        <div>
          <h2 className="font-black text-2xl text-[#0f172a] m-0 tracking-tight">Shuttle Schedule</h2>
          <p className="text-sm font-medium text-gray-500 m-0 mt-1">Select your preferred departure</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-xs font-bold tracking-wider uppercase text-gray-400 m-0 mb-2.5 block">Full Name</label>
        <input 
          type="text" 
          placeholder="Enter your name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border-2 border-gray-100 bg-[#fafaf9] py-3.5 px-4 text-[#0f172a] font-semibold text-[15px] focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
          required
        />
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold tracking-wider uppercase text-gray-400 m-0">Date</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {dates.map((d, i) => {
            const active = dateIdx === i;
            return (
              <div 
                key={i}
                className={`rounded-2xl border-2 py-4 px-4 cursor-pointer transition-all duration-300 text-center ${active ? 'border-[#0f172a] bg-[#0f172a] shadow-md shadow-slate-900/10' : 'border-gray-100 bg-[#fafaf9] hover:border-green-400 hover:bg-green-50'}`}
                onClick={() => setDateIdx(i)}
              >
                <span className={`text-xs font-semibold mb-1 block transition-colors duration-300 ${active ? 'text-green-400' : 'text-gray-500'}`}>{d.day}</span>
                <span className={`text-base font-bold block transition-colors duration-300 ${active ? 'text-white' : 'text-[#0f172a]'}`}>{d.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xs font-bold tracking-wider uppercase text-gray-400 m-0 mb-3">Departure batch</p>
        <div className="flex flex-col gap-3">
          {BATCHES.map((b, i) => {
            const active = batchIdx === i;
            return (
              <div 
                key={i}
                className={`rounded-2xl border-2 py-4 px-5 cursor-pointer transition-all duration-300 flex items-center justify-between ${active ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-100 bg-[#fafaf9] hover:border-green-400 hover:bg-green-50'}`}
                onClick={() => setBatchIdx(i)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 shrink-0 ${active ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <div>
                    <div className="text-[15px] font-bold text-[#0f172a]">{b.time}</div>
                    <div className="text-[13px] font-medium text-gray-500 mt-0.5">{b.label}</div>
                  </div>
                </div>
                <span className={`text-xs font-bold py-1.5 px-3.5 rounded-full bg-green-100 text-green-700 transition-all duration-300 ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>Selected</span>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="border-none border-t border-gray-100 my-6" />

      <div className="bg-[#fafaf9] border border-gray-100 rounded-2xl py-4 px-5 mb-8 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-bold tracking-wide uppercase mb-1">Your booking</div>
          <div className="text-[14px] text-[#0f172a] font-bold">
            {dates[dateIdx].date} · {BATCHES[batchIdx].time}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>

      <button 
        className="w-full rounded-2xl bg-green-600 text-white font-bold text-[16px] py-[18px] transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 disabled:opacity-70 disabled:hover:shadow-none flex items-center justify-center gap-2 group"
        onClick={handleBook}
        disabled={loading}
      >
        {loading ? (
          <span>Confirming...</span>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Confirm Booking
          </>
        )}
      </button>
    </div>
  );
}


