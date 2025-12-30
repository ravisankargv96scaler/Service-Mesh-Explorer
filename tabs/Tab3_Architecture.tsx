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
    <div className="h-full flex flex-col">
       <SectionTitle 
          title="Data Plane vs. Control Plane" 
          subtitle="The Control Plane is the brain; the Data Plane (Proxies) is the muscle. You configure the brain, and it updates all muscles instantly."
        />

        <div className="flex-1 flex flex-col items-center gap-12 relative">
            
            {/* Control Plane (Top) */}
            <div className="w-full max-w-md bg-slate-800 rounded-xl border-2 border-indigo-500/50 p-6 flex flex-col items-center relative z-20 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                <div className="absolute -top-3 bg-indigo-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                    Control Plane
                </div>
                <div className="flex items-center gap-4 mb-4">
                    <HexNode label="Istiod / Pilot" type="control" scale={1.2} />
                </div>
                
                <div className="w-full bg-slate-900 p-3 rounded border border-slate-700 font-mono text-xs text-slate-400 mb-4">
                    <div className="flex justify-between border-b border-slate-700 pb-1 mb-1">
                        <span>CONFIG.YAML</span>
                        <span className="text-indigo-400">v{configVersion}</span>
                    </div>
                    <p>retries: {configVersion * 2}</p>
                    <p>timeout: {300 + configVersion * 50}ms</p>
                    <p>mtls_mode: STRICT</p>
                </div>

                <ActionButton onClick={pushConfig} disabled={isPushing}>
                    <Send size={16} /> {isPushing ? 'Broadcasting...' : 'Push New Config'}
                </ActionButton>
            </div>

            {/* Config Particles Animation */}
            {isPushing && (
                <div className="absolute top-48 w-full max-w-3xl h-32 z-10 pointer-events-none">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            className="absolute top-0 left-1/2 w-4 h-4 bg-indigo-500 rounded-sm"
                            initial={{ y: 0, x: '-50%', opacity: 1, scale: 1 }}
                            animate={{ 
                                y: 150, 
                                x: i === 1 ? '-50%' : i === 2 ? '150%' : '-250%',
                                opacity: 0 
                            }}
                            transition={{ duration: 1.5, ease: "circIn" }}
                        >
                            <Settings size={16} className="text-white" />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Data Plane (Bottom) */}
            <div className="w-full max-w-4xl grid grid-cols-3 gap-8 relative z-20">
                <div className="col-span-3 text-center mb-2">
                    <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        Data Plane (Sidecars)
                    </span>
                </div>
                
                {[1, 2, 3].map((i) => (
                    <motion.div 
                        key={i} 
                        className="flex flex-col items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700"
                        animate={isPushing ? { 
                            borderColor: ['#334155', '#6366f1', '#334155'],
                            scale: [1, 1.05, 1]
                        } : {}}
                        transition={{ delay: 1.2, duration: 0.5 }}
                    >
                        <HexNode label={`Proxy ${i}`} type="proxy" status={isPushing ? 'processing' : 'healthy'} />
                        <div className="mt-4 text-xs font-mono text-slate-400">
                            Config Version: <span className="text-green-400">v{isPushing ? '...' : configVersion}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

        </div>
    </div>
  );
};
