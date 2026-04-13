import { useState } from 'react';
import { useAppStore } from '../../lib/store';
import { invoke } from '@tauri-apps/api/core';

export const Settings = () => {
  const sensitivity = useAppStore(state => state.alertSensitivity);
  const setSensitivity = useAppStore(state => state.setSensitivity);
  
  const [licenseKey, setLicenseKey] = useState('');
  const [email, setEmail] = useState('');
  const [validating, setValidating] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState<'none' | 'valid' | 'invalid'>('none');

  const handleValidate = async () => {
     setValidating(true);
     try {
       // Using tauri v2 core api invoke
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       const res: any = await invoke('validate_license', { email, licenseKey });
       if (res.valid) {
          setLicenseStatus('valid');
       } else {
          setLicenseStatus('invalid');
       }
     } catch(err) {
       setLicenseStatus('invalid');
     }
     setValidating(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Settings</h1>
      </header>
      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-8 max-w-2xl shadow-xl backdrop-blur-xl ring-1 ring-white/5">
        <div className="space-y-8">
           
           {/* Sensitivity Setting */}
           <div>
              <h3 className="font-semibold text-slate-200">Alert Sensitivity</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4">Set the minimum score before slouch alerts trigger.</p>
              <div className="flex items-center space-x-4">
                 <input 
                   type="range" 
                   min="40" max="90" 
                   value={sensitivity} 
                   onChange={(e) => setSensitivity(parseInt(e.target.value))}
                   className="w-full h-2 rounded-lg appearance-none bg-slate-800"
                 />
                 <span className="text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20 w-16 text-center">{sensitivity}</span>
              </div>
           </div>
           
           <div className="border-t border-slate-800/60 pt-8 mt-8"></div>

           {/* License Setting */}
           <div>
              <h3 className="font-semibold text-slate-200">License Activation (SaaS)</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4">Enter your license key to unlock Pro features.</p>
              <div className="space-y-3">
                 <input 
                   type="email"
                   placeholder="Account Email" 
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                 />
                 <div className="flex space-x-3">
                    <input 
                      type="text" 
                      placeholder="XXXX-XXXX-XXXX-XXXX" 
                      value={licenseKey}
                      onChange={e => setLicenseKey(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800/80 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    <button 
                       onClick={handleValidate}
                       disabled={validating || !licenseKey || !email}
                       className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                       {validating ? 'Checking...' : 'Activate'}
                    </button>
                 </div>
                 {licenseStatus === 'valid' && <p className="text-emerald-400 text-sm mt-2">✓ License active and device bound.</p>}
                 {licenseStatus === 'invalid' && <p className="text-red-400 text-sm mt-2">Invalid or expired license key.</p>}
              </div>
           </div>

           <div className="border-t border-slate-800/60 pt-8 mt-8"></div>

           <div className="flex justify-between items-center bg-red-500/5 border border-red-500/10 p-4 rounded-xl">
              <div>
                <h3 className="font-semibold text-slate-200">Privacy Data</h3>
                <p className="text-sm text-slate-500 mt-1">Export or delete all local models and analytic data.</p>
              </div>
              <div>
                 <button className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-sm font-medium border border-red-500/30 transition-colors">
                    Clear Data
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
