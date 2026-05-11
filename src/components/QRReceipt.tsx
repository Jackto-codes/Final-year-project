import { QRCodeSVG } from "qrcode.react";

export interface QRReceiptProps {
  name: string;
  date: string;
  batch: string;
  seat: string;
}

export default function QRReceipt({ name, date, batch, seat }: QRReceiptProps) {
  const serial = `SMMS-${date.replace(/[^\d]/g, "")}-B${batch.match(/\d+/)?.[0] || "?"}-${seat}`;
  const qrValue = JSON.stringify({ serial, name, date, batch, seat });

  const handleDownload = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Shuttle Confirmation</title>
  <style>
    body { font-family: 'Inter', sans-serif; background: #fafaf9; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
    .card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); max-width: 400px; width: 100%; border: 1px solid #e2e8f0; text-align: center; }
    .title { color: #0f172a; font-size: 24px; font-weight: 900; margin-bottom: 5px; }
    .subtitle { color: #64748b; font-size: 14px; margin-bottom: 30px; }
    .item { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
    .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; font-weight: bold; }
    .value { color: #0f172a; font-size: 16px; font-weight: bold; }
    .qr { margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 16px; display: inline-block; }
  </style>
</head>
<body>
  <div class="card">
    <div class="title">Shuttle Confirmation</div>
    <div class="subtitle">Present this receipt when boarding.</div>
    <div class="item">
      <div class="label">Passenger</div>
      <div class="value">${name}</div>
    </div>
    <div class="item">
      <div class="label">Date</div>
      <div class="value">${date}</div>
    </div>
    <div class="item">
      <div class="label">Batch</div>
      <div class="value">${batch}</div>
    </div>
    <div class="item">
      <div class="label">Seat</div>
      <div class="value">${seat}</div>
    </div>
    <div class="item">
      <div class="label">Serial Number</div>
      <div class="value" style="color: #16a34a;">${serial}</div>
    </div>
    <div class="qr">
      <strong>TICKET CONFIRMED</strong>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Shuttle_Receipt_${serial}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-green-50 border border-green-100 rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-sm">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      </div>
      
      <h3 className="font-black text-2xl text-[#0f172a] mb-2 tracking-tight">Booking Confirmed!</h3>
      <p className="text-sm font-medium text-gray-500 mb-8 text-center max-w-[280px]">Your seat has been reserved successfully. Please save your receipt.</p>
      
      <div className="w-full bg-[#fafaf9] rounded-[20px] p-6 mb-8 border border-gray-100">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200/60 mb-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Passenger</span>
          <span className="text-sm font-bold text-[#0f172a]">{name}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200/60 mb-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</span>
          <span className="text-sm font-bold text-[#0f172a]">{date}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200/60 mb-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Batch</span>
          <span className="text-sm font-bold text-[#0f172a]">{batch}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200/60 mb-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seat Number</span>
          <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">{seat}</span>
        </div>
        
        <div className="flex flex-col items-center pt-2">
          <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 mb-3">
            <QRCodeSVG value={qrValue} size={100} level="M" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{serial}</span>
        </div>
      </div>

      <button 
        onClick={handleDownload}
        className="w-full rounded-2xl border-2 border-gray-200 bg-white text-[#0f172a] font-bold text-[16px] py-[16px] transition-all duration-300 hover:border-[#0f172a] hover:bg-[#fafaf9] flex items-center justify-center gap-2"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download Receipt
      </button>
    </div>
  );
}

