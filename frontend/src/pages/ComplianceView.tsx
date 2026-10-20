import React, { useState } from 'react';
import { 
  Scale, 
  Plus 
} from 'lucide-react';
import { initialComplianceRules } from '../services/mockData';
import type { ComplianceRule } from '../types';
import { Badge } from '../components/common/Badge';
import { MilestoneNotice } from '../components/common/MilestoneNotice';

export const ComplianceView: React.FC = () => {
  const [rules, setRules] = useState<ComplianceRule[]>(initialComplianceRules);

  const toggleRuleActive = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <MilestoneNotice
        currentMilestone="Milestone 2 Frontend Prototype"
        plannedMilestone="Milestone 9 (FastAPI Declarative Rules Engine)"
        description="Configure KYC policy criteria, age thresholds, document expiration rules, and image tamper tolerances."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-500" />
            <span>Configurable Regulatory Compliance Rules</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Define declarative verification policies, severity thresholds, and KYC compliance criteria.
          </p>
        </div>

        <button
          onClick={() => alert('Rule creation wizard will be connected to FastAPI in Milestone 9.')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Policy Rule</span>
        </button>
      </div>

      {/* Rules Engine Cards */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-2xl border transition-all duration-150 ${
              rule.isActive
                ? 'border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs'
                : 'border-slate-200/40 dark:border-slate-800/40 bg-slate-100/40 dark:bg-slate-950/40 opacity-70'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                    {rule.code}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {rule.name}
                  </h4>
                  <Badge status={rule.severity} size="sm" />
                  <span className="text-xs text-slate-400">Category: {rule.category}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                  {rule.description}
                </p>
              </div>

              {/* Status Switch */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-medium text-slate-500">
                  {rule.isActive ? 'Active' : 'Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleRuleActive(rule.id)}
                  aria-label="Toggle rule active state"
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    rule.isActive ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      rule.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
