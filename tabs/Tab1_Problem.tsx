import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HexNode, SectionTitle, ActionButton } from '../components/Shared';
import { Network, Shuffle } from 'lucide-react';

const SERVICE_POSITIONS = [
  { id: 'A', x: 50, y: 10 },
  { id: 'B', x: 90, y: 40 },
  { id: 'C', x: 80, y: 90 },
  { id: 'D', x: 20, y: 90 },
  { id: 'E', x: 10, y: 40 },
  { id: 'F', x: 50, y: 50 }, // Central-ish service
];

export const ProblemTab: React.FC = () => {
  const [isMeshEnabled, setIsMeshEnabled] = useState(false);
  const [failedConnections, setFailedConnections] = useState<number[]>([]);

  // Simulate random failures in Chaos mode
  useEffect(() => {
    if (isMeshEnabled) {
      setFailedConnections([]);
      return;
    }
    const interval = setInterval(() => {
      // Randomly pick a few lines to "fail"
      const failures = [1, 2, 3].map(() => Math.floor(Math.random() * 15));
      setFailedConnections(failures);
    }, 1500);
    return () => clearInterval(interval);
  }, [isMeshEnabled]);

  // Generate chaotic connections
  const chaosLines = [];
  let lineId = 0;
  for (let i = 0; i < SERVICE_POSITIONS.length; i++) {
    for (let j = i + 1; j < SERVICE_POSITIONS.length; j++) {
      const start = SERVICE_POSITIONS[i];
      const end = SERVICE_POSITIONS[j];
      const isFailed = failedConnections.includes(lineId);
      
      chaosLines.push(
        <motion.line
          key={`chaos-${i}-${j}`}
          x1={`${start.x}%`}
          y1={`${start.y}%`}
          x2={`${end.x}%`}
          y2={`${end.y}%`}
          stroke={isFailed ? '#ef4444' : '#64748b'} // Red if failed, slate if normal
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            strokeDasharray: isFailed ? "5,5" : "0",
          }}
          transition={{ duration: 1 }}
          className={isFailed ? "z-50" : "z-0"}
        />
      );
      lineId++;
    }
  }

  // Generate Ordered Lines (Mesh Mode) - All connect to a conceptual center or clean path
  // For visual simplicity, we connect them in a ring and show them monitored
  const meshLines = SERVICE_POSITIONS.map((pos, i) => {
    const next = SERVICE_POSITIONS[(i + 1) % SERVICE_POSITIONS.length];
    return (
      <motion.line
        key={`mesh-${i}`}
        x1={`${pos.x}%`}
        y1={`${pos.y}%`}
        x2={`${next.x}%`}
        y2={`${next.y}%`}
        stroke="#22c55e"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
    );
  });

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3 space-y-6">
        <SectionTitle 
          title="The Microservice Chaos" 
          subtitle="Without a mesh, services communicate ad-hoc. Failures are hard to trace, and the network topology is messy."
        />
        
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <h3 className="font-bold mb-2 text-indigo-400">Analogy: Air Traffic Control</h3>
          <p className="text-sm text-slate-300 mb-4">
            Imagine every pilot talking to every other pilot directly to coordinate landings. That's chaos.
            A Service Mesh is like Air Traffic Control—managed, monitored, and safe.
          </p>
        </div>

        <div className="flex gap-4">
            <ActionButton 
                active={!isMeshEnabled} 
                onClick={() => setIsMeshEnabled(false)}
            >
                <Shuffle size={18} /> Chaos Mode
            </ActionButton>
            <ActionButton 
                active={isMeshEnabled} 
                onClick={() => setIsMeshEnabled(true)}
            >
                <Network size={18} /> Mesh Enabled
            </ActionButton>
        </div>

        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${isMeshEnabled ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                <span className="font-mono text-sm">Network Status: {isMeshEnabled ? 'MANAGED' : 'UNSTABLE'}</span>
            </div>
            {isMeshEnabled && (
                <div className="text-xs text-green-400 font-mono">
                    > Sidecars Injected: 6/6<br/>
                    > mTLS: Enabled<br/>
                    > Observability: 100%
                </div>
            )}
            {!isMeshEnabled && (
                <div className="text-xs text-red-400 font-mono">
                    > Connection Reset (Svc A->C)<br/>
                    > Latency Spike detected<br/>
                    > No visibility into errors
                </div>
            )}
        </div>
      </div>

      <div className="md:w-2/3 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden min-h-[400px]">
        {/* SVG Overlay for Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {isMeshEnabled ? meshLines : chaosLines}
        </svg>

        {/* Nodes */}
        {SERVICE_POSITIONS.map((pos) => (
          <div 
            key={pos.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
            style={{ 
              left: `${pos.x}%`, 
              top: `${pos.y}%` 
            }}
          >
            <HexNode 
              label={`Svc ${pos.id}`} 
              showProxy={isMeshEnabled} 
              status={isMeshEnabled ? 'healthy' : (Math.random() > 0.7 ? 'error' : 'idle')}
              scale={0.8}
            />
          </div>
        ))}

        {isMeshEnabled && (
            <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
            >
                <div className="w-64 h-64 rounded-full border border-indigo-500/30 bg-indigo-500/5 animate-pulse-slow"></div>
            </motion.div>
        )}
      </div>
    </div>
  );
};
