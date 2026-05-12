"use client";
import { useState, useRef, useEffect } from "react";
import { LOCATION_OPTIONS } from "./EmergencyButton";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Assessment {
  severity: "EMERGENCY" | "URGENT" | "MODERATE" | "MILD";
  action: "EMERGENCY_DISPATCH" | "PRIORITY_BOOKING" | "BOOK_SHUTTLE" | "SELF_CARE";
  summary: string;
}

const SEVERITY_CONFIG = {
  EMERGENCY: {
    label: "EMERGENCY",
    bg: "bg-red-600",
    light: "bg-red-50 border-red-200 text-red-700",
    icon: "🚨",
    actionLabel: "Emergency Dispatch Activated",
    actionDesc: "The clinic driver and medical team have been immediately alerted. Stay where you are.",
  },
  URGENT: {
    label: "URGENT",
    bg: "bg-orange-500",
    light: "bg-orange-50 border-orange-200 text-orange-700",
    icon: "⚠️",
    actionLabel: "Priority Shuttle Booked",
    actionDesc: "You have been placed at the top of the shuttle queue. Proceed to your pickup point now.",
  },
  MODERATE: {
    label: "MODERATE",
    bg: "bg-yellow-500",
    light: "bg-yellow-50 border-yellow-200 text-yellow-700",
    icon: "🩺",
    actionLabel: "Shuttle Booking Confirmed",
    actionDesc: "A shuttle slot has been reserved for you. You will be notified of your batch time.",
  },
  MILD: {
    label: "MILD",
    bg: "bg-green-500",
    light: "bg-green-50 border-green-200 text-green-700",
    icon: "💊",
    actionLabel: "Self-Care Recommended",
    actionDesc: "Your condition appears manageable. Rest, stay hydrated, and monitor your symptoms.",
  },
};

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Hi, I'm MedBot 👋 — your campus health assistant. I'm here to help assess how you're feeling. What symptoms are you experiencing right now?",
};

function parseAssessment(text: string): { clean: string; assessment: Assessment | null } {
  const match = text.match(/<assessment>([\s\S]*?)<\/assessment>/);
  if (!match) return { clean: text, assessment: null };

  try {
    const assessment = JSON.parse(match[1].trim());
    const clean = text.replace(/<assessment>[\s\S]*?<\/assessment>/, "").trim();
    return { clean, assessment };
  } catch {
    return { clean: text, assessment: null };
  }
}

export default function EmergencyTriageChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [locationStep, setLocationStep] = useState<"category" | "location" | "confirmed" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"College" | "Hostel" | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || assessment) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const rawReply: string = data.reply || "Sorry, I could not process that. Please try again.";
      const { clean, assessment: parsedAssessment } = parseAssessment(rawReply);

      const assistantMessage: Message = { role: "assistant", content: clean };
      setMessages((prev) => [...prev, assistantMessage]);

      if (parsedAssessment) {
        setAssessment(parsedAssessment);
        if (parsedAssessment.severity === "EMERGENCY" || parsedAssessment.severity === "URGENT") {
          setLocationStep("category");
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I had trouble connecting. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setAssessment(null);
    setLocationStep(null);
    setSelectedCategory(null);
    setSelectedLocation(null);
    setInput("");
  };

  const config = assessment ? SEVERITY_CONFIG[assessment.severity] : null;

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-200/60 w-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="font-black text-[17px] text-[#0f172a] tracking-tight leading-none">MedBot Triage</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">AI-powered symptom assessment</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-bold text-gray-400">Online</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex flex-col gap-4 p-5 min-h-[280px] max-h-[380px] overflow-y-auto bg-[#fafaf9]"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0 mb-0.5 text-sm">
                🏥
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#0f172a] text-white rounded-br-sm"
                  : "bg-white text-[#0f172a] border border-gray-200 rounded-bl-sm shadow-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-2.5">
            <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-sm shrink-0">🏥</div>
            <div className="bg-white border border-gray-200 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}

      </div>

      {/* Assessment Result Card */}
      {assessment && config && (
        <div className={`mx-5 mb-4 p-5 rounded-2xl border ${config.light} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <div className="font-black text-sm tracking-wider uppercase">{config.label} — {config.actionLabel}</div>
              <div className="text-xs font-medium mt-0.5 opacity-80">{assessment.summary}</div>
            </div>
          </div>
          <p className="text-xs font-semibold opacity-70 border-t border-current/10 pt-3">{config.actionDesc}</p>
          {(assessment.severity === "MILD" || assessment.severity === "MODERATE" || locationStep === "confirmed") && (
            <button
              onClick={handleReset}
              className="mt-3 text-xs font-bold underline opacity-60 hover:opacity-100 transition-opacity"
            >
              Start New Assessment
            </button>
          )}
        </div>
      )}

      {/* Location Selector for URGENT/EMERGENCY */}
      {locationStep === "category" && (
        <div className="mx-5 mb-4 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-bold text-sm text-[#0f172a] mb-2">Where are you located right now?</h3>
          <p className="text-xs text-gray-500 mb-4">The clinic driver needs your location to dispatch immediately.</p>
          <div className="flex w-full gap-3">
            <button 
              onClick={() => { setSelectedCategory("College"); setLocationStep("location"); }}
              className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-bold text-sm text-[#0f172a] transition-colors"
            >
              College
            </button>
            <button 
              onClick={() => { setSelectedCategory("Hostel"); setLocationStep("location"); }}
              className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-bold text-sm text-[#0f172a] transition-colors"
            >
              Hostel
            </button>
          </div>
        </div>
      )}

      {locationStep === "location" && selectedCategory && (
        <div className="mx-5 mb-4 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center text-center animate-in fade-in slide-in-from-right-4">
          <h3 className="font-bold text-sm text-[#0f172a] mb-3">Select Exact {selectedCategory} Location</h3>
          <div className="grid grid-cols-2 gap-2 w-full">
            {LOCATION_OPTIONS[selectedCategory].map((loc: string) => (
              <button 
                key={loc}
                onClick={() => { setSelectedLocation(loc); setLocationStep("confirmed"); }}
                className="py-2.5 bg-gray-50 hover:bg-[#0f172a] hover:text-white border border-gray-200 rounded-xl font-semibold text-[#0f172a] text-xs transition-all"
              >
                {loc}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setLocationStep("category")}
            className="mt-4 text-xs font-semibold text-gray-400 hover:text-gray-600 underline"
          >
            Go back
          </button>
        </div>
      )}

      {locationStep === "confirmed" && (
        <div className="mx-5 mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-green-700 animate-in fade-in slide-in-from-top-4">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-sm font-bold">Driver dispatched to {selectedLocation} ({selectedCategory})</span>
        </div>
      )}

      {/* Input */}
      {!assessment && (
        <div className="flex gap-2.5 p-4 border-t border-gray-100">
          <input
            className="flex-1 rounded-2xl border-2 border-gray-100 bg-[#fafaf9] px-4 py-3 text-[#0f172a] font-semibold text-[14px] focus:outline-none focus:border-[#0f172a] focus:bg-white transition-all duration-300 placeholder:font-normal placeholder:text-gray-400"
            type="text"
            placeholder="Describe how you feel..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            disabled={loading}
          />
          <button
            className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shrink-0 ${
              loading || !input.trim()
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#0f172a] text-white hover:bg-black hover:shadow-lg"
            }`}
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      )}
    </div>
  );
}
