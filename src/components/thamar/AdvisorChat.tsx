import { useEffect, useRef, useState } from "react";
import { Send, MessageCircleQuestion } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

export function AdvisorChat() {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());

      setMessages([...next, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
      if (!acc.trim()) setError(t("assistantError"));
    } catch {
      setError(t("assistantError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div
        ref={boxRef}
        className="max-h-[380px] min-h-[240px] flex-1 space-y-3 overflow-y-auto rounded-xl bg-secondary/40 p-4"
      >
        <p className="rounded-xl bg-card p-3 text-sm leading-relaxed text-muted-foreground">
          {t("assistantIntro")}
        </p>
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <p
              className={cn(
                "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground",
              )}
            >
              {m.content || (loading ? t("thinking") : "")}
            </p>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role === "user" ? (
          <p className="text-xs text-muted-foreground">{t("thinking")}</p>
        ) : null}
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>

      <form onSubmit={send} className="mt-3 flex items-center gap-2">
        <MessageCircleQuestion className="size-5 shrink-0 text-primary-strong" aria-hidden />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("assistantPh")}
          dir={lang === "ar" ? "rtl" : "ltr"}
          aria-label={t("assistant")}
        />
        <Button type="submit" disabled={loading || !input.trim()} size="icon" aria-label={t("send")}>
          <Send className="size-4 rtl:-scale-x-100" aria-hidden />
        </Button>
      </form>
    </div>
  );
}
