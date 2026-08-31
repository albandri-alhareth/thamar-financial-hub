import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM = `أنت "مساعد ثَمَر" التعليمي داخل منصة مالية تجريبية سعودية.
- تشرح مفاهيم الاستدامة المالية، الميزانية، صندوق الطوارئ، أنواع الاستثمار (ذهب، أسهم، بيتكوين، نفط)، مستويات المخاطر، والمؤشرات الاقتصادية (التضخم، الفائدة)، وكيفية قراءة نتائج المنصة.
- أسلوبك تعليمي واستشاري عام ومبسّط ومحايد.
- ممنوع تمامًا: ضمان أي ربح، توقع أسعار محددة، أو إعطاء توصية استثمارية مؤكدة بالشراء أو البيع.
- ذكّر عند الحاجة أن أرقام المنصة تجريبية واسترشادية فقط.
- لا تطلب أي بيانات حساسة (هوية، حساب بنكي، بطاقات، كلمات مرور).
- أجب بلغة المستخدم (عربية أو إنجليزية)، بإجابات قصيرة ومنظمة.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: Msg[] };
        const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
        if (messages.length === 0) return new Response("messages required", { status: 400 });

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": apiKey,
            "X-Lovable-AIG-SDK": "fetch",
          },
          body: JSON.stringify({
            model: "openai/gpt-5.6-sol",
            stream: true,
            store: false,
            instructions: SYSTEM,
            input: messages.map((m) => ({
              role: m.role,
              content: [
                {
                  type: m.role === "assistant" ? "output_text" : "input_text",
                  text: String(m.content ?? ""),
                },
              ],
            })),
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const detail = await upstream.text();
          return new Response(detail || "AI request failed", { status: upstream.status || 500 });
        }

        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        const reader = upstream.body.getReader();
        let buffer = "";

        const stream = new ReadableStream<Uint8Array>({
          async pull(controller) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              return;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.startsWith("data:")) continue;
              const payload = line.slice(5).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const evt = JSON.parse(payload) as { type?: string; delta?: string };
                if (evt.type === "response.output_text.delta" && evt.delta) {
                  controller.enqueue(encoder.encode(evt.delta));
                }
              } catch {
                /* ignore partial frames */
              }
            }
          },
          cancel(reason) {
            return reader.cancel(reason);
          },
        });

        return new Response(stream, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
