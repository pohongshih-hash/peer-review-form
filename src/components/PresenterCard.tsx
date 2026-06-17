import { PresenterData, CRITERIA } from '../types';
import { cn } from '../utils';
import { Star, Calculator, ThumbsUp, Lightbulb } from 'lucide-react';

interface PresenterCardProps {
  index: number;
  presenter: PresenterData;
  validated: boolean[];
  totalPresenters: number;
  showErrors: boolean;
  setShowErrors: (s: boolean) => void;
  setPresenterField: (index: number, field: string, value: any) => void;
  onNext: (nextTab: number) => void;
  onSetValidated: (index: number, val: boolean) => void;
}

export default function PresenterCard({
  index, presenter, validated, totalPresenters, showErrors, setShowErrors, setPresenterField, onNext, onSetValidated
}: PresenterCardProps) {
  
  const validate = () => {
    const errors: string[] = [];
    if (!presenter.num.trim()) errors.push("請填寫報告者座號");
    if (!presenter.name.trim()) errors.push("請填寫報告者姓名");
    if (!presenter.topic.trim()) errors.push("請填寫報告主題");
    
    const unscored = CRITERIA.map((_, j) => presenter.scores[j] === 0 ? j : -1).filter(x => x >= 0);
    if (unscored.length) {
      errors.push(`請完成所有評分項目（尚缺：${unscored.map(j => CRITERIA[j].label).join("、")}）`);
    }
    
    if (!presenter.positive.trim()) errors.push("請填寫「值得肯定的地方」");
    if (!presenter.negative.trim()) errors.push("請填寫「建議改進的地方」");
    return errors;
  };

  const handleNextClick = () => {
    const errs = validate();
    if (errs.length > 0) {
      setShowErrors(true);
      return;
    }
    onSetValidated(index, true);
    if (index < totalPresenters - 1) onNext(index + 1);
    else onNext(totalPresenters);
  };

  const total = presenter.scores.reduce((a, b) => a + b, 0);
  const errors = showErrors ? validate() : [];
  
  const hasNumErr = showErrors && !presenter.num.trim();
  const hasNameErr = showErrors && !presenter.name.trim();
  const hasTopicErr = showErrors && !presenter.topic.trim();
  const hasPosErr = showErrors && !presenter.positive.trim();
  const hasNegErr = showErrors && !presenter.negative.trim();

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
      {errors.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm font-medium text-rose-700 mb-6 shadow-sm">
          <strong>請完成以下項目後才能繼續：</strong>
          <div className="mt-1 space-y-1">
            {errors.map((e, i) => <div key={i} className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />{e}</div>)}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">報告者座號</label>
          <input 
            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-500 cursor-not-allowed"
            value={presenter.num}
            readOnly
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">報告者姓名</label>
          <input 
            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-500 cursor-not-allowed"
            value={presenter.name}
            readOnly
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">報告主題</label>
          <input 
            className={cn("w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-800", hasTopicErr ? "border-rose-300 focus:border-rose-500 bg-rose-50/50" : "border-slate-200 focus:border-indigo-500")}
            placeholder="主題名稱"
            value={presenter.topic}
            onChange={e => setPresenterField(index, 'topic', e.target.value)}
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Star className="w-5 h-5 text-indigo-600" /> 評分項目（每項 1–5 分，共 25 分）
        </h3>
        
        <div className="space-y-0 divide-y divide-slate-100">
          {CRITERIA.map((c, j) => {
            const score = presenter.scores[j];
            const noScore = showErrors && score === 0;
            
            return (
              <div key={j} className="grid grid-cols-[1fr_auto] items-center gap-4 py-4">
                <div>
                  <div className={cn("text-sm font-semibold flex items-center gap-2", noScore ? "text-rose-600" : "text-slate-800")}>
                    {c.label}
                    {c.creativity && <span className="bg-amber-100 text-amber-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">創意</span>}
                  </div>
                  <div className={cn("text-xs mt-1 font-medium", noScore ? "text-rose-400" : "text-slate-500")}>{c.desc}</div>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(k => (
                    <button
                      key={k}
                      onClick={() => {
                        const newScores = [...presenter.scores];
                        newScores[j] = score === k ? 0 : k;
                        setPresenterField(index, 'scores', newScores);
                      }}
                      className={cn(
                        "w-9 h-9 rounded-xl border-2 text-sm font-bold flex items-center justify-center transition-all focus:outline-none shadow-sm active:scale-95",
                        score >= k 
                          ? "bg-slate-900 border-slate-900 text-white" 
                          : "bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600",
                        noScore && score < k && "border-rose-300 text-rose-400 bg-rose-50/50"
                      )}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex justify-between items-center mb-8 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-indigo-500" /> 總分 (百分制)
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-slate-900">{total * 4}</span>
          <span className="text-sm font-semibold text-slate-400">/ 100 分</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 self-start border border-emerald-100 shadow-sm">
            <ThumbsUp className="w-4 h-4" /> 值得肯定的地方
          </label>
          <textarea 
            className={cn("w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-800 resize-y min-h-[100px]", hasPosErr ? "border-rose-300 focus:border-rose-500 bg-rose-50/50" : "border-slate-200 focus:border-indigo-500")}
            placeholder="寫下優點或做得好的地方…"
            value={presenter.positive}
            onChange={e => setPresenterField(index, 'positive', e.target.value)}
          />
        </div>
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 self-start border border-orange-100 shadow-sm">
            <Lightbulb className="w-4 h-4" /> 建議改進的地方
          </label>
          <textarea 
            className={cn("w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-800 resize-y min-h-[100px]", hasNegErr ? "border-rose-300 focus:border-rose-500 bg-rose-50/50" : "border-slate-200 focus:border-indigo-500")}
            placeholder="提供建設性的改進建議…"
            value={presenter.negative}
            onChange={e => setPresenterField(index, 'negative', e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
        <button 
          onClick={() => onNext(index - 1)}
          disabled={index === 0}
          className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-sm bg-white"
        >
          ← 上一位
        </button>
        <div className="flex gap-2 hidden sm:flex">
          {Array.from({ length: totalPresenters }).map((_, i) => (
            <div key={i} className={cn("w-2 h-2 rounded-full transition-all duration-300", validated[i] ? "bg-emerald-500" : index === i ? "bg-slate-900 scale-125" : "bg-slate-200")} />
          ))}
        </div>
        <button 
          onClick={handleNextClick}
          className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-lg"
        >
          {index === totalPresenters - 1 ? "完成 →" : "下一位 →"}
        </button>
      </div>
    </div>
  );
}
