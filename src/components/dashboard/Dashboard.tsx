import { motion } from 'framer-motion';
import { CameraView } from '../camera/CameraView';
import { useAppStore } from '../../lib/store';
import { usePosture } from '../../hooks/usePosture';
import { useGamification } from '../../hooks/useGamification';

export const Dashboard = () => {
  const xp = useAppStore(state => state.xp);
  const level = useAppStore(state => state.level);
  const sensitivity = useAppStore(state => state.alertSensitivity);
  
  const { metrics } = usePosture('#pose-video');
  const scoreDisplay = metrics?.score ? Math.round(metrics.score) : '--';
  
  useGamification(metrics?.score);

  const isSlouching = metrics?.score !== undefined && metrics.score < sensitivity;
  
  const getScoreColor = () => {
    if (typeof scoreDisplay !== 'number') return 'text-slate-400';
    if (scoreDisplay >= 80) return 'from-emerald-400 to-emerald-600';
    if (scoreDisplay >= sensitivity) return 'from-amber-400 to-amber-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Dashboard</h1>
        <div className="flex items-center space-x-3 rounded-full bg-slate-800/80 border border-slate-700/50 px-4 py-2 shadow-sm backdrop-blur-md">
          <span className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {metrics?.score && metrics.score > 80 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Level {level}
          </span>
          <span className="w-px h-4 bg-slate-700"></span>
          <span className="text-sm font-medium text-slate-300">{xp} XP</span>
        </div>
      </header>
      
      {isSlouching && (
         <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl backdrop-blur-sm"
         >
           <p className="text-red-400 font-medium text-center">Alert: Please adjust your posture!</p>
         </motion.div>
      )}

      <div className="grid flex-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-2 shadow-xl backdrop-blur-xl ring-1 ring-white/5 relative overflow-hidden">
          <div className="absolute top-4 right-4 z-10 bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-md font-mono border border-emerald-500/30">
            LOCAL WASM
          </div>
          <CameraView />
        </div>
        <div className="flex flex-col space-y-6">
          <div className="flex-1 rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/60 to-slate-900/20 p-6 flex items-center justify-center shadow-xl backdrop-blur-xl ring-1 ring-white/5 transition-colors">
             <div className="text-center transform transition-transform duration-500 hover:scale-105">
                 <div className={`text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br mb-2 drop-shadow-sm font-mono ${getScoreColor()}`}>
                    {scoreDisplay}
                 </div>
                 <div className="text-xs text-slate-400 uppercase tracking-[0.2em] font-semibold">Posture Score</div>
             </div>
          </div>
          <div className="h-48 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 flex flex-col items-center justify-center shadow-xl backdrop-blur-xl ring-1 ring-white/5 overflow-hidden relative group">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-slate-900/5 to-transparent transition-opacity group-hover:opacity-50"></div>
             <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-7xl z-10 filter drop-shadow-lg"
             >
                🦐
             </motion.div>
             <span className="text-emerald-500/50 text-xs font-semibold mt-4 relative uppercase tracking-widest z-10">Lvl {level} Evolution</span>
          </div>
        </div>
      </div>
    </div>
  );
};
