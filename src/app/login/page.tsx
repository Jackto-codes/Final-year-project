import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fafaf9] px-4 py-20">
      <div className="w-full max-w-[400px]">
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#0f172a] flex items-center justify-center shadow-md mb-4">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
              <rect x="2" y="8" width="20" height="10" rx="3" fill="#22c55e"/>
              <rect x="4" y="5" width="16" height="5" rx="2" fill="#ffffff" opacity="0.8"/>
              <circle cx="7" cy="19" r="2" fill="#ffffff"/>
              <circle cx="17" cy="19" r="2" fill="#ffffff"/>
              <rect x="14" y="9" width="1.5" height="5" rx="0.75" fill="#ffffff" opacity="0.6"/>
            </svg>
          </div>
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 font-medium mt-1">Sign in to your MTU account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-200/60 w-full">
          <form className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-bold tracking-wider uppercase text-gray-400 mb-2.5 block">Email Address</label>
              <input 
                type="email" 
                placeholder="student@mtu.edu.ng" 
                className="w-full rounded-2xl border-2 border-gray-100 bg-[#fafaf9] py-3.5 px-4 text-[#0f172a] font-semibold text-[15px] focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
                required
              />
            </div>
            
            <div>
              <label className="text-xs font-bold tracking-wider uppercase text-gray-400 mb-2.5 flex justify-between">
                Password
                <Link href="#" className="text-green-600 hover:text-green-700 normal-case tracking-normal">Forgot?</Link>
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full rounded-2xl border-2 border-gray-100 bg-[#fafaf9] py-3.5 px-4 text-[#0f172a] font-semibold text-[15px] focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
                required
              />
            </div>

            <button 
              type="submit"
              className="mt-4 w-full rounded-2xl bg-green-600 text-white font-bold text-[16px] py-[16px] transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm font-medium text-gray-500">
              Don't have an account? <Link href="#" className="text-[#0f172a] font-bold hover:text-green-600 transition-colors">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
