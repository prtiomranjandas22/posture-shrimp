import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { time: '09:00', score: 85 },
  { time: '10:00', score: 92 },
  { time: '11:00', score: 88 },
  { time: '12:00', score: 75 },
  { time: '13:00', score: 62 },
  { time: '14:00', score: 81 },
  { time: '15:00', score: 90 },
];

export const Analytics = () => {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Analytics</h1>
        <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700 hover:bg-slate-700">
           Export CSV
        </button>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
         <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-6 shadow-xl backdrop-blur-xl">
            <h3 className="text-sm font-medium text-slate-400">Average Score</h3>
            <div className="mt-2 text-3xl font-black text-emerald-400">83.5</div>
         </div>
         <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-6 shadow-xl backdrop-blur-xl">
            <h3 className="text-sm font-medium text-slate-400">Good Time Split</h3>
            <div className="mt-2 text-3xl font-black text-emerald-400">72%</div>
         </div>
         <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-6 shadow-xl backdrop-blur-xl">
            <h3 className="text-sm font-medium text-slate-400">XP Earned Today</h3>
            <div className="mt-2 text-3xl font-black text-emerald-400">+45</div>
         </div>
      </div>
      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 shadow-xl backdrop-blur-xl h-96 mt-6">
        <h3 className="text-lg font-medium text-slate-200 mb-6">Today's Posture Trends</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#475569" />
            <YAxis stroke="#475569" domain={[0, 100]} />
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
              itemStyle={{ color: '#10b981' }}
            />
            <Area type="monotone" dataKey="score" stroke="#10b981" fillOpacity={1} fill="url(#scoreColor)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
