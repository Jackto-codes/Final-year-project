"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Structure meant to be moved to a DB later for easy dynamic loading and tracking
export const LOCATION_OPTIONS = {
  College: ["CBAS", "CHMS", "CHAPEL", "CIS", "ADMIN", "ICT"],
  Hostel: ["CHAPEL", "NDH", "DANIEL1", "NEH", "NEH1", "NEH2", "NEH3", "HOD"]
};

type EmergencyStep = "initial" | "name" | "category" | "location" | "confirmed";
type CategoryType = "College" | "Hostel" | null;

export default function EmergencyButton() {
  const [step, setStep] = useState<EmergencyStep>("initial");
  const [userName, setUserName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleTrigger = () => {
    setStep("name");
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    setStep("category");
  };

  const handleCategorySelect = (category: CategoryType) => {
    setSelectedCategory(category);
    setStep("location");
  };

  const handleLocationSelect = async (location: string) => {
    setSelectedLocation(location);
    setStep("confirmed");
    
    try {
      await supabase.from('emergencies').insert([{
        user_name: `${userName.trim()} [${selectedCategory} - ${location}]`,
        latitude: 6.67, // Using dummy coordinates for now
        longitude: 3.16,
        status: 'REQUESTED'
      }]);
    } catch (err) {
      console.error("Failed to submit emergency:", err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {step === "initial" && (
        <button
          className="w-full rounded-[24px] font-black text-lg py-[18px] transition-all duration-300 flex items-center justify-center gap-3 border-2 bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 hover:shadow-lg hover:shadow-red-600/20"
          onClick={handleTrigger}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          TRIGGER EMERGENCY
        </button>
      )}

      {step === "name" && (
        <div className="w-full bg-white border border-gray-200 p-6 rounded-[24px] shadow-sm animate-in fade-in slide-in-from-top-4 flex flex-col items-center text-center">
          <h3 className="font-bold text-lg text-[#0f172a] mb-2">What is your name?</h3>
          <p className="text-sm text-gray-500 mb-6">So medical staff know who to look for.</p>
          <form onSubmit={handleNameSubmit} className="w-full flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Enter your full name" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full rounded-2xl border-2 border-gray-100 bg-[#fafaf9] py-3.5 px-4 text-[#0f172a] font-semibold text-[15px] focus:outline-none focus:border-red-400 focus:bg-white transition-all duration-300"
              required
              autoFocus
            />
            <button 
              type="submit"
              disabled={!userName.trim()}
              className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-xl font-bold transition-colors"
            >
              Continue
            </button>
          </form>
          <button 
            onClick={() => setStep("initial")}
            className="mt-6 text-sm font-semibold text-gray-400 hover:text-gray-600 underline decoration-gray-300"
          >
            Cancel
          </button>
        </div>
      )}

      {step === "category" && (
        <div className="w-full bg-white border border-gray-200 p-6 rounded-[24px] shadow-sm animate-in fade-in slide-in-from-top-4 flex flex-col items-center text-center">
          <h3 className="font-bold text-lg text-[#0f172a] mb-2">Where are you located?</h3>
          <p className="text-sm text-gray-500 mb-6">Please select your general location type.</p>
          <div className="flex w-full gap-4">
            <button 
              onClick={() => handleCategorySelect("College")}
              className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-bold text-[#0f172a] transition-colors"
            >
              College
            </button>
            <button 
              onClick={() => handleCategorySelect("Hostel")}
              className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-bold text-[#0f172a] transition-colors"
            >
              Hostel
            </button>
          </div>
        </div>
      )}

      {step === "location" && selectedCategory && (
        <div className="w-full bg-white border border-gray-200 p-6 rounded-[24px] shadow-sm animate-in fade-in slide-in-from-right-4 flex flex-col items-center text-center">
          <h3 className="font-bold text-lg text-[#0f172a] mb-2">Select Exact {selectedCategory} Location</h3>
          <p className="text-sm text-gray-500 mb-6">Help the clinic driver find you quickly.</p>
          <div className="grid grid-cols-2 gap-3 w-full">
            {LOCATION_OPTIONS[selectedCategory].map(loc => (
              <button 
                key={loc}
                onClick={() => handleLocationSelect(loc)}
                className="py-3 bg-gray-50 hover:bg-[#0f172a] hover:text-white border border-gray-200 rounded-xl font-semibold text-[#0f172a] text-sm transition-all"
              >
                {loc}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setStep("category")}
            className="mt-6 text-sm font-semibold text-gray-400 hover:text-gray-600 underline decoration-gray-300"
          >
            Go back
          </button>
        </div>
      )}

      {step === "confirmed" && (
        <div className="mt-4 w-full bg-white border border-red-100 text-red-600 px-6 py-4 rounded-[24px] font-bold text-center shadow-sm flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-4">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Clinic shuttle and doctors have been dispatched to {selectedLocation} ({selectedCategory})!
        </div>
      )}
    </div>
  );
}
