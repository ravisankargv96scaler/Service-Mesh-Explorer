import React, { useState } from 'react';
import { TabId, TabConfig } from './types';
import { Hexagon, Layers, Activity, Shield, Network, GraduationCap } from 'lucide-react';
import { ProblemTab } from './tabs/Tab1_Problem';
import { SidecarTab } from './tabs/Tab2_Sidecar';
import { ArchitectureTab } from './tabs/Tab3_Architecture';
import { FeaturesTab } from './tabs/Tab4_Features';
import { GatewayTab } from './tabs/Tab5_Gateway';
import { QuizTab } from './tabs/Tab6_Quiz';

const TABS: TabConfig[] = [
  { id: 'problem', label: 'The Problem', icon: Layers },
  { id: 'sidecar', label: 'Sidecar', icon: Hexagon },
  { id: 'architecture', label: 'Architecture', icon: Network },
  { id: 'features', label: 'Features', icon: Shield },
  { id: 'gateway', label: 'Gateway vs Mesh', icon: Activity },
  { id: 'quiz', label: 'Quiz', icon: GraduationCap },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('problem');

  const renderContent = () => {
    switch (activeTab) {
      case 'problem': return <ProblemTab />;
      case 'sidecar': return <SidecarTab />;
      case 'architecture': return <ArchitectureTab />;
      case 'features': return <FeaturesTab />;
      case 'gateway': return <GatewayTab />;
      case 'quiz': return <QuizTab />;
      default: return <ProblemTab />;
    }
  };

  return (
    <div className="min-h-screen bg-mesh-900 text-slate-200 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <Network className="text-white" size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Service Mesh <span className="text-mesh-accent">Explorer</span></h1>
                <p className="text-xs text-slate-400">Interactive Learning Module</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-4">
             <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Documentation</a>
             <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">About</a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 flex flex-col md:flex-row gap-6">
        
        {/* Navigation Sidebar/Top bar */}
        <nav className="md:w-64 flex-shrink-0 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap
                  ${isActive 
                    ? 'bg-slate-800 text-mesh-accent border border-slate-700 shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
                `}
              >
                <Icon size={20} className={isActive ? "text-mesh-accent" : ""} />
                <span className="font-medium text-sm">{tab.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-mesh-accent shadow-[0_0_8px_cyan] hidden md:block"></div>}
              </button>
            );
          })}
        </nav>

        {/* Dynamic Tab Content */}
        <div className="flex-1 bg-slate-950/50 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-2xl overflow-hidden relative min-h-[600px]">
             {/* Background Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
                 style={{ 
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #64748b 1px, transparent 0)', 
                    backgroundSize: '32px 32px' 
                 }}>
            </div>
            
            <div className="relative z-10 h-full">
                {renderContent()}
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;
