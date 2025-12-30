import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionTitle, ActionButton, HexNode } from '../components/Shared';
import { Globe, ArrowDown, ArrowRight } from 'lucide-react';

export const GatewayTab: React.FC = () => {
  const [activeFlow, setActiveFlow] = useState<'external' | 'internal' | null>(null);

  return (
    <div className="h-full flex flex-col">
       <div className="flex justify-between items-start mb-6">
        <SectionTitle 
            title="Gateway vs. Mesh" 
            subtitle="Confusion often exists between these. Gateway = Entrance (North/South). Mesh = Internal communication (East/West)."
        />
        <div className="flex gap-2">
            <ActionButton 
                onClick={() => setActiveFlow('external')} 
                active={activeFlow === 'external'}
            >
                <Globe size={18} /> External Req
            </ActionButton>
            <ActionButton 
                onClick={() => setActiveFlow('internal')} 
                active={activeFlow === 'internal'}
            >
                <ArrowRight size={18} /> Internal Call
            </ActionButton>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 relative p-8 flex flex-col items-center">
        
        {/* External World */}
        <div className="w-full flex justify-center mb-8 relative z-20">
            <div className="bg-slate-950 px-6 py-2 rounded-full border border-slate-700 flex items-center gap-2">
                <Globe size={16} className="text-blue-400" />
                <span className="text-sm text-slate-400">Public Internet</span>
            </div>
        </div>

        {/* Boundary Line */}
        <div className="w-full border-t border-dashed border-slate-600 absolute top-24 left-0"></div>
        <span className="absolute top-20 right-4 text-xs text-slate-500 font-mono bg-slate-900 px-2">Cluster Boundary</span>

        {/* Architecture */}
        <div className="w-full max-w-3xl grid grid-cols-2 gap-12 mt-4">
            
            {/* North-South Path */}
            <div className="flex flex-col items-center gap-8 relative">
                 {/* The Flow Line */}
                 {activeFlow === 'external' && (
                    <motion.div 
                        className="absolute w-1 bg-blue-500/50 z-0 h-full left-1/2 -translate-x-1/2"
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ duration: 0.5 }}
                    />
                )}
                
                <HexNode label="API Gateway" type="gateway" scale={1.2} className="z-10 bg-slate-900" />
                
                <div className="h-16 border-l-2 border-slate-700 border-dashed"></div>

                <div className="flex gap-8">
                     <HexNode label="Frontend" type="service" className="z-10 bg-slate-900" />
                </div>
            </div>

            {/* East-West Path */}
            <div className="flex flex-col items-center justify-center relative">
                 <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 w-full flex flex-col items-center gap-8">
                    <h4 className="text-mesh-accent font-mono text-sm mb-4">Internal Mesh (East-West)</h4>
                    
                    <div className="flex items-center gap-12 relative w-full justify-center">
                        <HexNode label="Svc A" type="service" showProxy />
                        
                        {/* Connection */}
                        <div className="flex-1 h-1 bg-slate-700 mx-2 relative">
                            {activeFlow === 'internal' && (
                                <motion.div 
                                    className="absolute inset-0 bg-green-500 shadow-[0_0_10px_green]"
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                                />
                            )}
                        </div>

                        <HexNode label="Svc B" type="service" showProxy />
                    </div>
                 </div>
            </div>
        </div>

        {/* Description Toast */}
        <div className="absolute bottom-6 bg-slate-800 p-4 rounded-lg border border-slate-600 shadow-xl max-w-lg text-center">
            {activeFlow === 'external' ? (
                <p className="text-blue-300 text-sm">
                    <strong className="block text-white mb-1">North-South Traffic</strong>
                    The User enters via the <strong>API Gateway</strong>. It handles auth, rate limiting, and routing for the <em>edge</em> of the cluster.
                </p>
            ) : activeFlow === 'internal' ? (
                <p className="text-green-300 text-sm">
                    <strong className="block text-white mb-1">East-West Traffic</strong>
                    Service A talks to Service B deep inside the cluster. The <strong>Service Mesh</strong> manages this connection (mTLS, retries, observability).
                </p>
            ) : (
                <p className="text-slate-400 text-sm">Select a flow to visualize the difference.</p>
            )}
        </div>

      </div>
    </div>
  );
};
