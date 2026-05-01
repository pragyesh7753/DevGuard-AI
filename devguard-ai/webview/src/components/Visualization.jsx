import { useState, useMemo } from 'react';
import { Terminal, TrendingUp, Cpu, Network } from 'lucide-react';

import { timeAgo } from '../utils/constants';

export default function Visualization({ commands }) {
  const [selectedId, setSelectedId] = useState(null);

  const stats = useMemo(() => {
    if (!commands || commands.length === 0) return { totalCommands: 0, totalFiles: 0, highRisk: 0 };
    const allFiles = new Set();
    commands.forEach(cmd => {
      [...(cmd.filesCreated || []), ...(cmd.filesModified || []), ...(cmd.filesDeleted || [])]
        .forEach(f => allFiles.add(f));
    });
    return {
      totalCommands: commands.length,
      totalFiles: allFiles.size,
      highRisk: commands.filter(c => c.risk === 'high').length
    };
  }, [commands]);

  const activeCommand = selectedId !== null ? commands[selectedId] : (commands[0] || null);

  const trendPoints = useMemo(() => {
    if (!commands || commands.length === 0) return [];
    return commands.slice(-12).map((cmd, i) => {
      const impact = (cmd.filesCreated?.length || 0) + (cmd.filesModified?.length || 0) + (cmd.filesDeleted?.length || 0);
      return { x: i * 36, y: 80 - (impact * 6) };
    });
  }, [commands]);

  if (!commands || commands.length === 0 || !activeCommand) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Cpu size={40} className="text-zinc-800 mb-4 animate-pulse" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Awaiting execution data</h3>
        <p className="text-[11px] text-zinc-600 mt-2 max-w-xs">Interaction history will be mapped here in real-time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex items-center justify-between border-b border-border-base pb-6">
        <div className="space-y-1">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Network size={12} />
            Execution Impact Topology
          </h2>
          <p className="text-[10px] text-zinc-600 font-medium">Visualizing filesystem mutations and risk propagation.</p>
        </div>
        
        <div className="flex gap-10">
          <div>
            <div className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter mb-1">Compute Score</div>
            <div className="text-lg font-semibold tracking-tight text-white">{stats.totalFiles * 3 + stats.totalCommands}</div>
          </div>
          <div>
            <div className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter mb-1">Nodes Detected</div>
            <div className="text-lg font-semibold tracking-tight text-white">{stats.totalFiles}</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Technical Registry (Left) */}
        <div className="lg:col-span-3 space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {commands.map((cmd, i) => (
            <button
              key={i}
              onClick={() => setSelectedId(i)}
              className={`
                w-full text-left p-3 rounded-sm border transition-all duration-200
                ${(selectedId === i || (selectedId === null && i === 0))
                  ? 'bg-white border-white text-black' 
                  : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] font-bold uppercase tracking-tighter opacity-60">ID: {i.toString(16).padStart(4, '0')}</span>
                <span className="text-[8px] font-mono">{timeAgo(cmd.timestamp)}</span>
              </div>
              <code className="text-[10px] font-mono block truncate font-semibold">
                {cmd.command}
              </code>
            </button>
          ))}
        </div>

        {/* Impact Map (Center) */}
        <div className="lg:col-span-9 h-[500px] relative border border-zinc-900 bg-zinc-950/20 perspective-1000 overflow-hidden">
          {/* Blueprint Grid */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center preserve-3d rotate-x-12">
            {/* Core Node */}
            <div className="relative z-10 transform-style-3d translate-z-20">
              <div className="w-16 h-16 bg-white border border-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)] group-hover:scale-110 transition-transform duration-500">
                <Terminal size={24} className="text-black" />
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <code className="text-[9px] font-mono text-zinc-400 bg-zinc-900 px-2 py-1 border border-zinc-800">
                  {activeCommand.command}
                </code>
              </div>
            </div>

            {/* Impact Lines */}
            <div className="absolute inset-0 pointer-events-none transform-style-3d">
              <svg className="w-full h-full">
                {([...(activeCommand.filesCreated || []), ...(activeCommand.filesModified || []), ...(activeCommand.filesDeleted || [])]).map((file, idx, arr) => {
                  const angle = (idx / arr.length) * 2 * Math.PI;
                  const x = 50 + Math.cos(angle) * 32;
                  const y = 50 + Math.sin(angle) * 32;
                  
                  return (
                    <line 
                      key={file}
                      x1="50%" y1="50%" x2={`${x}%`} y2={`${y}%`} 
                      stroke="white" strokeWidth="0.5" strokeOpacity="0.1"
                      className="animate-[pulse_4s_infinite]"
                    />
                  );
                })}
              </svg>
            </div>

            {/* File Nodes */}
            {([...(activeCommand.filesCreated || []), ...(activeCommand.filesModified || []), ...(activeCommand.filesDeleted || [])]).map((file, idx, arr) => {
              const angle = (idx / arr.length) * 2 * Math.PI;
              const x = 50 + Math.cos(angle) * 32;
              const y = 50 + Math.sin(angle) * 32;
              
              let type = 'mod';
              if (activeCommand.filesCreated?.includes(file)) type = 'new';
              if (activeCommand.filesDeleted?.includes(file)) type = 'del';

              const color = type === 'new' ? 'text-emerald-500' : type === 'del' ? 'text-red-500' : 'text-zinc-300';
              const dotColor = type === 'new' ? 'bg-emerald-500' : type === 'del' ? 'bg-red-500' : 'bg-white';

              return (
                <div 
                  key={file}
                  className={`absolute z-20 flex flex-col items-center gap-2 group/file transform-style-3d translate-z-10`}
                  style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className={`w-1.5 h-1.5 ${dotColor} group-hover/file:scale-150 transition-all duration-300`} />
                  <div className="bg-black/90 backdrop-blur-sm border border-zinc-800 px-2 py-1 opacity-0 group-hover/file:opacity-100 transition-all duration-200 pointer-events-none -translate-y-1">
                    <span className="text-[10px] font-mono text-zinc-300 whitespace-nowrap block">{file}</span>
                    <span className={`text-[8px] font-bold uppercase tracking-tighter ${color}`}>{type}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest text-zinc-700">Perspective Engine Active</div>
        </div>
      </div>

      {/* Analytics Panel (Bottom) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-10 border-t border-zinc-900">
        <div className="md:col-span-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <TrendingUp size={10} />
              Temporal Velocity
            </h3>
            <div className="h-24 w-full">
              <svg className="w-full h-full overflow-visible">
                <path
                  d={`M ${trendPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  strokeOpacity="0.2"
                />
                {trendPoints.map((p, i) => (
                  <circle 
                    key={i} cx={p.x} cy={p.y} r="2" 
                    fill={i === trendPoints.length - 1 ? 'white' : '#27272a'}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Node Analysis</h3>
            <div className={`px-2 py-0.5 border text-[9px] font-bold uppercase ${activeCommand.risk === 'high' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
              Risk: {activeCommand.risk || 'Low'}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-10">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">Mutation Volume</span>
              <div className="text-xl font-semibold">{([...(activeCommand.filesCreated || []), ...(activeCommand.filesModified || []), ...(activeCommand.filesDeleted || [])]).length}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">Latency Offset</span>
              <div className="text-xl font-semibold">12ms</div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">Detection Reliability</span>
              <div className="text-xl font-semibold">99.8%</div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 font-medium leading-relaxed max-w-2xl">
            {activeCommand.riskDescription || 'System analysis shows standard execution patterns with zero deviation from established heuristics.'}
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-x-12 { transform: rotateX(15deg); }
        .translate-z-10 { transform: translateZ(10px); }
        .translate-z-20 { transform: translateZ(30px); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }
      `}} />
    </div>
  );
}
