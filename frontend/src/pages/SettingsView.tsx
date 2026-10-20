import React, { useState } from 'react';
import { 
  Settings, 
  Cpu, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Database 
} from 'lucide-react';
import { MilestoneNotice } from '../components/common/MilestoneNotice';

export const SettingsView: React.FC = () => {
  const [ocrThreshold, setOcrThreshold] = useState(80);
  const [minAge, setMinAge] = useState(18);
  const [simulatedLatency, setSimulatedLatency] = useState(400);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <MilestoneNotice
        currentMilestone="Milestone 2 Frontend Configuration"
        plannedMilestone="Milestone 5 (FastAPI Settings & Environment Core)"
        description="Configuration parameters will be synchronized with backend Pydantic Settings and SQLite storage."
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-500" />
            <span>Platform Heuristics & Verification Settings</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Calibrate OCR thresholds, simulated registry latency, and default compliance policies.
          </p>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved changes
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        {/* Card 1: OCR Calibration */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Cpu className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Document Ingestion & OCR Parameters
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Minimum Character Confidence Threshold
              </label>
              <span className="font-mono font-bold text-sky-500">{ocrThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={ocrThreshold}
              onChange={(e) => setOcrThreshold(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Fields extracted with an OCR confidence rating lower than this threshold will be flagged for human review.
            </p>
          </div>
        </div>

        {/* Card 2: Simulated Registry Settings */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Database className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Simulated Registry Adapter Controls
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Simulated Registry Network Latency
              </label>
              <span className="font-mono font-bold text-indigo-500">{simulatedLatency} ms</span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="50"
              value={simulatedLatency}
              onChange={(e) => setSimulatedLatency(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Simulates realistic network delay when querying external identity databases in testing environments.
            </p>
          </div>
        </div>

        {/* Card 3: Regulatory Compliance Baseline */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Compliance Policy Defaults
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Default Minimum Legal Age (KYC-AGE-18)
              </label>
              <span className="font-mono font-bold text-emerald-500">{minAge} years</span>
            </div>
            <input
              type="number"
              min="16"
              max="25"
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              className="w-32 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration Baseline</span>
        </button>
      </form>
    </div>
  );
};
