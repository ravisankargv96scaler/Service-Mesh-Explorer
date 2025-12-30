import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HexNode, SectionTitle, ActionButton } from '../components/Shared';
import { Play, RotateCcw, ArrowRight } from 'lucide-react';

export const SidecarTab: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Idle, 1: A->Proxy, 2: Process, 3: Proxy->Proxy, 4: Process B, 5: Deliver
  
  const runAnimation = () => {
    setStep(1);
    // Sequence logic
    setTimeout(() => setStep(2), 1000); // Arrive at Proxy A
    setTimeout(() => setStep(3), 2500); // Leave Proxy A (after processing)
    setTimeout(() => setStep(4), 4500); // Arrive Proxy B
    setTimeout(() => setStep(5), 6000); // Leave Proxy B (after check)
    setTimeout(() => setStep(0), 7000); // Done
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <SectionTitle 
          title="The Sidecar Pattern" 
          subtitle="A 'Sidecar' proxy sits next to every application container. The app talks to localhost; the proxy handles the network."
        />
        <div className="flex gap-2">
            <ActionButton onClick={runAnimation} disabled={step !== 0}>
                {step === 0 ? <><Play size={18} /> Send Request</> : <span className="animate-pulse">Running...</span>}
            </ActionButton>
            <ActionButton onClick={() => setStep(0)} disabled={step === 0}>
                <RotateCcw size={18} /> Reset
            </ActionButton>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-8 flex items-center justify-center relative overflow-hidden">
        
        {/* Layout: Pod A and Pod B */}
        <div className="flex w-full justify-between max-w-4xl relative z-10">
            {/* Pod A */}
            <div className="border-2 border-dashed border-slate-600 p-6 rounded-2xl bg-slate-800/50 relative">
                <span className="absolute -top-3 left-4 bg-slate-900 px-2 text-xs text-slate-400 font-mono">POD A (192.168.1.10)</span>
                <div className="flex gap-8 items-center">
                    <HexNode label="App A" type="service" status={step === 1 ? 'processing' : 'idle'} />
                    <div className="w-12 h-1 bg-slate-700 relative"></div>
                    <HexNode label="Proxy A" type="proxy" showProxy status={step >= 2 && step < 3 ? 'processing' : 'healthy'} />
                </div>
            </div>

            {/* Network Space */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
               <div className="h-1 w-full bg-slate-700/30 absolute top-1/2 -translate-y-1/2"></div>
               {step === 3 && (
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-indigo-900/80 px-3 py-1 rounded text-xs text-indigo-200 border border-indigo-500 mb-8"
                 >
                    mTLS Encrypted Tunnel
                 </motion.div>
               )}
            </div>

            {/* Pod B */}
            <div className="border-2 border-dashed border-slate-600 p-6 rounded-2xl bg-slate-800/50 relative">
                <span className="absolute -top-3 right-4 bg-slate-900 px-2 text-xs text-slate-400 font-mono">POD B (192.168.1.20)</span>
                <div className="flex gap-8 items-center">
                    <HexNode label="Proxy B" type="proxy" showProxy status={step >= 4 && step < 5 ? 'processing' : 'healthy'} />
                    <div className="w-12 h-1 bg-slate-700 relative"></div>
                    <HexNode label="App B" type="service" status={step === 5 ? 'healthy' : 'idle'} />
                </div>
            </div>
        </div>

        {/* The Packet Animation */}
        <AnimatePresence>
            {step > 0 && (
                <motion.div
                    className="absolute w-6 h-6 bg-mesh-accent rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)] z-20 flex items-center justify-center"
                    initial={{ left: "20%", top: "50%" }} // Start at App A
                    animate={
                        step === 1 ? { left: "27%", top: "50%" } : // App A -> Proxy A
                        step === 2 ? { left: "27%", scale: [1, 1.5, 1] } : // Processing at Proxy A
                        step === 3 ? { left: "73%", top: "50%" } : // Proxy A -> Proxy B (Network Jump)
                        step === 4 ? { left: "73%", scale: [1, 1.5, 1] } : // Processing at Proxy B
                        step === 5 ? { left: "80%", top: "50%" } : // Proxy B -> App B
                        { opacity: 0 }
                    }
                    transition={{ duration: step === 3 ? 2 : 0.5, ease: "easeInOut" }}
                >
                   <div className="w-2 h-2 bg-white rounded-full"></div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Step Explainer Box */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-700 p-4 rounded-lg shadow-xl w-96 text-center">
            <h4 className="text-mesh-accent font-bold text-sm uppercase mb-1">Current Action</h4>
            <p className="text-slate-300 text-sm h-10">
                {step === 0 && "Ready to simulate request."}
                {step === 1 && "App A tries to send request to Service B..."}
                {step === 2 && "Intercepted! Proxy A adds mTLS certs & tracing headers."}
                {step === 3 && "Request travels securely over the network..."}
                {step === 4 && "Proxy B receives, verifies mTLS, and checks policies."}
                {step === 5 && "Safe! Proxy B forwards cleaned request to App B."}
            </p>
        </div>

      </div>
    </div>
  );
};
