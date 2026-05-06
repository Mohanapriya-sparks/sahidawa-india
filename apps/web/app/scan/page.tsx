"use client";

import { useState, useEffect } from "react";
import { Camera, X, Zap, ShieldCheck, Info, AlertCircle, Layers, Image } from "lucide-react";
import Link from "next/link";

export default function ScanPage() {
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<null | "valid" | "invalid">(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        setScanning(false);
        setResult("valid");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [scanning]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setScanning(true);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans relative flex flex-col">
      {/* Hidden File Input */}
      <input 
        type="file" 
        id="medicine-upload" 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileUpload}
      />

      {/* Header Overly */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between bg-linear-to-b from-black/70 to-transparent">
        <Link href="/" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
          <X size={24} />
        </Link>
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            {uploadedImage ? "Analyzing Upload" : "Scanner Mode"}
          </span>
          <span className="text-sm font-medium">Position the Barcode</span>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
          <Zap size={20} className="text-amber-400" />
        </button>
      </div>

      {/* Viewfinder Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Mock Camera Feed or Uploaded Image */}
        <div className="absolute inset-0 bg-slate-900 overflow-hidden">
           {uploadedImage ? (
             <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover opacity-60" />
           ) : (
             <>
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
               <div className="absolute inset-0 animate-pulse bg-emerald-500/5"></div>
             </>
           )}
        </div>

        {/* Scan Frame */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 z-10">
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl"></div>

          {scanning && (
            <div className="absolute left-4 right-4 h-[2px] bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-scan z-20"></div>
          )}

          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                <span className="text-sm font-bold tracking-widest animate-pulse uppercase">Analysing...</span>
              </div>
            </div>
          )}
        </div>


        {/* Result Overlay */}
        {result === "valid" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
            <div className="bg-white text-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
               
               <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                    <ShieldCheck size={40} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Authentic Medicine</h3>
                    <p className="text-slate-500 font-medium">Verified by CDSCO Database</p>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                       <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Batch No.</span>
                       <span className="font-bold text-slate-700">AUG625D</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                       <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Expiry</span>
                       <span className="font-bold text-slate-700">12/2027</span>
                    </div>
                  </div>

                  <div className="w-full bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 text-left">
                    <Info size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                      This medicine matches the official records. Always check the physical seal before use.
                    </p>
                  </div>

                  <button 
                    onClick={() => {setScanning(true); setResult(null);}}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                  >
                    Scan Another
                  </button>
                  <Link href="/" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                    Back to Home
                  </Link>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Guidance */}
      <div className="p-8 bg-linear-to-t from-black to-transparent flex flex-col items-center gap-6">
         <p className="text-slate-400 text-sm font-medium text-center max-w-xs">
           Hold the medicine strip steady inside the frame or upload a photo from your gallery.
         </p>
         <div className="flex gap-4">
            <label 
              htmlFor="medicine-upload" 
              className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-200 transition-colors shadow-lg"
            >
              <Layers size={18} />
              Upload Photo
            </label>
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <AlertCircle size={20} className="text-white/50" />
            </div>
         </div>
      </div>
    </div>
  );
}
