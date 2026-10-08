export async function POST(req: Request) {
  try {
    const scriptUrl =
      process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
      process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      return Response.json(
        {
          error:
            ".env.local 파일에 NEXT_PUBLIC_GOOGLE_SCRIPT_URL이 설정되어 있지 않습니다.",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Google Apps Script는 리다이렉트(302)를 따르도록 fetch 수행
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    const data = await res.json();
    return Response.json(data);
  } catch (error: any) {
    console.error("Diary sheets API error:", error);
    return Response.json(
      { error: error?.message || "구글 시트 연동 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const scriptUrl =
      process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
      process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      return Response.json(
        {
          error:
            ".env.local 파일에 NEXT_PUBLIC_GOOGLE_SCRIPT_URL이 설정되어 있지 않습니다.",
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action") || "read";
    const timestamp = searchParams.get("timestamp");

    let targetUrl = `${scriptUrl}?action=${encodeURIComponent(action)}`;
    if (timestamp) {
      targetUrl += `&timestamp=${encodeURIComponent(timestamp)}`;
    }

    const res = await fetch(targetUrl, {
      method: "GET",
      redirect: "follow",
    });

    const data = await res.json();
    return Response.json(data);
  } catch (error: any) {
    console.error("Diary sheets API error:", error);
    return Response.json(
      { error: error?.message || "구글 시트 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
