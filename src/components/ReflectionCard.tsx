import { AppState } from '../types';
import { cn } from '../utils';
import { PenTool } from 'lucide-react';

interface ReflectionCardProps {
  state: AppState;
  totalPresenters: number;
  showErrors: boolean;
  setShowErrors: (s: boolean) => void;
  updateState: (updates: Partial<AppState>) => void;
  onNext: (nextTab: number) => void;
}

export default function ReflectionCard({ state, totalPresenters, showErrors, setShowErrors, updateState, onNext }: ReflectionCardProps) {
  const r1err = showErrors && !state.reflect1.trim();
  const r2err = showErrors && !state.reflect2.trim();

  const handleNextClick = () => {
    if (!state.reflect1.trim() || !state.reflect2.trim()) {
      setShowErrors(true);
      return;
    }
    onNext(totalPresenters + 1);
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-8 flex items-center gap-2">
        <PenTool className="w-5 h-5 text-indigo-600" /> 個人學習反思
      </h3>
      
      {showErrors && (r1err || r2err) && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm font-medium text-rose-700 mb-6 shadow-sm">
          請完成所有反思問題後才能進入總覽。
        </div>
      )}
      
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">今天最讓我印象深刻的報告是哪一個？它的創意或 AI 運用方式有什麼特別之處？</p>
          <textarea 
            className={cn("w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-y min-h-[120px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal", r1err ? "border-rose-300 focus:border-rose-500 bg-rose-50/50" : "border-slate-200 focus:border-indigo-500")}
            placeholder="寫下你的想法…"
            value={state.reflect1}
            onChange={e => updateState({ reflect1: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">看完今天的報告，你對自己用 AI 製作網頁有什麼新的想法或靈感？</p>
          <textarea 
            className={cn("w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-y min-h-[120px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal", r2err ? "border-rose-300 focus:border-rose-500 bg-rose-50/50" : "border-slate-200 focus:border-indigo-500")}
            placeholder="寫下你的學習收穫…"
            value={state.reflect2}
            onChange={e => updateState({ reflect2: e.target.value })}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
        <button 
          onClick={() => onNext(totalPresenters - 1)}
          className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm bg-white"
        >
          ← 返回評分
        </button>
        <button 
          onClick={handleNextClick}
          className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-lg"
        >
          查看總覽 →
        </button>
      </div>
    </div>
  );
}
