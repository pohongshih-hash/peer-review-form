import { useState } from 'react';
import { Bot } from 'lucide-react';
import { INITIAL_STATE, AppState } from './types';
import { STUDENTS, SCHEDULE } from './data';
import PresenterTabs from './components/PresenterTabs';
import PresenterCard from './components/PresenterCard';
import ReflectionCard from './components/ReflectionCard';
import SummaryCard from './components/SummaryCard';

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [currentTab, setCurrentTab] = useState(0); // 0-5 presenters, 6 reflect, 7 summary
  const [showErrors, setShowErrors] = useState(false);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const setPresenterField = (index: number, field: string, value: any) => {
    setState(prev => {
      const newPresenters = [...prev.presenters];
      newPresenters[index] = { ...newPresenters[index], [field]: value };
      return { ...prev, presenters: newPresenters };
    });
  };

  const handleNext = (nextTab: number) => {
    setShowErrors(false);
    setCurrentTab(nextTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pCount = state.presenters.length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-10 relative">
        <div className="bg-indigo-900 rounded-[2rem] p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white opacity-[0.05] rounded-full"></div>
          <div className="relative z-10">
            <h1 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
              <Bot className="w-8 h-8 text-indigo-300" />
              多媒體製作與應用 — 上台報告互評學習單
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-indigo-200">評分者姓名</label>
                <input 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder:text-indigo-200/50 transition-all font-sans"
                  placeholder="請輸入姓名"
                  value={state.raterName}
                  onChange={e => updateState({ raterName: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-indigo-200">座號</label>
                <input 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder:text-indigo-200/50 transition-all font-sans"
                  placeholder="座號"
                  value={state.raterNum}
                  onChange={e => updateState({ raterNum: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-indigo-200">報告日期</label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all font-sans [&>option]:text-slate-800"
                  value={state.date}
                  onChange={e => {
                    const newDate = e.target.value;
                    const scheduledNums = SCHEDULE[newDate] || [];
                    const newPresenters = scheduledNums.length > 0
                      ? scheduledNums.map(num => ({
                          num: String(num),
                          name: STUDENTS[num] || '',
                          topic: '',
                          scores: [0, 0, 0, 0, 0],
                          positive: '',
                          negative: '',
                        }))
                      : Array.from({ length: 6 }, () => ({
                          num: '',
                          name: '',
                          topic: '',
                          scores: [0, 0, 0, 0, 0],
                          positive: '',
                          negative: '',
                        }));
                        
                    updateState({ 
                      date: newDate,
                      presenters: newPresenters,
                      validated: Array(newPresenters.length).fill(false)
                    });
                    setCurrentTab(0);
                    setShowErrors(false);
                  }}
                >
                  <option value="">請選擇</option>
                  <option value="06/03">06/03</option>
                  <option value="06/04">06/04</option>
                  <option value="06/10">06/10</option>
                  <option value="06/11">06/11</option>
                  <option value="06/17">06/17</option>
                  <option value="06/18">06/18</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <PresenterTabs 
          currentTab={currentTab} 
          validated={state.validated} 
          presenterCount={pCount}
          onTabSelect={handleNext} 
        />

        <div className="mt-8">
          {currentTab < pCount && (
            <PresenterCard 
              index={currentTab}
              presenter={state.presenters[currentTab]}
              validated={state.validated}
              totalPresenters={pCount}
              showErrors={showErrors}
              setShowErrors={setShowErrors}
              setPresenterField={setPresenterField}
              onNext={handleNext}
              onSetValidated={(idx, val) => {
                const newVal = [...state.validated];
                newVal[idx] = val;
                updateState({ validated: newVal });
              }}
            />
          )}
          {currentTab === pCount && (
            <ReflectionCard 
              state={state}
              totalPresenters={pCount}
              updateState={updateState}
              showErrors={showErrors}
              setShowErrors={setShowErrors}
              onNext={handleNext}
            />
          )}
          {currentTab === pCount + 1 && (
            <SummaryCard 
              state={state} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

