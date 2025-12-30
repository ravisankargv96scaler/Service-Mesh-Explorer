import React from 'react';
import { motion } from 'framer-motion';
import { Server, Shield, Activity, Box } from 'lucide-react';

interface HexNodeProps {
  label: string;
  type?: 'service' | 'proxy' | 'control' | 'gateway';
  status?: 'healthy' | 'error' | 'processing' | 'idle';
  showProxy?: boolean;
  scale?: number;
  className?: string;
}

export const HexNode: React.FC<HexNodeProps> = ({ 
  label, 
  type = 'service', 
  status = 'idle', 
  showProxy = false,
  scale = 1,
  className = ''
}) => {
  const getColors = () => {
    if (status === 'error') return 'border-red-500 bg-red-900/20 text-red-400';
    if (status === 'processing') return 'border-mesh-accent bg-mesh-accent/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]';
    if (status === 'healthy') return 'border-green-500 bg-green-900/20 text-green-400';
    return 'border-slate-600 bg-slate-800 text-slate-300';
  };

  const Icon = type === 'control' ? Activity : type === 'gateway' ? Server : Box;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`} style={{ transform: `scale(${scale})` }}>
      {/* Main Hexagon Shape using CSS Clip Path */}
      <motion.div 
        layout
        className={`w-24 h-24 flex items-center justify-center border-2 ${getColors()} transition-all duration-500 rounded-xl relative z-10`}
      >
        <div className="flex flex-col items-center gap-1">
          <Icon size={24} />
          <span className="text-xs font-bold font-mono">{label}</span>
        </div>
      </motion.div>

      {/* Sidecar Proxy Attachment */}
      {showProxy && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute -right-4 -bottom-2 z-20"
        >
          <div className="w-10 h-10 bg-indigo-900 border-2 border-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
            <Shield size={16} className="text-indigo-300" />
          </div>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-indigo-300 font-mono">Proxy</span>
        </motion.div>
      )}
    </div>
  );
};

export const SectionTitle: React.FC<{ title: string, subtitle: string }> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p className="text-slate-400">{subtitle}</p>
  </div>
);

export const ActionButton: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  active?: boolean;
  disabled?: boolean;
}> = ({ onClick, children, active, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
      ${active 
        ? 'bg-mesh-accent text-mesh-900 shadow-lg shadow-cyan-500/20' 
        : 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    {children}
  </button>
);
