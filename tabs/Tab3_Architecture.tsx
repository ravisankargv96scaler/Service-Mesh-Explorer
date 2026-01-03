import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HexNode, SectionTitle, ActionButton } from '../components/Shared';
import { Send, Settings } from 'lucide-react';

export const ArchitectureTab: React.FC = () => {
  const [configVersion, setConfigVersion] = useState(1);
  const [isPushing, setIsPushing] = useState(false);

  const pushConfig = () => {
    if (isPushing) return;
    setIsPushing(true);
    setTimeout(() => {
        setConfigVersion(v => v + 1);
        setIsPushing(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto pr-2 custom-scrollbar">
       <div className="shrink-0">
         <SectionTitle 
            title="Data Plane vs. Control Plane" 
            subtitle="The Control Plane is the brain; the Data Plane (Proxies) is the muscle. One central config updates all proxies."
          />
       </div>

        <div className="flex-1 flex flex-col items-center gap-6 md:gap-8 relative pb-4">
            
            {/* Control Plane (Top) - Compact Version */}
            <div className="w-full max-w-sm bg-slate-800 rounded-xl border-2 border-indigo-500/50 p-4 flex flex-col items-center relative z-20 shadow-lg">
                <div className="absolute -top-3 bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    Control Plane
                </div>
                <div className="flex items-center gap-3 mb-3">
                    <HexNode label="Istiod" type="control" scale={1.0} />
                </div>
                
                <div className="w-full bg-slate-900 p-2 rounded border border-slate-700 font-mono text-[10px] text-slate-400 mb-3 leading-tight">
                    <div className="flex justify-between border-b border-slate-700 pb-1 mb-1">
                        <span>CONFIG.YAML</span>
                        <span className="text-indigo-400 font-bold">v{configVersion}</span>
                    </div>
                    <p>retries: {configVersion * 2}</p>
                    <p>timeout: {300 + configVersion * 50}ms</p>
                    <p>security: mTLS_STRICT</p>
                </div>

                <ActionButton onClick={pushConfig} disabled={isPushing}>
                    <Send size={14} /> <span className="text-sm">{isPushing ? 'Broadcasting...' : 'Push New Config'}</span>
                </ActionButton>
            </div>

            {/* Config Particles Animation - Adjusted for compact layout */}
            {isPushing && (
                <div className="absolute top-32 w-full max-w-2xl h-24 z-10 pointer-events-none">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            className="absolute top-0 left-1/2 w-3 h-3 bg-indigo-500 rounded-sm"
                            initial={{ y: 0, x: '-50%', opacity: 1, scale: 0.8 }}
                            animate={{ 
                                y: 120, 
                                x: i === 1 ? '-50%' : i === 2 ? '200%' : '-300%',
                                opacity: 0 
                            }}
                            transition={{ duration: 1.5, ease: "circIn" }}
                        >
                            <Settings size={12} className="text-white" />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Data Plane (Bottom) - More Compact Grid */}
            <div className="w-full max-w-3xl grid grid-cols-3 gap-3 md:gap-6 relative z-20">
                <div className="col-span-3 text-center mb-1">
                    <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Data Plane (Sidecars)
                    </span>
                </div>
                
                {[1, 2, 3].map((i) => (
                    <motion.div 
                        key={i} 
                        className="flex flex-col items-center bg-slate-800/40 p-3 rounded-lg border border-slate-700"
                        animate={isPushing ? { 
                            borderColor: ['#334155', '#6366f1', '#334155'],
                            scale: [1, 1.03, 1]
                        } : {}}
                        transition={{ delay: 1.2, duration: 0.5 }}
                    >
                        <HexNode label={`Proxy ${i}`} type="proxy" status={isPushing ? 'processing' : 'healthy'} scale={0.75} />
                        <div className="mt-2 text-[10px] font-mono text-slate-500">
                            v<span className={isPushing ? "text-indigo-400" : "text-green-500"}>{isPushing ? '...' : configVersion}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="text-center max-w-md mx-auto">
                <p className="text-[11px] text-slate-500 italic">
                    Note: Sidecars (Data Plane) carry out the actual work, while the Control Plane manages the policy logic.
                </p>
            </div>
        </div>
    </div>
  );
};
