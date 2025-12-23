export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name } = req.body;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      process.env.GOOGLE_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
너는 우체국 집배원을 돕는 수취인불명 인명부 시스템이다.
이름 "${name}" 이 수취인불명 인명부에 있는지 확인해라.

- 있으면: 간단한 메모 형태로 알려줘
- 없으면: "해당 없음"이라고만 답해라
`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();

  res.status(200).json({
    result:
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "결과 없음"
  });
}
