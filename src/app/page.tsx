"use client";

import React, { useState, useEffect } from "react";

type EmotionType = "very_good" | "peaceful" | "neutral" | "sad" | "stressed";

interface EmotionItem {
  id: EmotionType;
  label: string;
  emoji: string;
}

const EMOTIONS: EmotionItem[] = [
  { id: "very_good", label: "아주 좋음", emoji: "🥰" },
  { id: "peaceful", label: "평온함", emoji: "😌" },
  { id: "neutral", label: "그저 그럼", emoji: "😐" },
  { id: "sad", label: "슬픔", emoji: "😢" },
  { id: "stressed", label: "스트레스", emoji: "🤯" },
];

interface AnalysisResult {
  dominantEmotion: EmotionType;
  emotionScore: number;
  sentimentBreakdown: {
    peaceful: number;
    positive: number;
    reflective: number;
  };
  sentimentBreakdownLabel: string;
  keySentimentSentence: string;
  prescription: string;
  recommendedBgm: string;
  recommendedTea: string;
}

interface DiaryRecord {
  rowIndex?: number;
  timestamp: string | number;
  datetime: string;
  content: string;
}

export default function DiaryJournalPage() {
  const [diaryText, setDiaryText] = useState<string>("");
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [aiSelectedEmotion, setAiSelectedEmotion] = useState<EmotionType | null>(null);
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [currentDateFormatted, setCurrentDateFormatted] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // 일기 목록 모달 및 CRUD 상태
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const [diaryList, setDiaryList] = useState<DiaryRecord[]>([]);
  const [isFetchingList, setIsFetchingList] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editingTimestamp, setEditingTimestamp] = useState<string | number | null>(null);
  const [editContentText, setEditContentText] = useState<string>("");

  // 날짜/요일/시간 실시간 업데이트
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      const dayName = days[now.getDay()];
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      setCurrentDateFormatted(`${year}년 ${month}월 ${date}일 (${dayName})`);
      setCurrentTimeStr(`${hours}:${minutes}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // 1. 일기 저장 (Create)
  const handleSaveDiary = async () => {
    if (!diaryText.trim()) {
      alert("저장할 일기 내용을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      const fullDateTime = `${currentDateFormatted} ${currentTimeStr}`;
      const res = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          timestamp: Date.now().toString(),
          datetime: fullDateTime,
          content: diaryText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "일기 저장에 실패했습니다.");
      }

      alert("구글 시트에 일기가 성공적으로 저장되었습니다!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "구글 시트 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 2. 일기 목록 조회 (Read)
  const fetchDiaryList = async () => {
    setIsFetchingList(true);
    try {
      const res = await fetch("/api/diary?action=read");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "일기 목록을 불러오지 못했습니다.");
      }

      // 최신순으로 정렬 (역순)
      const list: DiaryRecord[] = Array.isArray(data.data) ? [...data.data].reverse() : [];
      setDiaryList(list);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "목록 불러오기 중 오류가 발생했습니다.");
    } finally {
      setIsFetchingList(false);
    }
  };

  // [일기보기] 버튼 클릭 핸들러
  const handleOpenDiaryList = () => {
    setIsListModalOpen(true);
    fetchDiaryList();
  };

  // 3. 일기 수정 (Update)
  const handleUpdateDiary = async (timestamp: string | number) => {
    if (!editContentText.trim()) {
      alert("수정할 내용을 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          timestamp: String(timestamp),
          content: editContentText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "일기 수정에 실패했습니다.");
      }

      alert("일기가 수정되었습니다.");
      setEditingTimestamp(null);
      fetchDiaryList();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "수정 중 오류가 발생했습니다.");
    }
  };

  // 4. 일기 삭제 (Delete)
  const handleDeleteDiary = async (timestamp: string | number) => {
    if (!confirm("이 일기를 삭제하시겠습니까?")) return;

    try {
      const res = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          timestamp: String(timestamp),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "일기 삭제에 실패했습니다.");
      }

      alert("일기가 삭제되었습니다.");
      fetchDiaryList();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "삭제 중 오류가 발생했습니다.");
    }
  };

  // 목록에서 본문으로 불러와 분석하기
  const handleLoadToEditor = (record: DiaryRecord) => {
    setDiaryText(record.content);
    setIsListModalOpen(false);
  };

  // AI 분석 실행
  const handleAnalyze = async () => {
    if (!diaryText.trim()) {
      alert("일기 내용을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diaryText,
          dateString: `${currentDateFormatted} ${currentTimeStr}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "분석 요청에 실패했습니다.");
      }

      setAnalysisResult(data);
      setAiSelectedEmotion(data.dominantEmotion);
      setSelectedEmotion(data.dominantEmotion);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "감성 분석 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 재시작 (일기 작성 및 모든 상태 초기화)
  const handleReset = () => {
    setDiaryText("");
    setSelectedEmotion(null);
    setAiSelectedEmotion(null);
    setAnalysisResult(null);
  };

  // 주간 캘린더 생성 (오늘을 기준으로 7일 표시)
  const getWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const days = ["월", "화", "수", "목", "금", "토", "일"];

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + mondayOffset + i);
      return {
        day: days[i],
        date: d.getDate(),
        isToday: d.getDate() === today.getDate() && d.getMonth() === today.getMonth(),
      };
    });
  };

  const weekDays = getWeekDays();

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 flex flex-col items-center text-slate-800 antialiased">
      <div className="w-full max-w-[38rem] space-y-4">
        {/* 상단 헤더 */}
        <header className="text-center pt-1 pb-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px]">
            AI 일기 감성 분석
          </h1>
        </header>

        {/* 날짜 표시 카드 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700">
              {currentDateFormatted || "오늘"}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {currentTimeStr}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {weekDays.map((item) => {
              const isSelected = selectedDate === item.date;
              return (
                <button
                  key={`${item.day}-${item.date}`}
                  type="button"
                  onClick={() => setSelectedDate(item.date)}
                  className={`flex flex-col items-center py-2 rounded-xl transition text-xs ${
                    isSelected
                      ? "bg-blue-600 text-white font-semibold shadow-sm"
                      : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <span className={`text-[11px] ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                    {item.day}
                  </span>
                  <span className={`text-xs mt-0.5 font-bold ${!isSelected && item.day === "일" ? "text-sky-500" : ""}`}>
                    {item.date}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 일기 작성 카드 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          {/* 상단 액션 바: 오른쪽 [저장] & [일기보기] 버튼 */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500">일기 작성</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSaveDiary}
                disabled={isSaving}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition cursor-pointer flex items-center gap-1 active:scale-95 disabled:opacity-50"
              >
                <span>💾</span>
                <span>{isSaving ? "저장 중..." : "저장"}</span>
              </button>
              <button
                type="button"
                onClick={handleOpenDiaryList}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium transition cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>📖</span>
                <span>일기보기</span>
              </button>
            </div>
          </div>

          {/* 공책 줄눈 텍스트 입력창 */}
          <div className="relative">
            <textarea
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              placeholder="오늘 하루 있었던 일과 마음속의 감정을 편안하게 적어보세요..."
              rows={7}
              className="w-full notebook-paper text-slate-700 text-sm leading-[2rem] border-none outline-none resize-none focus:ring-0 placeholder:text-slate-300 p-0"
            />
          </div>

          {/* 하단 글자 수 카운터 */}
          <div className="flex items-center justify-end pt-3 mt-1 border-t border-slate-100 text-[11px] text-slate-400">
            <div>
              <span>글자 수 </span>
              <strong className="text-slate-600 font-medium">{diaryText.length}자</strong>
            </div>
          </div>
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="flex items-center gap-2.5">
          {/* Gemini 감성 분석 버튼 */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-xs shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>감성을 분석하는 중...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Gemini 감성 분석</span>
              </>
            )}
          </button>

          {/* 재시작 버튼 */}
          <button
            type="button"
            onClick={handleReset}
            className="py-3 px-5 rounded-xl bg-white border border-slate-200 text-slate-600 font-medium text-xs hover:bg-slate-50 active:scale-[0.99] transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>🔄</span>
            <span>재시작</span>
          </button>
        </div>

        {/* 오늘의 감정 주파수 (이모지 영역 - 분석 완료 시 화면에 노출) */}
        {analysisResult && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-slate-700">오늘의 감정 주파수</h2>
              <span className="text-[11px] text-blue-600 font-medium">분석 완료</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {EMOTIONS.map((emotion) => {
                const isAiSelected = aiSelectedEmotion === emotion.id;
                const isUserSelected = selectedEmotion === emotion.id;
                const isHighlighted = isAiSelected || isUserSelected;

                return (
                  <div key={emotion.id} className="relative flex flex-col items-center">
                    {isAiSelected && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap z-10">
                        AI 선정
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedEmotion(emotion.id)}
                      className={`w-full py-3 px-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
                        isHighlighted
                          ? "border border-blue-500 bg-blue-50/60 shadow-sm"
                          : "border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 bg-white"
                      }`}
                    >
                      <span className="text-2xl">{emotion.emoji}</span>
                      <span
                        className={`text-[11px] ${
                          isHighlighted ? "text-blue-700 font-bold" : "text-slate-500"
                        }`}
                      >
                        {emotion.label}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI 일기 감성 분석 결과 영역 (분석 완료 시 화면에 노출) */}
        {analysisResult && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_6px_rgba(0,0,0,0.04)] space-y-4 animate-in fade-in duration-300">
            {/* 리포트 상단 헤더 */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm border border-blue-100">
                  ✦
                </span>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">
                    Gemini 감성 리포트 & 처방전
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    gemini-3.8-flash
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold text-[11px] border border-blue-100">
                안정 지수 {analysisResult.emotionScore}%
              </span>
            </div>

            {/* 감정 구성도 바 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-600">감정 구성도</span>
                <span className="text-slate-400">{analysisResult.sentimentBreakdownLabel}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${analysisResult.sentimentBreakdown.peaceful}%` }}
                  className="bg-teal-400 transition-all duration-500"
                  title="평온"
                />
                <div
                  style={{ width: `${analysisResult.sentimentBreakdown.positive}%` }}
                  className="bg-sky-400 transition-all duration-500"
                  title="긍정"
                />
                <div
                  style={{ width: `${analysisResult.sentimentBreakdown.reflective}%` }}
                  className="bg-indigo-300 transition-all duration-500"
                  title="성찰"
                />
              </div>
            </div>

            {/* 핵심 마음 문장 */}
            {analysisResult.keySentimentSentence && (
              <div className="bg-slate-50 border-l-2 border-blue-500 rounded-r-xl p-3">
                <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider block mb-0.5">
                  핵심 마음 문장
                </span>
                <p className="text-xs font-medium text-slate-700 italic">
                  &ldquo;{analysisResult.keySentimentSentence}&rdquo;
                </p>
              </div>
            )}

            {/* Gemini의 마음 처방전 */}
            <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <span className="text-blue-500">ℹ</span>
                <span>마음 처방전</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {analysisResult.prescription}
              </p>
            </div>

            {/* 추천 BGM 및 온기 차 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/70">
                <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-xs border border-teal-100">
                  🎵
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block">추천 BGM</span>
                  <span className="text-xs font-semibold text-slate-700 truncate block">
                    {analysisResult.recommendedBgm}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/70">
                <span className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-xs border border-sky-100">
                  🍵
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block">오늘의 차</span>
                  <span className="text-xs font-semibold text-slate-700 truncate block">
                    {analysisResult.recommendedTea}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 세련된 푸터 영역 */}
        <footer className="pt-8 pb-10 mt-6 border-t border-slate-100 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Gemini 3.8 Flash Engine</span>
            <span className="text-slate-300">•</span>
            <span>Google Sheets Connected</span>
          </div>
          <p className="text-[11px] text-slate-400 tracking-wide font-normal">
            Copyright &copy; INU Diary AI Sentiments Analyzer by Young Kwon. All rights reserved.
          </p>
        </footer>
      </div>

      {/* 일기 목록 팝업 모달 (CRUD 지원) */}
      {isListModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-xl border border-slate-200">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-800">📖 구글 시트 일기 목록</span>
                <span className="text-xs text-slate-400">({diaryList.length}건)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchDiaryList}
                  disabled={isFetchingList}
                  className="p-1.5 text-xs text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                  title="새로고침"
                >
                  🔄
                </button>
                <button
                  type="button"
                  onClick={() => setIsListModalOpen(false)}
                  className="p-1.5 text-xs text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 모달 리스트 본문 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isFetchingList ? (
                <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>구글 시트에서 일기를 불러오는 중입니다...</span>
                </div>
              ) : diaryList.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  저장된 일기가 없습니다. 새 일기를 작성하여 저장해보세요!
                </div>
              ) : (
                diaryList.map((record) => {
                  const isEditing = editingTimestamp === record.timestamp;

                  return (
                    <div
                      key={record.timestamp}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-blue-700">
                          {record.datetime}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleLoadToEditor(record)}
                            className="text-[11px] text-slate-600 hover:text-blue-600 px-2 py-0.5 rounded bg-white border border-slate-200"
                            title="작성창으로 가져오기"
                          >
                            가져오기
                          </button>
                          {!isEditing ? (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTimestamp(record.timestamp);
                                setEditContentText(record.content);
                              }}
                              className="text-[11px] text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded bg-white border border-slate-200"
                            >
                              수정
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setEditingTimestamp(null)}
                              className="text-[11px] text-slate-400 hover:text-slate-600 px-2 py-0.5 rounded bg-white border border-slate-200"
                            >
                              취소
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteDiary(record.timestamp)}
                            className="text-[11px] text-red-500 hover:text-red-700 px-2 py-0.5 rounded bg-white border border-slate-200"
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            value={editContentText}
                            onChange={(e) => setEditContentText(e.target.value)}
                            rows={3}
                            className="w-full p-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateDiary(record.timestamp)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition"
                          >
                            저장 완료
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {record.content}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* 모달 푸터 */}
            <div className="p-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsListModalOpen(false)}
                className="px-4 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
