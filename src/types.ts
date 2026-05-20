export interface PresenterData {
  num: string;
  name: string;
  topic: string;
  scores: number[];
  positive: string;
  negative: string;
}

export interface AppState {
  raterName: string;
  raterNum: string;
  date: string;
  presenters: PresenterData[];
  reflect1: string;
  reflect2: string;
  validated: boolean[];
}

export const CRITERIA = [
  { label: '網頁內容完整度', desc: '主題明確、資訊充整、脈絡清楚', creativity: false },
  { label: '網頁視覺設計', desc: '版面美觀、配色協調、排版舒適', creativity: false },
  { label: '互動功能設計', desc: '功能完整、操作直覺、體驗流暢', creativity: false },
  { label: '口頭表達能力', desc: '說明清晰、台風穩健、能回應問題', creativity: false },
  { label: '創意表現', desc: '主題發想獨特、AI 運用有巧思、有個人風格', creativity: true },
];

export const INITIAL_STATE: AppState = {
  raterName: '',
  raterNum: '',
  date: '',
  presenters: Array.from({ length: 6 }, () => ({
    num: '',
    name: '',
    topic: '',
    scores: [0, 0, 0, 0, 0],
    positive: '',
    negative: '',
  })),
  reflect1: '',
  reflect2: '',
  validated: Array(6).fill(false),
};
