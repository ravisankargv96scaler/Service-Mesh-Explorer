import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionTitle } from '../components/Shared';
import { Lock, Unlock, GitMerge } from 'lucide-react';

export const FeaturesTab: React.FC = () => {
  const [mtlsEnabled, setMtlsEnabled] = useState(false);
  const [trafficSplit, setTrafficSplit] = useState(0); // 0 to 100% for V2
  const [requests, setRequests] = useState<{id: number, type: 'v1'|'v2'}[]>([]);

  // Request Generator for Canary Visualizer
  useEffect(() => {
    const interval = setInterval(() => {
      const isV2 = Math.random() * 100 < trafficSplit;
      const newReq = { id: Date.now(), type: isV2 ? 'v2' : 'v1' as 'v1'|'v2' };
      
      setRequests(prev => [...prev.slice(-15), newReq]); // Keep last 15 to avoid DOM overload
    }, 600);
    return () => clearInterval(interval);
  }, [trafficSplit]);

  return (
    <div className="h-full flex flex-col md:flex-row gap-8">
      {/* Controls Panel */}
      <div className="md:w-1/3 space-y-8">
        <SectionTitle 
          title="Power Features" 
          subtitle="Two killer features of a service mesh: Zero-trust security and granular traffic control."
        />

        {/* mTLS Toggle */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                {mtlsEnabled ? <Lock className="text-green-400" size={20}/> : <Unlock className="text-red-400" size={20}/>}
                Mutual TLS (mTLS)
            </h3>
            <p className="text-sm text-slate-400 mb-4">
                Encrypts all traffic between services automatically. No code changes required.
            </p>
            <button 
                onClick={() => setMtlsEnabled(!mtlsEnabled)}
                className={`w-full py-2 rounded-lg font-bold transition-colors ${mtlsEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-600 hover:bg-slate-700'}`}
            >
                {mtlsEnabled ? 'mTLS ENABLED' : 'ENABLE mTLS'}
            </button>
        </div>

        {/* Canary Slider */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <GitMerge className="text-blue-400" size={20}/>
                Canary Deployment
            </h3>
            <p className="text-sm text-slate-400 mb-4">
                Shift traffic gradually from V1 to V2.
            </p>
            <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-blue-400">Service V1: {100 - trafficSplit}%</span>
                <span className="text-green-400">Service V2: {trafficSplit}%</span>
            </div>
            <input 
                type="range" 
                min="0" 
                max="100" 
                value={trafficSplit} 
                onChange={(e) => setTrafficSplit(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-mesh-accent"
            />
        </div>
      </div>

      {/* Visualizer Panel */}
      <div className="md:w-2/3 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex flex-col">
        
        {/* Top Half: mTLS Visual */}
        <div className="flex-1 border-b border-slate-800 flex flex-col items-center justify-center p-4">
            <h4 className="text-xs font-mono text-slate-500 uppercase mb-4">Security Layer</h4>
            <div className="flex justify-between w-full max-w-lg items-center">
                <div className="w-16 h-16 bg-slate-800 border border-slate-600 rounded flex items-center justify-center">Svc A</div>
                
                {/* Connection Line */}
                <div className="flex-1 mx-4 relative h-8 flex items-center">
                    <div className={`w-full h-1 ${mtlsEnabled ? 'bg-green-500' : 'bg-slate-600'} transition-colors duration-500`}></div>
                    
                    {/* Lock Icon animating across */}
                    {mtlsEnabled && (
                         <motion.div 
                            className="absolute top-1/2 -translate-y-1/2 text-green-400 bg-slate-900 p-1 rounded-full border border-green-500"
                            animate={{ left: ["0%", "100%"] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                         >
                            <Lock size={12} />
                         </motion.div>
                    )}
                    {!mtlsEnabled && (
                        <span className="absolute top-[-10px] w-full text-center text-[10px] text-red-400">UNENCRYPTED HTTP</span>
                    )}
                </div>

                <div className="w-16 h-16 bg-slate-800 border border-slate-600 rounded flex items-center justify-center">Svc B</div>
            </div>
        </div>

        {/* Bottom Half: Canary Visual */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
            <h4 className="text-xs font-mono text-slate-500 uppercase mb-4 absolute top-4">Traffic Splitting</h4>
            
            <div className="w-full flex justify-between items-center relative h-32">
                {/* Source */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center z-10">User</div>
                
                {/* Destinations */}
                <div className="absolute right-4 top-4 w-20 h-20 bg-blue-900/30 border-2 border-blue-500 rounded-lg flex flex-col items-center justify-center z-10">
                    <span className="font-bold text-blue-300">V1</span>
                    <span className="text-xs text-blue-400">Stable</span>
                </div>
                <div className="absolute right-4 bottom-4 w-20 h-20 bg-green-900/30 border-2 border-green-500 rounded-lg flex flex-col items-center justify-center z-10">
                    <span className="font-bold text-green-300">V2</span>
                    <span className="text-xs text-green-400">New</span>
                </div>

                {/* Animated Dots */}
                {requests.map(req => (
                    <motion.div
                        key={req.id}
                        className={`absolute w-3 h-3 rounded-full ${req.type === 'v1' ? 'bg-blue-400 shadow-[0_0_10px_blue]' : 'bg-green-400 shadow-[0_0_10px_green]'}`}
                        initial={{ left: '60px', top: '50%' }}
                        animate={{ 
                            left: 'calc(100% - 80px)', 
                            top: req.type === 'v1' ? '20%' : '80%' 
                        }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        onAnimationComplete={() => {
                            // In a real app we'd remove from state here, but for this demo 
                            // we rely on the .slice(-15) in the effect to keep DOM clean.
                        }}
                    />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};
