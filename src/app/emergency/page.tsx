import EmergencyButton from "@/components/EmergencyButton";
import EmergencyTriageChat from "@/components/EmergencyTriageChat";

export default function EmergencyPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center bg-[#fafaf9] pt-32 pb-24 px-4">
      <div className="w-full max-w-5xl flex flex-col items-center text-center mb-12">
        <div className="bg-red-50 text-red-600 font-bold px-4 py-1.5 rounded-full text-sm mb-6 border border-red-100 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Emergency Assistance
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-4 tracking-tight">Need Immediate Help?</h1>
        <p className="text-gray-500 text-lg max-w-2xl font-medium">Use the triage chat below to assess your symptoms, or press the emergency button to immediately dispatch a priority medical shuttle to your location.</p>
      </div>
      
      <div className="w-full max-w-lg flex flex-col gap-6">
        <EmergencyTriageChat />
        <div className="w-full h-px bg-gray-200/60 my-2"></div>
        <EmergencyButton />
      </div>
    </main>
  );
}