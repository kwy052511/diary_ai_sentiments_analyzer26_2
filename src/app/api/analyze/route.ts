import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const SentimentResultSchema = z.object({
  dominantEmotion: z
    .enum(["very_good", "peaceful", "neutral", "sad", "stressed"])
    .describe("가장 지배적인 대표 감정 1개"),
  emotionScore: z.number().min(0).max(100).describe("안정 지수 또는 긍정 지수 (0~100 사이 숫자)"),
  sentimentBreakdown: z.object({
    peaceful: z.number().min(0).max(100).describe("평온/위안 비율 %"),
    positive: z.number().min(0).max(100).describe("기쁨/만족 비율 %"),
    reflective: z.number().min(0).max(100).describe("성찰/아쉬움 비율 %"),
  }),
  sentimentBreakdownLabel: z
    .string()
    .describe("감정 구성 비율 요약 라벨 (예: '평온(65%) • 위안(25%) • 아쉬움(10%)')"),
  keySentimentSentence: z
    .string()
    .describe("일기 내용 중 가장 인상 깊거나 감정을 잘 드러내는 핵심 마음 문장 한 구절"),
  prescription: z
    .string()
    .describe("사용자의 하루를 보듬어주고 따뜻한 위로와 격려를 건네는 Gemini의 마음 처방전 (2~3문장)"),
  recommendedBgm: z
    .string()
    .describe("오늘 일기 분위기에 어울리는 추천 클래식/음악 (예: 'Debussy - Clair de Lune')"),
  recommendedTea: z
    .string()
    .describe("마음을 편안하게 해 줄 추천 차 또는 음료 (예: '따뜻한 카모마일 블렌드')"),
  keywords: z
    .array(z.string())
    .max(3)
    .describe("일기에서 추출한 주요 감성 태그 2~3개 (예: ['퇴근길', '늦은오후의커피'])"),
});

export async function POST(req: Request) {
  try {
    const { diaryText, dateString } = await req.json();

    if (!diaryText || typeof diaryText !== "string" || !diaryText.trim()) {
      return Response.json({ error: "일기 내용을 입력해주세요." }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error:
            ".env.local 파일에 GEMINI_API_KEY 또는 GOOGLE_GENERATIVE_AI_API_KEY가 설정되어 있지 않습니다.",
        },
        { status: 500 }
      );
    }

    const google = createGoogleGenerativeAI({
      apiKey,
    });

    const result = await generateObject({
      model: google("gemini-3.8-flash"),
      schema: SentimentResultSchema,
      prompt: `다음은 사용자가 작성한 일기입니다.
작성 일자: ${dateString || "오늘"}
일기 본문:
"""
${diaryText}
"""

당신은 공감 능력이 깊고 섬세한 감성 심리 분석가 '하루의 기록 & 감성 연구소'의 AI 연구원입니다.
이 일기를 읽고 글쓴이의 숨겨진 감정을 정밀하게 파악하여 다음 5가지 감정 중 하나를 가장 지배적인 감정으로 선택하세요:
- 'very_good' (아주 좋음: 벅찬 행복, 기쁨, 설렘)
- 'peaceful' (평온함: 잔잔한 안도감, 고요함, 따뜻한 위안)
- 'neutral' (그저 그럼: 덤덤함, 일상적인 무난함)
- 'sad' (슬픔: 눈물, 외로움, 그리움, 우울)
- 'stressed' (스트레스: 불안, 화남, 답답함, 지침)

그리고 따뜻하고 사려 깊은 어조로 마음 처방전과 어울리는 BGM, 차(Tea)를 추천해주세요.`,
    });

    return Response.json(result.object);
  } catch (error: any) {
    console.error("Sentiment analysis error:", error);
    return Response.json(
      { error: error?.message || "감성 분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
