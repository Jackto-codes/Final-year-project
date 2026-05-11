import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center bg-[#fafaf9] pt-32 pb-24 px-4">
      <div className="w-full max-w-5xl flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-4 tracking-tight">Reserve Your Seat</h1>
        <p className="text-gray-500 text-lg max-w-2xl font-medium">Select your preferred date and shuttle batch below. Our smart allocation system will ensure your clinic visit is seamless and on time.</p>
      </div>
      <div className="w-full max-w-lg">
        <BookingForm />
      </div>
    </main>
  );
}