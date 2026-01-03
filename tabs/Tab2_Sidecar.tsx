import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HexNode, SectionTitle, ActionButton } from '../components/Shared';
import { Play, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';

export const SidecarTab: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Idle, 1: A->Proxy, 2: Process, 3: Proxy->Proxy, 4: Process B, 5: Deliver
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const timeouts = useRef<number[]>([]);

  const clearTimers = () => {
    timeouts.current.forEach(t => window.clearTimeout(t));
    timeouts.current = [];
    setIsAutoPlaying(false);
  };

  const runAnimation = () => {
    clearTimers();
    setIsAutoPlaying(true);
    setStep(1);
    
    const t1 = window.setTimeout(() => setStep(2), 1000);
    const t2 = window.setTimeout(() => setStep(3), 2500);
    const t3 = window.setTimeout(() => setStep(4), 4500);
    const t4 = window.setTimeout(() => setStep(5), 6000);
    const t5 = window.setTimeout(() => {
      setStep(0);
      setIsAutoPlaying(false);
    }, 7500);

    timeouts.current = [t1, t2, t3, t4, t5];
  };

  const nextStep = () => {
    clearTimers();
    setStep(prev => (prev < 5 ? prev + 1 : 0));
  };

  const prevStep = () => {
    clearTimers();
    setStep(prev => (prev > 0 ? prev - 1 : 0));
  };

  const reset = () => {
    clearTimers();
    setStep(0);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pr-2">
      <div className="flex flex-col xl:flex-row justify-between items-start mb-6 gap-4">
        <SectionTitle 
          title="The Sidecar Pattern" 
          subtitle="A 'Sidecar' proxy sits next to every application container. The app talks to localhost; the proxy handles the network."
        />
        <div className="flex flex-wrap gap-2 shrink-0">
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button 
                onClick={prevStep}
                disabled={step === 0}
                className="p-2 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-30 transition-colors"
                title="Previous Step"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-3 flex items-center text-xs font-mono text-slate-400 border-x border-slate-700">
                Step {step}/5
              </div>
              <button 
                onClick={nextStep}
                className="p-2 hover:bg-slate-700 rounded text-slate-300 transition-colors"
                title="Next Step"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <ActionButton onClick={runAnimation} disabled={isAutoPlaying}>
                {isAutoPlaying ? <span className="animate-pulse">Auto-playing...</span> : <><Play size={18} /> Auto Play</>}
            </ActionButton>
            
            <ActionButton onClick={reset} disabled={step === 0 && !isAutoPlaying}>
                <RotateCcw size={18} /> Reset
            </ActionButton>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-4 md:p-8 flex items-center justify-center relative overflow-hidden min-h-[400px]">
        
        {/* Layout: Pod A and Pod B */}
        <div className="flex w-full justify-between max-w-4xl relative z-10 gap-2">
            {/* Pod A */}
            <div className="border-2 border-dashed border-slate-600 p-4 md:p-6 rounded-2xl bg-slate-800/50 relative">
                <span className="absolute -top-3 left-4 bg-slate-900 px-2 text-[10px] md:text-xs text-slate-400 font-mono">POD A (192.168.1.10)</span>
                <div className="flex gap-4 md:gap-8 items-center">
                    <HexNode label="App A" type="service" status={step === 1 ? 'processing' : 'idle'} scale={0.9} />
                    <div className="w-8 md:w-12 h-1 bg-slate-700 relative"></div>
                    <HexNode label="Proxy A" type="proxy" showProxy status={step >= 2 && step < 3 ? 'processing' : 'healthy'} scale={0.9} />
                </div>
            </div>

            {/* Network Space */}
            <div className="flex-1 flex flex-col items-center justify-center relative min-w-[40px]">
               <div className="h-1 w-full bg-slate-700/30 absolute top-1/2 -translate-y-1/2"></div>
               <AnimatePresence>
                 {step === 3 && (
                   <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-indigo-900/80 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs text-indigo-200 border border-indigo-500 mb-12 whitespace-nowrap"
                   >
                      mTLS Encrypted Tunnel
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Pod B */}
            <div className="border-2 border-dashed border-slate-600 p-4 md:p-6 rounded-2xl bg-slate-800/50 relative">
                <span className="absolute -top-3 right-4 bg-slate-900 px-2 text-[10px] md:text-xs text-slate-400 font-mono">POD B (192.168.1.20)</span>
                <div className="flex gap-4 md:gap-8 items-center">
                    <HexNode label="Proxy B" type="proxy" showProxy status={step >= 4 && step < 5 ? 'processing' : 'healthy'} scale={0.9} />
                    <div className="w-8 md:w-12 h-1 bg-slate-700 relative"></div>
                    <HexNode label="App B" type="service" status={step === 5 ? 'healthy' : 'idle'} scale={0.9} />
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
                        step === 1 ? { left: "26%", top: "50%" } : // App A -> Proxy A
                        step === 2 ? { left: "26%", scale: [1, 1.4, 1] } : // Processing at Proxy A
                        step === 3 ? { left: "74%", top: "50%" } : // Proxy A -> Proxy B (Network Jump)
                        step === 4 ? { left: "74%", scale: [1, 1.4, 1] } : // Processing at Proxy B
                        step === 5 ? { left: "80%", top: "50%" } : // Proxy B -> App B
                        { opacity: 0 }
                    }
                    transition={{ duration: step === 3 ? 1.2 : 0.4, ease: "easeInOut" }}
                >
                   <div className="w-2 h-2 bg-white rounded-full"></div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Step Explainer Box */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur border border-slate-700 p-4 rounded-lg shadow-xl w-[90%] md:w-96 text-center z-30">
            <h4 className="text-mesh-accent font-bold text-xs uppercase mb-1">Step {step}: {step === 0 ? 'Standby' : step === 3 ? 'In Transit' : 'Local Interaction'}</h4>
            <p className="text-slate-300 text-sm h-12 flex items-center justify-center">
                {step === 0 && "Ready to simulate request. Click Next or Auto Play."}
                {step === 1 && "App A initiates a request to Service B's virtual address."}
                {step === 2 && "Intercepted! Proxy A adds authentication and routing metadata."}
                {step === 3 && "Request travels securely via mTLS through the cluster network."}
                {step === 4 && "Proxy B receives, terminates TLS, and enforces local policies."}
                {step === 5 && "Safe! Proxy B hands off the request to the local App B process."}
            </p>
        </div>

      </div>
    </div>
  );
};
