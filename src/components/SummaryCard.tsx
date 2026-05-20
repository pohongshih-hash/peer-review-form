import { useState } from 'react';
import { AppState, CRITERIA } from '../types';
import { BarChart3, Download, Printer, PenTool, Save, CheckCircle2, Calculator } from 'lucide-react';
import { cn } from '../utils';

interface SummaryCardProps {
  state: AppState;
}

export default function SummaryCard({ state }: SummaryCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const rater = state.raterName || '（未填）';
  const rnum = state.raterNum || '（未填）';
  const cls = state.date || '（未選）';

  const avg = state.presenters.length > 0 
    ? ((state.presenters.reduce((acc, p) => acc + p.scores.reduce((a, b) => a + b, 0), 0) / state.presenters.length) * 4).toFixed(1)
    : "0.0";

  const handleExportTxt = () => {
    let txt = `網頁設計課 上台報告互評學習單\n`;
    txt += `評分者：${rater}（座號 ${rnum}）　${cls}\n`;
    txt += `${"═".repeat(40)}\n\n`;
    
    state.presenters.forEach((p, i) => {
      txt += `【報告者 ${i + 1}】\n`;
      txt += `座號：${p.num || "—"}　姓名：${p.name || "—"}　主題：${p.topic || "—"}\n`;
      CRITERIA.forEach((c, j) => {
        txt += `  ${c.label}：${p.scores[j]} 分\n`;
      });
      txt += `  總分：${p.scores.reduce((a, b) => a + b, 0) * 4} / 100 分\n`;
      txt += `  ✦ 值得肯定：${p.positive || "（未填）"}\n`;
      txt += `  ✦ 建議改進：${p.negative || "（未填）"}\n\n`;
    });
    
    txt += `${"═".repeat(40)}\n個人學習反思\n\n`;
    txt += `Q1 今天最讓我印象深刻的報告：\n${state.reflect1 || "（未填）"}\n\n`;
    txt += `Q2 對自己用 AI 製作網頁的新想法：\n${state.reflect2 || "（未填）"}\n`;

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `互評學習單_${rater}_${cls.replace('/', '')}.txt`;
    a.click();
  };

  const handleSaveToSheets = async () => {
    if (!state.raterName.trim() || !state.raterNum.trim()) {
      setErrorMessage('請先回到首頁填寫「評分者姓名」與「座號」再上傳成績。');
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const rows = state.presenters.map(p => {
        return [
          new Date().toLocaleString(),          // Timestamp
          state.date,                          // Date (Class Num)
          state.raterName,                     // Rater Name
          state.raterNum,                      // Rater Num
          p.num,                               // Presenter Num
          p.name,                              // Presenter Name
          p.topic,                             // Presenter Topic
          p.scores[0],                         // Score 1
          p.scores[1],                         // Score 2
          p.scores[2],                         // Score 3
          p.scores[3],                         // Score 4
          p.scores[4],                         // Score 5
          p.scores.reduce((a, b) => a + b, 0) * 4, // Total Score (100)
          p.positive,                          // Positive Feedback
          p.negative,                          // Negative Feedback
          state.reflect1,                      // Reflect 1
          state.reflect2                       // Reflect 2
        ];
      });

      const WEBHOOK_URL = import.meta.env.VITE_GAS_WEBHOOK || '';
      
      if (!WEBHOOK_URL) {
        throw new Error('缺少 Webhook URL。這需要部署一段 Google Apps Script 來做中繼。請見下方說明。');
      }

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          sheetId: '1NAY2hCBqp_J9fXyeQKkNmcvl5Blh2h4QyeH5ghPs7Ro',
          sheetName: 'scorelist',
          values: rows
        })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || '寫入失敗，請檢查 Apps Script 設定');
      }

      setSaveStatus('success');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || '發生未知錯誤');
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-indigo-600" /> 本次互評總覽
      </h3>
      
      <div className="text-sm font-medium text-slate-500 mb-6 bg-slate-50 border border-slate-100 rounded-xl p-4">
        <span className="uppercase tracking-wider text-xs mr-2">評分者資訊</span>
        <strong className="text-slate-900 text-base">{rater}</strong>（座號 {rnum}）　{cls}
      </div>

      <div className="overflow-hidden border border-slate-200 rounded-xl mb-6">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0">
            <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">座號</th>
              <th className="px-6 py-4 font-semibold">姓名</th>
              <th className="px-6 py-4 font-semibold">報告主題</th>
              <th className="px-6 py-4 font-semibold text-center">總分</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {state.presenters.map((p, i) => {
              const t = p.scores.reduce((a, b) => a + b, 0) * 4;
              return (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{p.num || '—'}</td>
                  <td className="px-6 py-4 text-slate-700">{p.name || '—'}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{p.topic || '—'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold font-mono inline-block min-w-14",
                      t >= 80 ? "bg-emerald-50 text-emerald-700" : t >= 60 ? "bg-indigo-50 text-indigo-700" : "bg-rose-50 text-rose-700"
                    )}>
                      {t}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex justify-between items-center mb-8 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-indigo-500" /> 平均總分 (百分制)
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-900">{avg}</span>
          <span className="text-sm font-semibold text-slate-400">/ 100</span>
        </div>
      </div>

      <div className="border-t border-slate-200 mx-4 my-8"></div>
      
      <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <PenTool className="w-5 h-5 text-indigo-600" /> 個人學習反思
      </h3>
      
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">今天最讓我印象深刻的報告</h4>
        <p className={cn("text-sm text-slate-800 leading-relaxed font-medium", !state.reflect1.trim() && "text-slate-400 font-normal italic")}>
          {state.reflect1.trim() || '（未填寫）'}
        </p>
      </div>
      
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 mb-8">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">對自己用 AI 製作網頁的新想法或靈感</h4>
        <p className={cn("text-sm text-slate-800 leading-relaxed font-medium", !state.reflect2.trim() && "text-slate-400 font-normal italic")}>
          {state.reflect2.trim() || '（未填寫）'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={handleExportTxt}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 py-4 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]"
        >
          <Download className="w-4 h-4" /> 匯出學習單
        </button>
        
        <button 
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 py-4 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]"
        >
          <Printer className="w-4 h-4" /> 列印 / PDF
        </button>

        <button 
          onClick={handleSaveToSheets}
          disabled={isSaving || saveStatus === 'success'}
          className={cn(
            "flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-[0.98]",
            saveStatus === 'success' 
              ? "bg-emerald-600 text-white" 
              : "bg-slate-900 text-white hover:bg-indigo-600 disabled:opacity-50"
          )}
        >
          {saveStatus === 'success' ? (
            <><CheckCircle2 className="w-4 h-4" /> 儲存成功</>
          ) : (
            <><Save className="w-4 h-4" /> {isSaving ? '上傳中...' : '上傳成績'}</>
          )}
        </button>
      </div>

      {saveStatus === 'error' && (
        <div className="mt-4 space-y-4">
          <div className="p-4 text-sm font-medium bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-center">
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
}
