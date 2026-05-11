const SEATS = ["A", "B", "C", "D", "E", "F", "G"];

export default function SeatGrid({ booked = [] }: { booked?: string[] }) {
  return (
    <div className="flex gap-2 justify-center my-4">
      {SEATS.map((seat) => (
        <div
          key={seat}
          className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg border-2 transition-colors
            ${booked.includes(seat) ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-primary/40 hover:bg-primary/10'}`}
        >
          {seat}
        </div>
      ))}
    </div>
  );
}
