import { Camera, Mic, MapPin, Bell, History, Home, User, ShieldCheck, AlertTriangle, Globe } from 'lucide-react';

export default function SahiDawaHome() {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center text-slate-900 font-sans sm:p-4">
      {/* Mobile Constraint Wrapper for Desktop */}
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[850px] sm:rounded-3xl shadow-2xl relative pb-20 overflow-hidden border border-slate-200/60">
        
        {/* Header */}
        <header className="px-5 py-4 flex items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
              <ShieldCheck size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">SahiDawa</h1>
          </div>
          
          <button className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-full hover:bg-slate-100 transition-colors shadow-sm">
            <Globe size={16} className="text-emerald-600" />
            <span>English</span>
          </button>
        </header>

        {/* Main Content */}
        <main className="px-5 pt-6 pb-10 space-y-8 h-full overflow-y-auto">
          
          {/* Welcome Text */}
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Verify your medicine.</h2>
            <p className="text-slate-500 font-medium text-base">Check if it's safe and authentic instantly.</p>
          </div>

          {/* Primary Action - Scan Barcode */}
          <button className="w-full group relative overflow-hidden rounded-[2rem] bg-emerald-600 text-white p-7 shadow-xl shadow-emerald-600/25 transition-all active:scale-[0.98] hover:shadow-emerald-600/40 border border-emerald-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-700 to-emerald-500 z-0"></div>
            
            {/* Decorative circles */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-900/20 rounded-full blur-xl"></div>

            <div className="relative z-10 flex flex-col items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Camera size={36} className="text-white drop-shadow-md" strokeWidth={2} />
              </div>
              <div className="text-center space-y-1">
                <span className="block text-2xl font-bold tracking-wide drop-shadow-sm">Scan Medicine</span>
                <span className="text-emerald-50 text-sm font-medium opacity-90">Point camera at barcode or QR</span>
              </div>
            </div>
          </button>

          {/* Secondary Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center gap-3 bg-blue-50/80 border border-blue-100/80 p-5 rounded-3xl active:scale-95 transition-all group hover:bg-blue-50 hover:shadow-md hover:shadow-blue-100/50">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                <Mic size={26} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-slate-700 text-center leading-tight">Speak<br/>Symptoms</span>
            </button>

            <button className="flex flex-col items-center justify-center gap-3 bg-amber-50/80 border border-amber-100/80 p-5 rounded-3xl active:scale-95 transition-all group hover:bg-amber-50 hover:shadow-md hover:shadow-amber-100/50">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                <MapPin size={26} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-slate-700 text-center leading-tight">Find<br/>Pharmacy</span>
            </button>
          </div>

          {/* Recent Alerts Widget */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Recent Alerts</h3>
              <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">View All</button>
            </div>
            
            <div className="bg-white border border-red-100/80 rounded-2xl p-4 shadow-sm flex items-start gap-4 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-red-100 transition-colors">
                <AlertTriangle size={22} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-full">Fake Alert</span>
                  <span className="text-[11px] font-medium text-slate-400">2h ago</span>
                </div>
                <h4 className="font-bold text-slate-800 mt-2 text-base leading-tight">Augmentin 625 Duo</h4>
                <p className="text-sm text-slate-500 mt-1 font-medium leading-snug">Batch No. B23059 reported suspicious by 12 users in Delhi.</p>
              </div>
            </div>
          </div>
          
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200/60 flex justify-around px-2 py-3 items-center z-50 pb-safe">
          <button className="flex flex-col items-center gap-1.5 w-16 group">
            <div className="text-emerald-600 group-hover:-translate-y-1 transition-transform">
              <Home size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-bold text-emerald-600">Home</span>
          </button>
          
          <button className="flex flex-col items-center gap-1.5 w-16 group text-slate-400 hover:text-slate-600 transition-colors">
            <div className="group-hover:-translate-y-1 transition-transform">
              <History size={24} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-semibold">Scans</span>
          </button>
          
          <button className="flex flex-col items-center gap-1.5 w-16 group text-slate-400 hover:text-slate-600 transition-colors">
            <div className="relative group-hover:-translate-y-1 transition-transform">
              <Bell size={24} strokeWidth={2} />
              <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
            </div>
            <span className="text-[11px] font-semibold">Alerts</span>
          </button>
          
          <button className="flex flex-col items-center gap-1.5 w-16 group text-slate-400 hover:text-slate-600 transition-colors">
            <div className="group-hover:-translate-y-1 transition-transform">
              <User size={24} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-semibold">Profile</span>
          </button>
        </nav>
        
      </div>
    </div>
  );
}
