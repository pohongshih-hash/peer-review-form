import { cn } from '../utils';

interface PresenterTabsProps {
  currentTab: number;
  validated: boolean[];
  presenterCount: number;
  onTabSelect: (tab: number) => void;
}

export default function PresenterTabs({ currentTab, validated, presenterCount, onTabSelect }: PresenterTabsProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {Array.from({ length: presenterCount }).map((_, i) => {
        const isDone = validated[i];
        const isActive = currentTab === i;
        return (
          <div
            key={i}
            className={cn(
              "px-5 py-2.5 border rounded-xl text-sm font-semibold transition-all font-sans shadow-sm cursor-default flex items-center justify-center",
              isActive 
                ? "bg-slate-900 text-white border-slate-900" 
                : "bg-white text-slate-500 border-slate-200",
              isDone && !isActive && "outline outline-2 outline-emerald-500 outline-offset-1 text-emerald-700 bg-emerald-50/50 border-emerald-200"
            )}
          >
            報告者 {i + 1}
          </div>
        );
      })}
      
      <div
        className={cn(
          "px-5 py-2.5 border rounded-xl text-sm font-semibold transition-all font-sans shadow-sm cursor-default flex items-center justify-center",
          currentTab === presenterCount ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200"
        )}
      >
        個人反思
      </div>
      
      <div
        className={cn(
          "px-5 py-2.5 border rounded-xl text-sm font-semibold transition-all font-sans shadow-sm cursor-default flex items-center justify-center",
          currentTab === presenterCount + 1 ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200"
        )}
      >
        總覽
      </div>
    </div>
  );
}
